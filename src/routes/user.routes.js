const { Router } = require('express');
const {
  getUser,
  createNewUser,
  getUserById,
  getComprobarCorreo,
  deleteUserById,
  getTotalUser,
  updateUserById,
  authenticateUser,
  updateCuentaEStado,
  EnviarCorreoRecuperacion,
  actualizarEstadoToken,
  compararTokenRecuperacion,
  enviarCorreoBloqueoCuenta,
  getComprobarPass,
} = require("../controllers/user.controllers");
const {getPersonal, 
      getTipoCargo,
      createNewPersonal,
      updateEstadoPersonalById,
      updatePersonalById} =require("../controllers/personal.controllers");
const {getEmergencias, getTipoEmergencia,createNewEmergencia} =require("../controllers/emergencias.controllers");
const {getHistorialMedico,
      getHistorialMedicoById,
      createNewHistorialM,
      createNewAntecedentes,
      updateHistorialMedicoById,
      getAntecedentesById,
      getExpedienteById,
      updateAntecedentesById} =require("../controllers/historialM.controllers");
const {getCitas,updateCitasById} =require("../controllers/citas.controllers");


const router = Router();


router.get("/user", getUser);

router.post("/user", createNewUser);

router.post("/user/authenticate", authenticateUser);

router.get("/user/count", getTotalUser);

router.get("/user/:id",getUserById);

router.post("/user/:correo",getComprobarCorreo);

router.post("/user/:contraseña",getComprobarPass);


router.delete("/user/:id",deleteUserById);

router.put("/user/:id",updateUserById );

router.put("/userCuenta/:id",updateCuentaEStado );


// Enviar correo de recuperación de contraseña
router.post("/recuperacionCorreo/:correo", EnviarCorreoRecuperacion);

// Actualizar el estado del token
router.put("/actualizarToken", actualizarEstadoToken);

// Comparar el token de recuperación
router.post("/compararToken/:correo", compararTokenRecuperacion);

router.post("/notiCorreoCuentaBloqueada/:correo", enviarCorreoBloqueoCuenta);

// Rutas de Personal
router.get("/personal",getPersonal);
router.get("/tipoCargo",getTipoCargo);
router.post("/registroPersonal",createNewPersonal);
router.put("/actualizarPersonal/:ID_Asociado",updatePersonalById)
router.put("/actualizarEstadoPersonal/:ID_Asociado",updateEstadoPersonalById);

//Rutas de Emergencias
router.get("/Emergencias",getEmergencias);
router.get("/tipoEmergencia",getTipoEmergencia);
router.post("/registrarEmergencia",createNewEmergencia);

// Rutas de Historial Medico
router.get("/historialMedico",getHistorialMedico);
router.get("/historialMedicoId/:ID_Historial",getHistorialMedicoById);
router.get("/antecedentesID/:ID_Historial",getAntecedentesById);
router.get("/expedienteID/:ID_Historial",getExpedienteById);
router.post("/nuevoHistorialMedico",createNewHistorialM);
router.post("/antecedentesPatologico",createNewAntecedentes);
router.put("/historialMedico/:ID_Historial",updateHistorialMedicoById);
router.put("/actualizarAntecedentes/:ID_Historial",updateAntecedentesById)

// Rutas de Citas
router.get("/citasRegistradas",getCitas);
router.put("/citas/:ID_Cita",updateCitasById);

module.exports =  router;
