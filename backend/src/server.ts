import express from "express";
import { Request, Response } from "express";

import User from "./database/Models/User";
import Pet from "./database/Models/Pet";
import PetImage from "./database/Models/PetImage";

import router from "./Routes/UsersRoutes";
import conn from "./database/conn/conn";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("eai emundo!");
});

const UserRouter = router;

app.use("/user", UserRouter);

const initialize = () => {
  try {
    app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
    conn.sync({ force: false }).then(() => {
      console.log("Tabelas sincronizada");
    });
   
  } catch (error) {
    console.log("Erro na inicialização", error);
  }
};

initialize();
