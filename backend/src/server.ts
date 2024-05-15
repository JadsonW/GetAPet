import express from "express";
import { Request, Response } from "express";

//connection
import conn from "./database/conn/conn";

//Models
import User from "./database/Models/User";
import Pet from "./database/Models/Pet";
import PetImage from "./database/Models/PetImage";
import Visit from "./database/Models/Visit";
import RequestVisit from "./database/Models/RequestVisit";

//Routes
import UsersRouter from "./Routes/UsersRoutes";
import PetsRoutes from "./Routes/PetsRoutes";
import RequestVisitRoutes from "./Routes/RequestVisitRoutes";
import VisitRoutes from './Routes/VisitRoutes'

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("eai emundo!");
});

app.use("/user", UsersRouter);
app.use("/pets", PetsRoutes);
app.use("/request", RequestVisitRoutes);
app.use("/schedule", VisitRoutes)

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
