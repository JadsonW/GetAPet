"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const Yup = __importStar(require("yup"));
const bcrypt = __importStar(require("bcrypt"));
//Model
const User_1 = __importDefault(require("../database/Models/User"));
//helpers
const createToken_1 = __importDefault(require("../helpers/createToken"));
const getToken_1 = __importDefault(require("../helpers/getToken"));
const getUserByToken_1 = __importDefault(require("../helpers/getUserByToken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const secret = process.env.SECRET;
class UserController {
    createdUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Pegando os dados do requisição
                const { name, phone, email, password, confirmPassword } = req.body;
                //Validação do formulario
                const schema = Yup.object().shape({
                    confirmPassword: Yup.string().required("Confirme sua senha!"),
                    password: Yup.string().required("A senha é obrigatoria!"),
                    email: Yup.string()
                        .email("Coloque um email valido!")
                        .required("O email é obrigatorio!"),
                    phone: Yup.string().required("O numero de telefone é obrigatorio!"),
                    name: Yup.string().required("O nome é obrigatorio!"),
                });
                yield schema.validate(req.body, { abortEarly: true });
                //Verificando email
                const userExists = yield User_1.default.findOne({ where: { email: email } });
                if (userExists) {
                    return res.status(422).json({ message: "O email já está em uso!" });
                }
                if (confirmPassword !== password) {
                    return res.status(422).json({ message: "As senhas não coincidem!" });
                }
                //Criptografando a senha
                const salt = yield bcrypt.genSalt(12);
                const passwordHash = yield bcrypt.hash(password, salt);
                const userData = {
                    name: name,
                    phone: phone,
                    email: email,
                    password: passwordHash,
                };
                const user = yield User_1.default.create(userData);
                yield (0, createToken_1.default)(req, user, res);
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    const yupErrors = error.message;
                    return res.status(422).json({ message: error.message });
                }
                else {
                    // Erro interno do servidor
                    console.log(error);
                    return res.status(500).json({ message: "Erro interno do servidor" });
                }
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield User_1.default.findOne({ where: { id: id } });
            if (!user) {
                return res.status(422).json({ message: "Usuario não encontrado!" });
            }
            user.password;
            return res.status(200).json({ user });
        });
    }
    updatedUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, phone, email, password, confirmPassword } = req.body;
                let image;
                //Validação do formulario
                const schema = Yup.object().shape({
                    name: Yup.string(),
                    email: Yup.string().email("Coloque um email valido!"),
                    phone: Yup.string(),
                    password: Yup.string(),
                    confirmPassword: Yup.string(),
                });
                yield schema.validate(req.body, { abortEarly: true });
                if (req.file) {
                    image = req.file.filename;
                }
                const userData = {
                    name: name,
                    phone: phone,
                    email: email,
                    password,
                    image: image,
                };
                if (password && confirmPassword) {
                    if (password != confirmPassword) {
                        res.status(422).json({ error: "As senhas não conferem." });
                    }
                    else if (password === confirmPassword && password != null) {
                        //Criptografando a senha
                        const salt = yield bcrypt.genSalt(12);
                        const passwordHash = yield bcrypt.hash(password, salt);
                        userData.password = passwordHash;
                    }
                }
                //pegando o usuario
                const token = (0, getToken_1.default)(req, res);
                const user = yield (0, getUserByToken_1.default)(token, res);
                if (!user) {
                    return res.status(401).json({ message: "Acesso negado!" });
                }
                yield User_1.default.update(userData, { where: { id: user.id } });
                res.status(200).json({ message: "Usuario editado", userData });
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    const yupErrors = error.message;
                    return res.status(422).json({ message: error.message });
                }
                else {
                    // Erro interno do servidor
                    console.log(error);
                    return res.status(500).json({ message: "Erro interno do servidor" });
                }
            }
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield User_1.default.findOne({ where: { id: id } });
            if (!user) {
                return res.status(422).json({ message: "Usuario não encontrado" });
            }
            yield user.destroy();
            res.status(200).json({ message: "Usuario removido!" });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const schema = Yup.object().shape({
                    password: Yup.string().required("a Senha é obrigatoria!"),
                    email: Yup.string().email().required("O email é obrigatorio"),
                });
                yield schema.validate(req.body, { abortEarly: true });
                const user = yield User_1.default.findOne({ where: { email: email } });
                if (!user) {
                    return res.status(422).json({ message: "Usuario não cadastrado!" });
                }
                const checkPassword = yield bcrypt.compare(password, user.password);
                if (!checkPassword) {
                    return res.status(422).json({ message: "Senha incorreta" });
                }
                yield (0, createToken_1.default)(req, user, res);
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    const yupErrors = error.message;
                    return res.status(422).json({ message: error.message });
                }
                else {
                    // Erro interno do servidor
                    console.log(error);
                    return res.status(500).json({ message: "Erro interno do servidor" });
                }
            }
        });
    }
    checkUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentUser;
            if (req.headers.authorization) {
                const token = (0, getToken_1.default)(req, res);
                const decoded = (0, jsonwebtoken_1.verify)(token, secret);
                currentUser = yield User_1.default.findByPk(decoded.id);
            }
            else {
                currentUser = null;
            }
            return res.status(200).send(currentUser);
        });
    }
}
exports.default = new UserController();
