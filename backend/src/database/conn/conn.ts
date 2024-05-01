import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET!;

const dbName = process.env.DB_MODEL as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST


const conn = new Sequelize(
  dbName, // nome do bd
  dbUser, // usuario do bd
  dbPassword, // senha do bd
  {
    host: dbHost, // localizacao do bd
    dialect: "mysql", // tipo do bd
  }
);

async () => {
  try {
    await conn.authenticate();
    console.log("Conectado com o banco de dados");
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
  }
};

export default conn;
