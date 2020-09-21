module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'phaphaya',
  database:
    process.env.NODE_ENV === 'test' ? 'nestjs_test_db' : 'nestjs_url_shortener',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
