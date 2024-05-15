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
//Validations
const Yup = __importStar(require("yup"));
//Models
const Visit_1 = __importDefault(require("../database/Models/Visit"));
const Pet_1 = __importDefault(require("../database/Models/Pet"));
const User_1 = __importDefault(require("../database/Models/User"));
const RequestVisit_1 = __importDefault(require("../database/Models/RequestVisit"));
//Helpers
const getUserByToken_1 = __importDefault(require("../helpers/getUserByToken"));
const getToken_1 = __importDefault(require("../helpers/getToken"));
class VisitController {
    createVisit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, local, time, description } = req.body;
                const reqid = req.params.reqid;
                const validations = Yup.object().shape({
                    description: Yup.string(),
                    time: Yup.string().required("Informe o horário da visita!"),
                    data: Yup.date().required("Informe a data da visita!").nullable(),
                    local: Yup.string().required("Informe o local da visita!"),
                });
                yield validations.validate(req.body, { abortEarly: true });
                //Buscando a solicitação de visita
                const reqVisit = yield RequestVisit_1.default.findByPk(reqid);
                //verificando se existe solicitação
                if (!reqVisit) {
                    return res.status(422).json({ message: "Solicitação não encontrada!" });
                }
                const pet = yield Pet_1.default.findByPk(reqVisit.petId);
                if (!pet) {
                    return res
                        .status(422)
                        .json({ message: "Pet não encontrado, tente novament!" });
                }
                const token = yield (0, getToken_1.default)(req, res);
                const user = yield (0, getUserByToken_1.default)(token, res);
                if (!user) {
                    return res
                        .status(422)
                        .json({ message: "Faça login para completar a ação!" });
                }
                if (pet.userId !== user.id) {
                    return res
                        .status(422)
                        .json({ message: "Apenas o dono do pet pode agendar uma visita!" });
                }
                const adopter = yield User_1.default.findByPk(reqVisit.adopterId);
                if (!adopter) {
                    return res
                        .status(422)
                        .json({ message: "Adotante não encontrado, tente novament!" });
                }
                if (!adopter) {
                    return res.status(422).json({ message: "Acesso negado!" });
                }
                const visitData = {
                    data: data,
                    local: local,
                    time: time,
                    description: description,
                    petId: pet.id,
                    adopterId: adopter.id,
                    ownerId: pet.userId,
                    confirmed: true,
                };
                const visitCreate = yield Visit_1.default.create(visitData);
                yield reqVisit.destroy();
                return res.status(200).json({ message: "Visita marcada", visitCreate });
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    return res.status(422).json({ Error: error.message });
                }
                else {
                    // Erro interno do servidor
                    console.log(error);
                    return res.status(500).json({ error: "Erro interno do servidor" });
                }
            }
        });
    }
    disconfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //id da visita
                const id = req.params.id;
                const visit = yield Visit_1.default.findByPk(id);
                if (!visit) {
                    return res.status(422).json({ message: "Visita não encontrada!" });
                }
                const adopter = yield User_1.default.findByPk(visit.adopterId);
                const owner = yield User_1.default.findByPk(visit.ownerId);
                if (visit.confirmed === false) {
                    return res.json({ message: "Essa visita ja foi cancelada!" });
                }
                const visitUpdate = {
                    confirmed: false,
                };
                yield Visit_1.default.update(visitUpdate, { where: { id: id } });
                const token = yield (0, getToken_1.default)(req, res);
                const user = yield (0, getUserByToken_1.default)(token, res);
                if ((adopter === null || adopter === void 0 ? void 0 : adopter.id) === user.id) {
                    return res.status(200).json({
                        message: `A visita foi cancelada, informamos ${owner === null || owner === void 0 ? void 0 : owner.name} sobre o cancelamento.`,
                        adopter,
                    });
                }
                return res.status(200).json({
                    message: `A visita foi cancelada, informamos ${adopter === null || adopter === void 0 ? void 0 : adopter.name} sobre o cancelamento.`,
                    owner,
                });
            }
            catch (error) {
                console.log("Erro no cancelamento da visita", error);
            }
        });
    }
    getVisitByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield (0, getToken_1.default)(req, res);
                const user = yield (0, getUserByToken_1.default)(token, res);
                if (!user) {
                    return res.status(422).json({ message: "Faça login!" });
                }
                const visitsOwner = yield Visit_1.default.findAll({ where: { ownerId: user.id } });
                const visitsAdopter = yield Visit_1.default.findAll({
                    where: { adopterId: user.id },
                });
                console.log("rrrr", visitsAdopter);
                console.log("eee", visitsOwner);
                const visits = [];
                if (visitsOwner) {
                    visits.push(visitsOwner);
                }
                if (visitsAdopter) {
                    visits.push(visitsAdopter);
                }
                if (!visitsAdopter && !visitsOwner) {
                    return res.json({
                        message: "Voce não possui visitas agendadas!",
                    });
                }
                return res.status(200).json({ visits });
            }
            catch (error) {
                console.log("Erro na busca as visitas! ", error);
            }
        });
    }
}
exports.default = new VisitController();
