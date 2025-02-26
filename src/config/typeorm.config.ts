import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DB_TYPES } from 'src/Common/Constants/database.const';

config();

const AppDataSource = new DataSource({
  type: DB_TYPES[process.env.DB_TYPE] || 'mariadb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
