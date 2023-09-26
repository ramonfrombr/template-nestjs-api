import { DataSource, DataSourceOptions } from 'typeorm';

export const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT, 10),
  schema: process.env.DATABASE_SCHEMA,
  migrations: [`${__dirname}/migrations/*{.js,.ts}`],
  migrationsRun: false,
  synchronize: false,
  logging: true,
};

export default new DataSource(options);
