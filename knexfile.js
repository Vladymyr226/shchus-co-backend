require('dotenv').config()

const { PG_CONNECTION_STRING } = process.env

const config = {
  client: 'postgresql',
  connection: {
    connectionString: PG_CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false, // Для упрощения можно отключить проверку сертификата
    },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    extension: 'js',
  },
}

console.log(...config)

module.exports = {
  ...config,
}
