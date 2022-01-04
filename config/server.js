module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1400),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "c523e6b6d9076acec995392cf491b36c"),
    },
  },
});
