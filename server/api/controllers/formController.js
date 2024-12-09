// formController.js

const db = require("../../config/db_singlestore");
// const db_ss = require("../../config/db_singlestore");

exports.getForms = (req, res) => {
  const query = "SELECT id, name FROM forms";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getFormById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM forms WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      try {
        console.log(results);
        const name = results[0].name;
        // Asegúrate de que la configuración es una cadena JSON
        const configString = JSON.stringify(results[0].config);
        console.log("Config obtenida de la base de datos:", configString);
        const config = JSON.parse(configString);
        return res.status(200).json({
          name: name,
          config: config
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return res
          .status(500)
          .json({ error: "Invalid JSON format in database" });
      }
    } else {
      return res.status(404).json({ message: "Form not found" });
    }
  });
};

exports.addForm = (req, res) => {
  const { name, config } = req.body;
  const query = "INSERT INTO forms (name, config) VALUES (?, ?)";
  db.query(query, [name, config], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(query);
    // Crear una nueva tabla basada en la configuración del formulario
    const formConfig = JSON.parse(config);
    console.log(formConfig);
    const tableName = name.replace(/\s+/g, "_").toLowerCase(); // Asegurarse de que el nombre de la tabla sea válido

    // Construir la consulta de creación de tabla
    let createTableQuery = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY`;
    formConfig.fields.forEach((field) => {
      if (field.name.toLowerCase() !== "id") {
        switch (field.type) {
          case "text":
            createTableQuery += `, ${field.name} VARCHAR(255)`;
            break;
          case "textarea":
            createTableQuery += `, ${field.name} TEXT`;
            break;
          case "date":
            createTableQuery += `, ${field.name} DATE`;
            break;
          case "time":
            createTableQuery += `, ${field.name} TIME`;
            break;
          case "number":
            createTableQuery += `, ${field.name} INT`;
            break;
          case "checkbox":
            createTableQuery += `, ${field.name} BOOLEAN`;
            break;
          default:
            createTableQuery += `, ${field.name} VARCHAR(255)`;
        }
      }
    });
    createTableQuery += ")";
    console.log(createTableQuery);
    // Ejecutar la consulta de creación de tabla
    db.query(createTableQuery, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res
        .status(201)
        .json({
          success: true,
          message: "Formulario y tabla creados exitosamente",
        });
    });
  });
};


exports.submitForm = (req, res) => {
  console.log('Request body:', req.body); // Registro del cuerpo de la solicitud

  const formData = req.body;
  
  // Verificar que formName esté presente en formData
  if (!formData.formName) {
    return res.status(400).json({ success: false, error: 'Form name is required' });
  }

  const tableName = formData.formName.replace(/\s+/g, '_').toLowerCase(); // El nombre de la tabla basada en el nombre del formulario

  // Eliminar formName de formData
  delete formData.formName;

  // Variables para almacenar los datos a insertar
  let datosParaGuardar = { ...formData };

  if (tableName === 'registros') {
    // Conversión de horas a formato decimal fraccionario
    const horaToDecimal = (hora) => {
      if (!hora) return 0;
      const [hh, mm, ss] = hora.split(':').map(Number);
      if (isNaN(hh) || isNaN(mm) || isNaN(ss)) {
        console.error('Error en la conversión de la hora:', hora);
        return NaN;
      }
      return (hh + (mm / 60) + (ss / 3600)) / 24;
    };

    const horaRegistro = horaToDecimal(formData['Hora Registro']);
    const horaEscalacion = horaToDecimal(formData['Hora Escalación']);
    
    console.log('Hora de registro (decimal):', horaRegistro);
    console.log('Hora de escalación (decimal):', horaEscalacion);

    // Verificar si horaRegistro o horaEscalacion son NaN
    if (isNaN(horaRegistro) || isNaN(horaEscalacion)) {
      console.error('Error: horaRegistro o horaEscalacion es NaN');
      return res.status(400).json({ success: false, error: 'Invalid hour format' });
    }

    // Calcula tiempo de atención en horas decimales
    const tiempoDeAtencion = parseFloat((horaEscalacion - horaRegistro).toFixed(8));
    console.log('Tiempo de atención:', tiempoDeAtencion);

    // Verificar si tiempoDeAtencion es NaN
    if (isNaN(tiempoDeAtencion)) {
      console.error('Error: tiempoDeAtencion es NaN');
      return res.status(400).json({ success: false, error: 'Invalid time duration' });
    }

    // Calcula si tiene hora
    const tieneHora = formData['Hora Escalación'] ? true : false;

    // Determina el intervalo
    let intervalo = "Mayor a 30";
    if (tiempoDeAtencion < 0.003472222) intervalo = "Menor a 5 min";
    else if (tiempoDeAtencion < 0.006944444) intervalo = "Entre 5 y 10 min";
    else if (tiempoDeAtencion < 0.01041666) intervalo = "Entre 10 y 15 min";
    else if (tiempoDeAtencion < 0.020833333) intervalo = "Entre 15 y 30 min";
    console.log('Intervalo:', intervalo);

    // Determina si cumple
    const cumple = tiempoDeAtencion < 0.010416667;
    console.log('Cumple:', cumple);

    // Extraer categoría final
    const categoriaFinal = formData['Categoría Dispatch'] ? formData['Categoría Dispatch'].split("#").pop().trim() : "";
    console.log('Categoría final:', categoriaFinal);

    // Determina el rango de horas
    let rangoHoras = "0";
    if (horaRegistro >= 0.04 && horaRegistro < 0.08) rangoHoras = "A1";
    else if (horaRegistro >= 0.08 && horaRegistro < 0.13) rangoHoras = "B2";
    else if (horaRegistro >= 0.13 && horaRegistro < 0.17) rangoHoras = "C3";
    else if (horaRegistro >= 0.17 && horaRegistro < 0.21) rangoHoras = "D4";
    else if (horaRegistro >= 0.21 && horaRegistro < 0.25) rangoHoras = "E5";
    else if (horaRegistro >= 0.25 && horaRegistro < 0.29) rangoHoras = "F6";
    else if (horaRegistro >= 0.29 && horaRegistro < 0.33) rangoHoras = "G7";
    else if (horaRegistro >= 0.33 && horaRegistro < 0.38) rangoHoras = "H8";
    else if (horaRegistro >= 0.38 && horaRegistro < 0.42) rangoHoras = "I9";
    else if (horaRegistro >= 0.42 && horaRegistro < 0.46) rangoHoras = "J10";
    else if (horaRegistro >= 0.46 && horaRegistro < 0.50) rangoHoras = "K11";
    else if (horaRegistro >= 0.50 && horaRegistro < 0.54) rangoHoras = "L12";
    else if (horaRegistro >= 0.54 && horaRegistro < 0.58) rangoHoras = "M13";
    else if (horaRegistro >= 0.58 && horaRegistro < 0.63) rangoHoras = "N14";
    else if (horaRegistro >= 0.63 && horaRegistro < 0.67) rangoHoras = "O15";
    else if (horaRegistro >= 0.67 && horaRegistro < 0.71) rangoHoras = "P16";
    else if (horaRegistro >= 0.71 && horaRegistro < 0.75) rangoHoras = "Q17";
    else if (horaRegistro >= 0.75 && horaRegistro < 0.79) rangoHoras = "R18";
    else if (horaRegistro >= 0.79 && horaRegistro < 0.83) rangoHoras = "S19";
    else if (horaRegistro >= 0.83 && horaRegistro < 0.88) rangoHoras = "T20";
    else if (horaRegistro >= 0.88 && horaRegistro < 0.92) rangoHoras = "U21";
    else if (horaRegistro >= 0.92 && horaRegistro < 0.96) rangoHoras = "V22";
    else if (horaRegistro >= 0.96 && horaRegistro < 1.0) rangoHoras = "W23";
    // Añadir más condiciones según sea necesario...
    console.log('Rango de horas:', rangoHoras);

    // Agregar los campos calculados al objeto de datos
    datosParaGuardar = {
      ...datosParaGuardar,
      'Tiene Hora': tieneHora,
      Intevalo: intervalo,
      Cumple: cumple,
      'Categoria Final': categoriaFinal,
      'Rango Horas': rangoHoras,
    };
  }

  if (tableName === 'Vehiculos') {
    // Validación de los campos del formulario de vehículos
    const errors = {};

    // Validar campo 'Fecha'
    if (!formData.Fecha || formData.Fecha.trim() === "") {
      errors.Fecha = "El campo 'Fecha' es obligatorio.";
    }

    // Validar campo 'Recurso'
    if (!formData.Recurso || formData.Recurso.trim() === "") {
      errors.Recurso = "El campo 'Recurso' es obligatorio.";
    }

    // Validar campo 'Proyecto'
    if (!formData.Proyecto || formData.Proyecto.trim() === "") {
      errors.Proyecto = "El campo 'Proyecto' es obligatorio.";
    }

    // Validar campo 'Horas'
    if (!formData.Horas || formData.Horas.trim() === "") {
      errors.Horas = "El campo 'Horas' es obligatorio.";
    }

    // Si hay errores, retornar un error
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Transformaciones de datos, si son necesarias...
    // Ejemplo: Si necesitas transformar el campo Horas en otro formato

    // Agregar los campos calculados al objeto de datos
    datosParaGuardar = {
      ...datosParaGuardar,
      // Otros campos calculados si es necesario
    };
  }

  if (tableName === 'Calendario') {
    // Validación de los campos del formulario de CalendarioM_flotilla
    const errors = {};

    // Validar campo 'Monto'
    if (!formData.Monto || isNaN(formData.Monto) || formData.Monto < 0) {
      errors.Monto = "El campo 'Monto' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Validar campo 'ID'
    if (!formData.ID || isNaN(formData.ID) || formData.ID < 0) {
      errors.ID = "El campo 'ID' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Validar campo 'DiasFaltantes'
    if (!formData.DiasFaltantes || isNaN(formData.DiasFaltantes) || formData.DiasFaltantes < 0) {
      errors.DiasFaltantes = "El campo 'Días Faltantes' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Validar campo 'Hoy'
    if (!formData.Hoy || isNaN(Date.parse(formData.Hoy))) {
      errors.Hoy = "El campo 'Hoy' es obligatorio y debe ser una fecha válida.";
    }

    // Validar campo 'FechaEvento'
    if (!formData.FechaEvento || isNaN(Date.parse(formData.FechaEvento))) {
      errors.FechaEvento = "El campo 'Fecha del Evento' es obligatorio y debe ser una fecha válida.";
    }

    // Validar campo 'VehiculoID'
    if (!formData.VehiculoID || isNaN(formData.VehiculoID) || formData.VehiculoID < 0) {
      errors.VehiculoID = "El campo 'Vehículo ID' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Validar campo 'Tipo'
    if (!formData.Tipo || formData.Tipo.trim() === "") {
      errors.Tipo = "El campo 'Tipo' es obligatorio.";
    }

    // Si hay errores, retornar un error
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Preparar los datos para guardar
    const datosParaGuardar = {
      Monto: formData.Monto,
      ID: formData.ID,
      DiasFaltantes: formData.DiasFaltantes,
      Hoy: formData.Hoy,
      FechaEvento: formData.FechaEvento,
      VehiculoID: formData.VehiculoID,
      Tipo: formData.Tipo,
    };

    // Lógica para insertar en la base de datos
    // db.insert('CalendarioM_flotilla', datosParaGuardar);
  }

  if (tableName === 'Asignacion') {
    // Validación de los campos del formulario de Persona
    const errors = {};

    // Validar campo 'Persona'
    if (!formData.Persona || formData.Persona.trim() === "") {
      errors.Persona = "El campo 'Persona' es obligatorio.";
    }

    // Validar campo 'AsignacionID'
    if (!formData.AsignacionID || isNaN(formData.AsignacionID) || formData.AsignacionID < 0) {
      errors.AsignacionID = "El campo 'Asignación ID' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Validar campo 'FechaInicio'
    if (!formData.FechaInicio || isNaN(Date.parse(formData.FechaInicio))) {
      errors.FechaInicio = "El campo 'Fecha de Inicio' es obligatorio y debe ser una fecha válida.";
    }

    // Validar campo 'FechaFin'
    if (!formData.FechaFin || isNaN(Date.parse(formData.FechaFin))) {
      errors.FechaFin = "El campo 'Fecha de Fin' es obligatorio y debe ser una fecha válida.";
    }

    // Validar campo 'VehiculoID'
    if (!formData.VehiculoID || isNaN(formData.VehiculoID) || formData.VehiculoID < 0) {
      errors.VehiculoID = "El campo 'Vehículo ID' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Si hay errores, retornar un error
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Preparar los datos para guardar
    const datosParaGuardar = {
      Persona: formData.Persona,
      AsignacionID: formData.AsignacionID,
      FechaInicio: formData.FechaInicio,
      FechaFin: formData.FechaFin,
      VehiculoID: formData.VehiculoID,
    };

    // Lógica para insertar en la base de datos
    // db.insert('Persona', datosParaGuardar);
  }

  if (tableName === 'coordenadas') {
    // Validación de los campos del formulario de Coordenadas
    const errors = {};

    // Validar campo 'VehiculoID'
    if (!formData.VehiculoID || isNaN(formData.VehiculoID) || formData.VehiculoID < 0) {
      errors.VehiculoID = "El campo 'Vehículo ID' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Validar campo 'GpsID'
    if (!formData.GpsID || isNaN(formData.GpsID) || formData.GpsID < 0) {
      errors.GpsID = "El campo 'GPS ID' es obligatorio y debe ser un número mayor o igual a 0.";
    }

    // Si hay errores, retornar un error
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Preparar los datos para guardar
    const datosParaGuardar = {
      CoordenadasX: formData.CoordenadasX,
      VehiculoID: formData.VehiculoID,
      GpsID: formData.GpsID,
      CoordenadasY: formData.CoordenadasY,
    };

    // Lógica para insertar en la base de datos
    // db.insert('Coordenadas', datosParaGuardar);
  }

  // Construir la consulta de inserción, escapando los nombres de columna
  const columns = Object.keys(datosParaGuardar).map(column => `\`${column}\``).join(', ');
  const values = Object.values(datosParaGuardar).map(value => db.escape(value)).join(', ');

  console.log('Datos para guardar:', datosParaGuardar);
  console.log('Consulta SQL:', `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`);

  const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.status(201).json({ success: true, message: 'Datos guardados exitosamente' });
  });
};


