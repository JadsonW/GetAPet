"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./database/Models/User"));
const UsersRoutes_1 = __importDefault(require("./Routes/UsersRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    return res.send("eai emundo!");
});
const UserRouter = UsersRoutes_1.default;
app.use('/user', UserRouter);
const initialize = () => {
    try {
        app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
        User_1.default.sync({ force: true }).then(() => {
            console.log("Tabela User sincronizada");
        });
    }
    catch (error) {
        console.log("Erro na inicialização", error);
    }
};
initialize();
