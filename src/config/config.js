module.exports = {
  logger: require('tracer').colorConsole({
    format: [
      '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
      {
        error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})'
      }
    ],
    dateformat: 'HH:MM:ss.L',
    preprocess: function(data) {
      data.title = data.title.toUpperCase()
    },
    level: process.env.LOG_LEVEL || 'trace'
  }),

  dbconfig: {
    user: 'progr4',
    password: 'password123',
    server: 'aei-sql.avans.nl',
    database: 'Prog4-Eindopdracht1',
    port: 1443,
    driver: 'msnodesql',
    connectionTimeout: 1500,
    options: {
      encrypt: false
    }
  }
}