// exports.submitForm = (req, res) => {
//   console.log('Request body:', req.body); // Registro del cuerpo de la solicitud

//   const formData = req.body;
  
//   // Verificar que formName esté presente en formData
//   if (!formData.formName) {
//     return res.status(400).json({ success: false, error: 'Form name is required' });
//   }

//   const tableName = formData.formName.replace(/\s+/g, '_').toLowerCase(); // El nombre de la tabla basada en el nombre del formulario

//   // Eliminar formName de formData
//   delete formData.formName;

//   // Variables para almacenar los datos a insertar
//   let datosParaGuardar = { ...formData };

//   if (tableName === 'registros') {
//     // Conversión de horas a formato decimal fraccionario
//     const horaToDecimal = (hora) => {
//       if (!hora) return 0;
//       const [hh, mm, ss] = hora.split(':').map(Number);
//       if (isNaN(hh) || isNaN(mm) || isNaN(ss)) {
//         console.error('Error en la conversión de la hora:', hora);
//         return NaN;
//       }
//       return (hh + (mm / 60) + (ss /3600)) / 24;
//     };

//     const horaRegistro = horaToDecimal(formData.hora_registro);
//     const horaEscalacion = horaToDecimal(formData.hora_escalacion);
    
//     console.log('Hora de registro (decimal):', horaRegistro);
//     console.log('Hora de escalación (decimal):', horaEscalacion);

