const { getConnection, sql, querys } = require("../database/connection");
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


exports.getPersonal = async (req, res)=> {
   try {
    const pool = await getConnection()
    const result= await pool.request().query(querys.getPersonal)
    res.json(result.recordset)
   } catch (error) {
    res.status(500);
    res.send(error.message);
   }
};

exports.getTipoCargo = async (req, res)=> {
    try {
     const pool = await getConnection()
     const result= await pool.request().query(querys.getTipoCargo)
     res.json(result.recordset)
    } catch (error) {
     res.status(500);
     res.send(error.message);
    }
 };

 exports.createNewPersonal = async (req, res) => {
   const { ID_Asociado,nombre,apellidoP,apellidoM,correo,contrasena,estado,delegacion,Id_Cargo} = req.body;
 
   // Verificar si todos los campos están presentes
   if (ID_Asociado==null || nombre == null || apellidoP == null || apellidoM == null || correo == null || contrasena == null || estado == null || delegacion== null || Id_Cargo==null) {
     return res.status(400).json({ msg: "Por favor llene todos los campos" });
   }
 
   try {
     //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
     const pool = await getConnection();
     await pool.request()
       .input("ID_Asociado", sql.VarChar, ID_Asociado)
       .input("nombre", sql.VarChar, nombre)
       .input("apellidoP", sql.VarChar, apellidoP)
       .input("apellidoM", sql.VarChar, apellidoM)
       .input("correo", sql.VarChar, correo)
       .input("contrasena", sql.VarChar, contrasena)
       .input("estado", sql.VarChar, estado)
       .input("delegacion", sql.VarChar, delegacion)
       .input("Id_Cargo", sql.VarChar, Id_Cargo)
       // Usa la contraseña cifrada
       .query(querys.createNewPersonal);
 
     // Enviar respuesta de éxito
     res.json({ID_Asociado,nombre,apellidoP,apellidoM,correo,contrasena,estado,delegacion,Id_Cargo});
   } catch (error) {
     // Enviar respuesta de error
     res.status(500).json({ error: error.message });
   }
 };


 exports.updatePersonalById = async (req, res) => {

  const {Id_Cargo} = req.body;
  const {ID_Asociado}=req.params
    // Verificar si todos los campos están presentes
  if (Id_Cargo == null ) {
    return res.status(400).json({ msg: "Por favor llene todos los campos" });
  }
    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    await pool.request()
      .input("Id_Cargo", sql.VarChar, Id_Cargo)
      .input("ID_Asociado", sql.Int, ID_Asociado)
      // Usa la contraseña cifrada
      .query(querys.updatePersonalById);
    // Enviar respuesta de éxito
    res.json({Id_Cargo}); 
};

exports.updateEstadoPersonalById = async (req, res) => {

  const {estado_Usuario} = req.body;
  const {ID_Asociado}=req.params
    // Verificar si todos los campos están presentes
  if (estado_Usuario == null ) {
    return res.status(400).json({ msg: "Por favor llene todos los campos" });
  }
    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    await pool.request()
      .input("estado_Usuario", sql.VarChar, estado_Usuario)
      .input("ID_Asociado", sql.Int, ID_Asociado)
      // Usa la contraseña cifrada
      .query(querys.updateEstadoPersonalById);

    // Enviar respuesta de éxito
    res.json({estado_Usuario});
  
};


/* exports.deletePersonalById = async (req, res) => {

  const {ID_Asociado}=req.params

    //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    await pool.request()
      .input("ID_Asociado", sql.Int, ID_Asociado)
      // Usa la contraseña cifrada
      .query(querys.deletePersonalById);

    // Enviar respuesta de éxito
    res.json({mensaje: "El Personal fue Eliminado Correctamente" });
  
};*/