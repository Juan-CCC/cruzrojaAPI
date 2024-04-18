const { getConnection, sql, querys } = require("../database/connection");
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


exports.getHistorialMedico = async (req, res)=> {
   try {
    const pool = await getConnection()
    const result= await pool.request().query(querys.getHistorialMedico)
    res.json(result.recordset)
   } catch (error) {
    res.status(500);
    res.send(error.message);
   }
};

exports.getHistorialMedicoById = async (req, res) => {
  const {ID_Historial}=req.params
    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    const result= await pool.request()
      .input("ID_Historial", sql.Int, ID_Historial)
      // Usa la contraseña cifrada
      .query(querys.getHistorialMedicoById);
    // Enviar respuesta de éxito
    res.json(result.recordset); 
};

exports.getAntecedentesById = async (req, res) => {
  const {ID_Historial}=req.params
    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    const result= await pool.request()
      .input("ID_Historial", sql.Int, ID_Historial)
      // Usa la contraseña cifrada
      .query(querys.getAntecedentesById);
    // Enviar respuesta de éxito
    res.json(result.recordset); 
};

exports.getExpedienteById = async (req, res) => {
  const {ID_Historial}=req.params
    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    const result= await pool.request()
      .input("ID_Historial", sql.Int, ID_Historial)
      // Usa la contraseña cifrada
      .query(querys.getExpedienteById);
    // Enviar respuesta de éxito
    res.json(result.recordset); 
};

exports.createNewHistorialM = async (req, res) => {
   const { nombre,apellido_Paterno,apellido_Materno,edad,Municipio,colonia,calle,telefono,nombre_Contacto,
         apellidoP_Contacto,apellidoM_Contacto,telefono_Contacto,alergico_Medicamento,ID_Asociado} = req.body;
 
   // Verificar si todos los campos están presentes
   if (nombre == null || apellido_Paterno == null || apellido_Materno == null || edad == null || 
      Municipio == null || colonia == null || calle== null || telefono==null || nombre_Contacto==null || 
      apellidoP_Contacto==null || apellidoM_Contacto==null || telefono_Contacto==null || alergico_Medicamento==null ||
      ID_Asociado==null) {
     return res.status(400).json({ msg: "Por favor llene todos los campos" });
   }
 
   try {
     //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
     const pool = await getConnection();
     await pool.request()
       .input("nombre", sql.VarChar, nombre)
       .input("apellido_Paterno", sql.VarChar, apellido_Paterno)
       .input("apellido_Materno", sql.VarChar, apellido_Materno)
       .input("edad", sql.VarChar, edad)
       .input("Municipio", sql.VarChar, Municipio) 
       .input("colonia", sql.VarChar, colonia)
       .input("calle", sql.VarChar, calle)
       .input("telefono", sql.VarChar, telefono)
       .input("nombre_Contacto", sql.VarChar, nombre_Contacto)
       .input("apellidoP_Contacto", sql.VarChar, apellidoP_Contacto)
       .input("apellidoM_Contacto", sql.VarChar, apellidoM_Contacto)
       .input("telefono_Contacto", sql.VarChar, telefono_Contacto)
       .input("alergico_Medicamento", sql.VarChar, alergico_Medicamento)
       .input("ID_Asociado", sql.VarChar, ID_Asociado)
       // Usa la contraseña cifrada
       .query(querys.createNewHistorialM);
 
     // Enviar respuesta de éxito
     res.json({nombre,apellido_Paterno,apellido_Materno,edad,Municipio,colonia,calle,telefono,nombre_Contacto,apellidoP_Contacto,apellidoM_Contacto,telefono_Contacto,alergico_Medicamento,ID_Asociado });
   } catch (error) {
     // Enviar respuesta de error
     res.status(500).json({ error: error.message });
   }
 };

 exports.createNewAntecedentes = async (req, res) => {
  const { nombreAntecedente,fecha_Diagnostico,tratamiento} = req.body;

  // Verificar si todos los campos están presentes
  if (nombreAntecedente == null || fecha_Diagnostico == null || tratamiento == null) {
    return res.status(400).json({ msg: "Por favor llene todos los campos" });
  }

  try {
    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    await pool.request()
      .input("nombreAntecedente", sql.VarChar, nombreAntecedente)
      .input("fecha_Diagnostico", sql.Date, fecha_Diagnostico)
      .input("tratamiento", sql.VarChar, tratamiento)
      // Usa la contraseña cifrada
      .query(querys.createNewAntecedentes);

    // Enviar respuesta de éxito
    res.json({nombreAntecedente,fecha_Diagnostico,tratamiento});
  } catch (error) {
    // Enviar respuesta de error
    res.status(500).json({ error: error.message });
  }
};

exports.updateHistorialMedicoById = async (req, res) => {

  const {edad,Municipio,colonia,calle,telefono,nombre_Contacto,apellidoP_Contacto,apellidoM_Contacto,
    telefono_Contacto,alergico_Medicamento} = req.body;

  const {ID_Historial}=req.params
  
    // Verificar si todos los campos están presentes
  if (edad == null || Municipio == null || colonia == null || calle== null || telefono==null || nombre_Contacto==null 
    || apellidoP_Contacto==null || apellidoM_Contacto==null || telefono_Contacto==null || alergico_Medicamento==null) {
    return res.status(400).json({ msg: "Por favor llene todos los campos" });
  }

    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    await pool.request()
      .input("edad", sql.VarChar, edad)
      .input("Municipio", sql.VarChar, Municipio) 
      .input("colonia", sql.VarChar, colonia)
      .input("calle", sql.VarChar, calle)
      .input("telefono", sql.VarChar, telefono)
      .input("nombre_Contacto", sql.VarChar, nombre_Contacto)
      .input("apellidoP_Contacto", sql.VarChar, apellidoP_Contacto)
      .input("apellidoM_Contacto", sql.VarChar, apellidoM_Contacto)
      .input("telefono_Contacto", sql.VarChar, telefono_Contacto)
      .input("alergico_Medicamento", sql.VarChar, alergico_Medicamento)
      .input("ID_Historial", sql.Int, ID_Historial)
      // Usa la contraseña cifrada
      .query(querys.updateHistorialMedicoById);

    // Enviar respuesta de éxito
    res.json({edad,Municipio,colonia,calle,telefono,nombre_Contacto,apellidoP_Contacto,apellidoM_Contacto,
      telefono_Contacto,alergico_Medicamento});
  
};

exports.updateAntecedentesById = async (req, res) => {

  const {nombreAntecedente,fecha_Diagnostico,tratamiento} = req.body;

  const {ID_Historial}=req.params
  
    // Verificar si todos los campos están presentes
  if (nombreAntecedente == null || fecha_Diagnostico == null || tratamiento == null) {
    return res.status(400).json({ msg: "Por favor llene todos los campos" });
  }

    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    await pool.request()
      .input("nombreAntecedente", sql.VarChar, nombreAntecedente)
      .input("fecha_Diagnostico", sql.Date, fecha_Diagnostico)
      .input("tratamiento", sql.VarChar, tratamiento)
      .input("ID_Historial", sql.Int, ID_Historial)
      // Usa la contraseña cifrada
      .query(querys.updateAntecedentesById);

    // Enviar respuesta de éxito
    res.json({nombreAntecedente,fecha_Diagnostico,tratamiento});
  
};