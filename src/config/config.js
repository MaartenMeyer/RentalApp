module.exports = {
  logger: require('tracer').colorConsole({
    format: [
      '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
      {
        error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' // error format
      }
    ],
    dateformat: 'HH:MM:ss.L',
    preprocess: function(data) {
      data.title = data.title.toUpperCase()
    },
    level: process.env.LOG_LEVEL || 'trace'
  }),

  dbconfig: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    //port: 1443,
    //driver: 'msnodesql',
    //connectionTimeout: 1500,
    //options: {
    //  encrypt: false
    //}
  }
}