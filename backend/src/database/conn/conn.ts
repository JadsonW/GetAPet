import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD;

const conn = new Sequelize(
    'get_a_pet', // nome do bd
    'root', // usuario do bd
    '', // senha do bd
    {
        host: 'localhost', // localizacao do bd
        dialect: 'mysql' // tipo do bd
    }
)
console.log(dbName, '//////////////')

async () => {
  try {
    await conn.authenticate();
    console.log("Conectado com o banco de dados");
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
  }
};

export default conn;
