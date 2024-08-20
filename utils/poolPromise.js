const sql = require('mssql');
const dbConfig = require('../config/dbConn');

const poolPromise = new sql.connect(dbConfig)
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
    throw err;
  });

module.exports = {
  sql, 
  poolPromise
};
