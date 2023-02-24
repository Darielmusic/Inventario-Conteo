const poolmanager = require("./poolmanager");
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  server: process.env.DB_HOST,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 500000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const conWeb = poolmanager.get("web", sqlConfig);
// module.exports = { conWeb };

module.exports = { conWeb }
