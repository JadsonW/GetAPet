"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//connection
const conn_1 = __importDefault(require("./database/conn/conn"));
//Routes
const UsersRoutes_1 = __importDefault(require("./Routes/UsersRoutes"));
const PetsRoutes_1 = __importDefault(require("./Routes/PetsRoutes"));
const RequestVisitRoutes_1 = __importDefault(require("./Routes/RequestVisitRoutes"));
const VisitRoutes_1 = __importDefault(require("./Routes/VisitRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    return res.send("eai emundo!");
});
app.use("/user", UsersRoutes_1.default);
app.use("/pets", PetsRoutes_1.default);
app.use("/request", RequestVisitRoutes_1.default);
app.use("/schedule", VisitRoutes_1.default);
const initialize = () => {
    try {
        app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
        conn_1.default.sync({ force: false }).then(() => {
            console.log("Tabelas sincronizada");
        });
    }
    catch (error) {
        console.log("Erro na inicialização", error);
    }
};
initialize();
