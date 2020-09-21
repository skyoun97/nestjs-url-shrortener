export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  rootUri: `${process.env.PROTOCOL}://${process.env.DOMAIN_NAME}:${process.env.PORT}`,
});