//     // Verificar si horaRegistro o horaEscalacion son NaN
//     if (isNaN(horaRegistro) || isNaN(horaEscalacion)) {
//       console.error('Error: horaRegistro o horaEscalacion es NaN');
//       return res.status(400).json({ success: false, error: 'Invalid hour format' });
//     }

//     // Calcula tiempo de atención en horas decimales
//     const tiempoDeAtencion = parseFloat((horaEscalacion - horaRegistro).toFixed(8));
//     console.log('Tiempo de atención:', tiempoDeAtencion);

//     // Verificar si tiempoDeAtencion es NaN
//     if (isNaN(tiempoDeAtencion)) {
//       console.error('Error: tiempoDeAtencion es NaN');
//       return res.status(400).json({ success: false, error: 'Invalid time duration' });
//     }

//     // Calcula si tiene hora
//     const tieneHora = formData.hora_escalacion ? true : false;

//     // Determina el intervalo
//     let intervalo = "Mayor a 30";
//     if (tiempoDeAtencion < 0.003472222) intervalo = "Menor a 5 min";
//     else if (tiempoDeAtencion < 0.006944444) intervalo = "Entre 5 y 10 min";
//     else if (tiempoDeAtencion < 0.01041666) intervalo = "Entre 10 y 15 min";
//     else if (tiempoDeAtencion < 0.020833333) intervalo = "Entre 15 y 30 min";
//     console.log('Intervalo:', intervalo);

