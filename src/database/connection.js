const sql = require('mssql');

// Importar dbSettings desde donde sea que esté definido
const dbSettings = {
  user: 'CruzRoja',
  password: 'CruzRoja1',
  server: 'localhost',
  database: 'cruz_roja',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};


{/*const dbSettings = {
  user: 'angelJosue_SQLLogin_1',
  password: 'vvxfsv8yp9',
  server: 'cruz_roja.mssql.somee.com',
  database: 'cruz_roja', 
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}; */}
const connection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error(error);
  }
};

const querys = require("./querys").querys;

module.exports = {
  sql,
  getConnection: connection,
  querys: querys
};
