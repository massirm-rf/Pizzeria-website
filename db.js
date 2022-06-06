const Pool = require('pg').Pool
const pool = new Pool({
    user: '',/*to complete*/
    host: 'localhost',
    database: 'pizzeria',
    password: '',/*to complete*/
    port: 5432
});

module.exports = pool;