//     // Determina si cumple
//     const cumple = tiempoDeAtencion < 0.010416667;
//     console.log('Cumple:', cumple);

//     // Extraer categoría final
//     const categoriaFinal = formData.categoria_dispatch ? formData.categoria_dispatch.split("#").pop().trim() : "";
//     console.log('Categoría final:', categoriaFinal);

//     // Determina el rango de horas
//     let rangoHoras = "0";
//     if (horaRegistro >= 0.04 && horaRegistro < 0.08) rangoHoras = "A1";
//     else if (horaRegistro >= 0.08 && horaRegistro < 0.13) rangoHoras = "B2";
//     else if (horaRegistro >= 0.13 && horaRegistro < 0.17) rangoHoras = "C3";
//     else if (horaRegistro >= 0.17 && horaRegistro < 0.21) rangoHoras = "D4";
//     else if (horaRegistro >= 0.21 && horaRegistro < 0.25) rangoHoras = "E5";
//     else if (horaRegistro >= 0.25 && horaRegistro < 0.29) rangoHoras =  "F6";
//     else if (horaRegistro >= 0.29 && horaRegistro < 0.33) rangoHoras =  "G7";
//     else if (horaRegistro >= 0.33 && horaRegistro < 0.38) rangoHoras =  "H8";
//     else if (horaRegistro >= 0.38 && horaRegistro < 0.42) rangoHoras =  "I9";
//     else if (horaRegistro >= 0.42 && horaRegistro < 0.46) rangoHoras =  "J10";
//     else if (horaRegistro >= 0.46 && horaRegistro < 0.50) rangoHoras =  "K11";
//     else if (horaRegistro >= 0.50 && horaRegistro < 0.54) rangoHoras =  "L12";
//     else if (horaRegistro >= 0.54 && horaRegistro < 0.58) rangoHoras =  "M13";
//     else if (horaRegistro >= 0.58 && horaRegistro < 0.63) rangoHoras =  "N14";
//     else if (horaRegistro >= 0.63 && horaRegistro < 0.67) rangoHoras =  "O15";
//     else if (horaRegistro >= 0.67 && horaRegistro < 0.71) rangoHoras =  "P16";
//     else if (horaRegistro >= 0.71 && horaRegistro < 0.75) rangoHoras =  "Q17";
//     else if (horaRegistro >= 0.75 && horaRegistro < 0.79) rangoHoras =  "R18";
//     else if (horaRegistro >= 0.79 && horaRegistro < 0.83) rangoHoras =  "S19";
//     else if (horaRegistro >= 0.83 && horaRegistro < 0.88) rangoHoras =  "T20";
//     else if (horaRegistro >= 0.88 && horaRegistro < 0.92) rangoHoras =  "U21";
//     else if (horaRegistro >= 0.92 && horaRegistro < 0.96) rangoHoras =  "V22";
//     else if (horaRegistro >= 0.96 && horaRegistro < 1.0) rangoHoras =  "W23";
//     // Añadir más condiciones según sea necesario...
//     console.log('Rango de horas:', rangoHoras);

//     // Agregar los campos calculados al objeto de datos
//     datosParaGuardar = {
//       ...datosParaGuardar,
//       tiempo_de_atencion: tiempoDeAtencion,
//       tiene_hora: tieneHora,
//       intervalo: intervalo,
//       cumple: cumple,
//       categoria_final: categoriaFinal,
//       rango_horas: rangoHoras,
//     };
//   }

//   // Construir la consulta de inserción
//   const columns = Object.keys(datosParaGuardar).join(', ');
//   const values = Object.values(datosParaGuardar).map(value => db_ss.escape(value)).join(', ');

//   console.log('Datos para guardar:', datosParaGuardar);
//   console.log('Consulta SQL:', `INSERT INTO ${tableName} (${columns}) VALUES (${values})`);

//   const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

//   db_ss.query(query, (err, results) => {
//     if (err) {
//       console.error('Error en la consulta:', err.message);
//       return res.status(500).json({ success: false, error: err.message });
//     }
//     return res.status(201).json({ success: true, message: 'Datos guardados exitosamente' });
//   });
// };


