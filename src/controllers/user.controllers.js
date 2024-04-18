const { getConnection, sql, querys } = require("../database/connection");
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


exports.getUser = async (req, res)=> {
   try {
    const pool = await getConnection()
    const result= await pool.request().query(querys.getUser)
    res.json(result.recordset)
   } catch (error) {
    res.status(500);
    res.send(error.message);
   }
};


exports.createNewUser = async (req, res) => {
  const { nombre, apellido_Paterno, apellido_Materno, correo, contraseña, telefono } = req.body;

  // Verificar si todos los campos están presentes
  if (nombre == null || apellido_Paterno == null || apellido_Materno == null || correo == null || telefono == null || contraseña == null ) {
    return res.status(400).json({ msg: "Por favor llene todos los campos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifra la contraseña con bcrypt
    const pool = await getConnection();
    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido_Paterno", sql.VarChar, apellido_Paterno)
      .input("apellido_Materno", sql.VarChar, apellido_Materno)
      .input("correo", sql.VarChar, correo)
      .input("contraseña", sql.VarChar, hashedPassword) 
      .input("telefono", sql.VarChar, telefono)
      // Usa la contraseña cifrada
      .query(querys.createNewUser);

    // Enviar respuesta de éxito
    res.json({ nombre, apellido_Paterno, apellido_Materno, correo, contraseña, telefono });
  } catch (error) {
    // Enviar respuesta de error
    res.status(500).json({ error: error.message });
  }
};



exports.authenticateUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool.request()
        .input("correo", correo)
        .query(querys.getUserLogin);

    if (result.recordset.length === 0) {
        // Si no se encuentra ningún usuario con el correo proporcionado
        return res.status(401).json({ mensaje: "Este correo no coincide con ningún correo registrado" });
    }

    const user = result.recordset[0];

    // Verificar si la cuenta está bloqueada
    if (user.estado_Cuenta=== 'Bloqueada') {
        return res.status(401).json({ mensaje: "Tu cuenta está bloqueada" });
    }

    const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (passwordMatch) {
        // Si las contraseñas coinciden

        await pool.request()
        .input("correo", correo)
        .query(querys.actualizarFechaInicioSesion); 


        return res.json({ mensaje: "Autenticación exitosa"});
    } else {
        // Si las contraseñas no coinciden
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(500).json({ mensaje: "Error de autenticación" });
  }
};








exports.getUserById = async (req, res)=>{
    try {
        const pool = await getConnection();
    
        const result = await pool.request()
          .input("correo", req.params.id)
          .query(querys.getUserById);
        return res.json(result.recordset[0]);
      } catch (error) {
        res.status(500);
        res.send(error.message);
      }
    };

    exports.getComprobarCorreo = async (req, res) => {
      try {
        const pool = await getConnection();
    
        const result = await pool.request()
          .input("correo", req.params.correo)
          .query(querys.getUserById);
    
        if (result.recordset.length > 0) {
          // Si la consulta devuelve algún resultado, significa que el correo ya está registrado
          return res.json({ mensaje: "Este correo ya está registrado" });
        } else {
          // Si no hay resultados, el correo no está registrado
          return res.json({ mensaje: "Este correo no está registrado" });
        }
      } catch (error) {
        res.status(500);
        res.send(error.message);
      }
    };



    exports.getComprobarPass = async (req, res) => {
      try {
        const pool = await getConnection();
    
        const result = await pool.request()
          .input("contraseña", req.params.contraseña)
          .query(querys.comprobarPass);
    
        if (result.recordset.length > 0) {
          // Si la consulta devuelve algún resultado, significa que el correo ya está registrado
          return res.json({ mensaje: "rechazado" });
        } else {
          // Si no hay resultados, el correo no está registrado
          return res.json({ mensaje: "aprovado" });
        }
      } catch (error) {
        res.status(500);
        res.send(error.message);
      }
    };


    exports.deleteUserById = async (req, res)=>{
      try {
          const pool = await getConnection();
      
          const result = await pool.request()
            .input("correo", req.params.id)
            .query(querys.deleteUser);
            if (result.rowsAffected[0] === 0) return   res.json({ mensaje: "No existe este Usuario" });

            res.json({ mensaje: " Usuario Eliminado Correctamente" })
        } catch (error) {
          res.status(500);
          res.send(error.message);
        }
      };
    

      exports.getTotalUser = async (req, res)=>{
        try {
            const pool = await getConnection();
        
            const result = await pool.request()
              .query(querys.getTotalUser);
              res.json(result.recordset[0][""]);
          } catch (error) {
            res.status(500);
            res.send(error.message);
          }
        };


        exports.updateUserById = async (req, res) => {
          const { nombre, apellido_Paterno, apellido_Materno, correo, telefono, contraseña, fecha_Nacimiento} = req.body;
        
          // validating
          if (nombre == null || apellido_Paterno == null || apellido_Materno == null|| correo == null|| telefono == null|| contraseña == null|| fecha_Nacimiento == null) {
            return res.status(400).json({ msg: "Por favor llene todo los campos" });
          }
        
          try {
            const pool = await getConnection();
            await pool
              .request()
              .input("nombre", sql.VarChar, nombre)
              .input("apellido_Paterno", sql.VarChar, apellido_Paterno)
              .input("apellido_Materno", sql.VarChar,apellido_Materno )
              .input("correo", sql.VarChar, correo )
              .input("telefono", sql.VarChar, telefono)
              .input("contraseña", sql.VarChar, contraseña)
              .query(querys.updateUserById);
            res.json({ nombre, apellido_Paterno, apellido_Materno, correo, telefono, contraseña });
          } catch (error) {
            res.status(500);
            res.send(error.message);
          }
        };
        

        exports.updateCuentaEStado = async (req, res) => {
          const { correo} = req.body;
        
          // validating
          if (correo == null) {
            return res.status(400).json({ msg: "Por favor llene todo los campos" });
          }
        
          try {
            const pool = await getConnection();
            await pool
              .request()
              .input("correo", sql.VarChar, correo )
              .query(querys.updateUserByIdEstadoCuenta);
            res.json({correo});
          } catch (error) {
            res.status(500);
            res.send(error.message);
          }
        };










// Función para activar cuentas bloqueadas después de 2 días
exports.activateBlockedAccounts = async () => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query(querys.getAccountsToActivateMinute); // Query para obtener cuentas bloqueadas hace más de 2 días
        const accountsToActivate = result.recordset;

        // Itera sobre las cuentas a activar
        for (const account of accountsToActivate) {
            // Actualiza el estado de la cuenta a "activa"
            await pool.request()
            .input("correo", sql.VarChar, account.correo) // Utiliza "correo" en lugar de "accountId"
            .query(querys.updateAccountStatusToActive); // Query para actualizar estado de cuenta a "activa"
        }

        console.log(`${accountsToActivate.length} cuentas se activaron correctamente.`);
    } catch (error) {
        console.error("Error al activar cuentas bloqueadas:", error);
    }
};



