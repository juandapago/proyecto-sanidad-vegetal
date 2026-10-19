import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

process.loadEnvFile('.env');

const sql = await readFile(new URL('../database/seed.sql', import.meta.url), 'utf8');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

try {
  await connection.query(sql);
  console.log('Datos de ejemplo cargados en la base', process.env.DB_NAME);
} finally {
  await connection.end();
}
