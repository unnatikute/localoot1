import './ensureEnv.js';
import { Sequelize } from 'sequelize';

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'localoot',
  DB_USER = 'root',
  DB_PASS = '',
  NODE_ENV = 'development'
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true
  }
});