exports.expirarTokensGenerados = async () => {
  try {
      const pool = await getConnection();
      const result = await pool.request()
          .query(querys.expirarToken); 
      const tokens = result.recordset;

      // Itera sobre las cuentas a activar
      for (const account of tokens) {
          // Actualiza el estado de la cuenta a "activa"
          await pool.request()
          .input("correo", sql.VarChar, account.correo) // Utiliza "correo" en lugar de "accountId"
          .query(querys.actualizarEstadoTokenRecuperacion); // Query para actualizar estado de cuenta a "activa"
      }

      console.log(`${tokens.length} cuentas se expiraron el token.`);
  } catch (error) {
      console.error("Error al expirar tokens:", error);
  }
};
// Programa la tarea para ejecutarse periódicamente
// Aquí debes usar la herramienta de programación de tareas de tu servidor o un servicio de terceros

// Ejemplo de cómo programar la tarea en un cron job en Node.js usando la librería node-cron

// Programa la tarea para ejecutarse todos los días a la medianoche
//cron.schedule('0 0 * * *', async () => {
  //  console.log('Ejecutando tarea para activar cuentas bloqueadas...');
    //await activateBlockedAccounts();
//});


// Programa la tarea para ejecutarse dentro de 5 minutos





// Tarea para activar cuentas bloqueadas
//cron.schedule('*/2 * * * *', async () => {
  cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando tarea para activar cuentas bloqueadas...');
  await activateBlockedAccounts();
});

// Tarea para expirar tokens generados
cron.schedule('*/2 * * * *', async () => {
  console.log('Ejecutando tarea para expirar tokens generados...');
  await expirarTokensGenerados();
});




/////MANDAR EL CORREO

const generarNuevoToken = () => {
  const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return token.toString();
};

