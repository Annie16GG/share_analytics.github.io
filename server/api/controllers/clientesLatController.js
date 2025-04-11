const db = require('../../config/db_singlestoreKarem');

exports.getClientes = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Cuentas WHERE id_ejecutivo = ?';

  try {
    const [results] = await db.query(query, [id]);
  const formattedResults = results.map((row) => {
    if (row.fecha_ultimo_acercamiento) {
      row.fecha_ultimo_acercamiento = new Date(row.fecha_ultimo_acercamiento).toISOString().split('T')[0];
    }
    if (row.fecha_primer_acercamiento) {
      row.fecha_primer_acercamiento = new Date(row.fecha_primer_acercamiento).toISOString().split('T')[0];
    }
    if (row.fecha_cita) {
        row.fecha_cita = new Date(row.fecha_cita).toISOString().split('T')[0];
      }
    return row;
  });

 
    return res.status(200).json(formattedResults);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
exports.agregarCuenta = async (req, res) => {
    const {
      id_ejecutivo,
      ejecutivo_de_cuenta,
      prioridad_cuenta,
      nombre_empresa,
      industria,
      sitio_web_empresa,
      numero_empleados,
      pais,
      nombre_contacto,
      apellidos_contacto,
      email,
      telefono,
      linkedin,
      puesto_contacto,
      tag_venta,
      estatus_cuenta,
      fecha_primer_acercamiento,
      fecha_ultimo_acercamiento,
      fecha_cita,
      monto_venta,
      notas_adicionales
    } = req.body;
  
    try {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
  
        const insertCuentaQuery = `
          INSERT INTO Cuentas (
            id_ejecutivo,
            ejecutivo_de_cuenta,
            prioridad_cuenta,
            nombre_empresa,
            industria,
            sitio_web_empresa,
            numero_empleados,
            pais,
            nombre_contacto,
            apellidos_contacto,
            email,
            telefono,
            linkedin,
            puesto_contacto,
            tag_venta,
            estatus_cuenta,
            fecha_primer_acercamiento,
            fecha_ultimo_acercamiento,
            fecha_cita,
            monto_venta,
            notas_adicionales
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
  
        await connection.query(insertCuentaQuery, [
          id_ejecutivo,
          ejecutivo_de_cuenta,
          prioridad_cuenta,
          nombre_empresa,
          industria,
          sitio_web_empresa,
          numero_empleados,
          pais,
          nombre_contacto,
          apellidos_contacto,
          email,
          telefono,
          linkedin,
          puesto_contacto,
          tag_venta,
          estatus_cuenta,
          fecha_primer_acercamiento,
          fecha_ultimo_acercamiento,
          fecha_cita,
          monto_venta,
          notas_adicionales
        ]);
  
        await connection.commit();
        res.status(201).json({ message: 'Cuenta agregada exitosamente' });
      } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
      } finally {
        connection.release();
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
exports.getCuentaById = async (req, res) => {
    const { id } = req.params;
  
    const query = `
      SELECT 
        id,
        ejecutivo_de_cuenta,
        prioridad_cuenta,
        nombre_empresa,
        industria,
        sitio_web_empresa,
        numero_empleados,
        pais,
        nombre_contacto,
        apellidos_contacto,
        email,
        telefono,
        linkedin,
        puesto_contacto,
        tag_venta,
        estatus_cuenta,
        DATE_FORMAT(fecha_primer_acercamiento, '%Y-%m-%d') AS fecha_primer_acercamiento,
        DATE_FORMAT(fecha_ultimo_acercamiento, '%Y-%m-%d') AS fecha_ultimo_acercamiento,
        DATE_FORMAT(fecha_cita, '%Y-%m-%d') AS fecha_cita,
        monto_venta,
        notas_adicionales
      FROM Cuentas
      WHERE id = ?
    `;
  
    try {
      const [results] = await db.query(query, [id]);
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
};
exports.updateCuenta = async (req, res) => {
    const { id } = req.params;
    const {
      estatus_cuenta,
      fecha_ultimo_acercamiento,
      monto_venta,
      notas_adicionales,
    } = req.body;
  
    const query = `
      UPDATE Cuentas
      SET
        estatus_cuenta = ?,
        fecha_ultimo_acercamiento = ?,
        monto_venta = ?,
        notas_adicionales = ?
      WHERE id = ?
    `;
  
    const values = [
      estatus_cuenta,
      fecha_ultimo_acercamiento,
      monto_venta,
      notas_adicionales,
      id,
    ];
  
    try {
      const [results] = await db.query(query, values);
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Cuenta no encontrada" });
      }
  
      return res.status(200).json({ message: "Cuenta actualizada exitosamente" });
    } catch (err) {
      console.error("Error al actualizar la cuenta:", err.message);
      return res.status(500).json({ error: "Error al actualizar la cuenta" });
    }
  };
  
  





