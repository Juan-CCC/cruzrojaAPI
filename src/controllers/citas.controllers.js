const { getConnection, sql, querys } = require("../database/connection");
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


exports.getCitas = async (req, res)=> {
   try {
    const pool = await getConnection()
    const result= await pool.request().query(querys.getCitas)
    res.json(result.recordset)
   } catch (error) {
    res.status(500);
    res.send(error.message);
   }
};

exports.updateCitasById = async (req, res) => {

   const {estado} = req.body;
 
   const {ID_Cita}=req.params
   
     // Verificar si todos los campos están presentes
   if (estado == null ) {
     return res.status(400).json({ msg: "Por favor llene todos los campos" });
   }
 
     //const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
     const pool = await getConnection();
     await pool.request()
       .input("estado", sql.VarChar, estado)
       .input("ID_Cita", sql.Int, ID_Cita)
       // Usa la contraseña cifrada
       .query(querys.updateCitasById);
 
     // Enviar respuesta de éxito
     res.json({estado});
   
 };