// formController.js

const db = require("../config/db");
const db_ss = require("../config/db_singlestore");

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

  // Construir la consulta de inserción, escapando los nombres de columna
  const columns = Object.keys(datosParaGuardar).map(column => `\`${column}\``).join(', ');
  const values = Object.values(datosParaGuardar).map(value => db_ss.escape(value)).join(', ');

  console.log('Datos para guardar:', datosParaGuardar);
  console.log('Consulta SQL:', `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`);

  const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;

  db_ss.query(query, (err, results) => {
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