// Función para enviar correo de recuperación y registrar el token en la base de datos
exports.EnviarCorreoRecuperacion = async (req, res) => {
  const { correo } = req.body;
  const origen = "cruzrojasuport@gmail.com";
  const receptor = correo;
  const contraseña = "onopzodxqxheqwnz";
  const token = generarNuevoToken();

  try {
    // Obtener conexión a la base de datos
    const pool = await getConnection();

    // Registrar el token en la base de datos junto con la fecha y la hora actual
    await pool.request()
      .input("correo", sql.VarChar, correo)
      .input("token", sql.VarChar, token)
      .query(querys.registrarTokenRecuperacion); // Suponiendo que tienes una consulta SQL para registrar el token

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: origen,
        pass: contraseña
      }
    });

    // Configurar opciones del correo
    const mailOptions = {
      from: origen,
      to: receptor,
      subject: 'Recuperación de contraseña',
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              margin: 0;
              padding: 0;
            }
            .banner {
              background-color: #ff0000;
              color: #fff;
              padding: 10px;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
            }
            .cruz-roja {
              float: left;
              margin-right: 20px;
              width: 150px;
              height: auto;
            }
            .token {
              font-size: 20px;
              font-weight: bold;
              color: #ff0000;
            }
          </style>
        </head>
        <body>
          <div class="banner">
            <h2>Recuperación de contraseña - Cruz Roja</h2>
          </div>
          <div class="container">
            <p>Estimado usuario,</p>
            <p>Recibió este correo electrónico porque solicitó un restablecimiento de contraseña para su cuenta.</p>
            <p>Por favor, copie y pegue el siguiente token en su navegador para completar el proceso:</p>
            <p class="token">${token}</p>
            <p>Si no solicitó un restablecimiento de contraseña, puede ignorar este correo electrónico y su cuenta permanecerá segura.</p>
          </div>
          <div class="footer">
            <p>Atentamente,</p>
            <p>El equipo de soporte de Cruz Roja</p>
          </div>
        </body>
      </html>`
    };

    // Enviar correo electrónico
    await transporter.sendMail(mailOptions);
    res.json({ mensaje: 'Correo de recuperación enviado correctamente' });
  } catch (error) {
    // Manejo de errores
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({ mensaje: 'Error al enviar el correo electrónico', error: error.message });
  }
};




// Función para comparar el token proporcionado por el usuario con el almacenado en la base de datos
exports.compararTokenRecuperacion = async (req, res) => {
  const { correo, tokenUsuario } = req.body;
  try {
    // Verificar si el token proporcionado por el usuario está presente
    if (tokenUsuario === undefined) {
      return res.status(400).json({ mensaje: "El token proporcionado es inválido" });
    }

    // Obtener conexión a la base de datos
    const pool = await getConnection();

    // Obtener el token almacenado en la base de datos
    const result = await pool.request()
      .input("correo", sql.VarChar, correo)
      .query(querys.obtenerTokenRecuperacion);

    // Obtener el valor del token almacenado
    const tokenAlmacenado = result.recordset.length > 0 ? result.recordset[0].token : null;

    console.log("Token almacenado:", tokenAlmacenado);
    console.log("Token proporcionado:", tokenUsuario);

    // Verificar si el token almacenado está expirado
    if (tokenAlmacenado === 'expirado') {
      return res.json({ mensaje: "El token de recuperación ha expirado" });
    }

    // Comparar el token proporcionado por el usuario con el almacenado en la base de datos
    if (tokenUsuario === tokenAlmacenado) {
      res.json({ mensaje: "El token de recuperación es válido" });
    } else {
      res.json({ mensaje: "El token de recuperación es inválido" });
    }
  } catch (error) {
    console.error('Error al comparar el token de recuperación:', error);
    res.status(500).json({ mensaje: 'Error al comparar el token de recuperación' });
  }
};




// Función para actualizar automáticamente el estado del token después de 30 minutos
exports.actualizarEstadoToken = async (req, res) => {
  const { correo } = req.body;
  try {
    // Obtener conexión a la base de datos
    const pool = await getConnection();

    // Actualizar el estado del token asociado al correo proporcionado a "expirado" después de 30 minutos
    await pool.request()
      .input("correo", sql.VarChar, correo)
      .query(querys.actualizarEstadoTokenRecuperacion); // Suponiendo que tienes una consulta SQL para actualizar el estado del token

    res.json({ mensaje: `Estado del token asociado a ${correo} actualizado correctamente.` });
  } catch (error) {
    console.error('Error al actualizar el estado del token de recuperación:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado del token de recuperación' });
  }
};



exports.enviarCorreoBloqueoCuenta = async (req, res) => {
  const { correo } = req.body;
  const origen = "cruzrojasuport@gmail.com";
  const receptor = correo;
  const contraseña = "onopzodxqxheqwnz";

  try {
    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: origen,
        pass: contraseña
      }
    });

    // Configurar opciones del correo
    const mailOptions = {
      from: origen,
      to: receptor,
      subject: 'Cuenta bloqueada por seguridad',
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              margin: 0;
              padding: 0;
            }
            .banner {
              background-color: #ff0000;
              color: #fff;
              padding: 10px;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="banner">
            <h2>Cuenta bloqueada por seguridad - Cruz Roja</h2>
          </div>
          <div class="container">
            <p>Estimado usuario,</p>
            <p>Recientemente hemos detectado intentos de acceso no autorizados a su cuenta. Por razones de seguridad, hemos bloqueado temporalmente su cuenta.</p>
            <p>Su cuenta será desbloqueada automáticamente después de un día. Si este bloqueo no fue realizado por usted, le recomendamos que cambie su contraseña inmediatamente y revise la seguridad de su cuenta.</p>
            <p>Disculpe las molestias ocasionadas. Gracias por su comprensión y cooperación.</p>
          </div>
          <div class="footer">
            <p>Atentamente,</p>
            <p>El equipo de soporte de Cruz Roja</p>
          </div>
        </body>
      </html>`
    };

    // Enviar correo electrónico
    await transporter.sendMail(mailOptions);
    res.json({ mensaje: 'Correo de bloqueo de cuenta enviado correctamente' });
  } catch (error) {
    // Manejo de errores
    console.error('Error al enviar el correo de bloqueo de cuenta:', error);
    res.status(500).json({ mensaje: 'Error al enviar el correo de bloqueo de cuenta', error: error.message });
  }
};

