module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', process.env.a),
        port: env.int('DATABASE_PORT', process.env.b),
        database: env('DATABASE_NAME', process.env.c),
        username: env('DATABASE_USERNAME', process.env.d),
        password: env('DATABASE_PASSWORD', process.env.f),
      },
      options: {},
    },
  },
});