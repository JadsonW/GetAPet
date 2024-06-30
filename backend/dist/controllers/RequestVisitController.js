"use strict";
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
//models
const RequestVisit_1 = __importDefault(require("../database/Models/RequestVisit"));
const Pet_1 = __importDefault(require("../database/Models/Pet"));
//helpers
const getToken_1 = __importDefault(require("../helpers/getToken"));
const getUserByToken_1 = __importDefault(require("../helpers/getUserByToken"));
class RequestVisitController {
    createReqtVisit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const petId = req.params.petid;
                const token = yield (0, getToken_1.default)(req, res);
                const adopter = yield (0, getUserByToken_1.default)(token, res);
                if (!adopter) {
                    return res
                        .status(422)
                        .json({ message: "Faça login para completar a ação" });
                }
                const pet = yield Pet_1.default.findOne({ where: { id: petId } });
                if (!pet) {
                    return res.status(422).json({ message: "Pet não encontrado!" });
                }
                if (adopter.id === pet.userId) {
                    return res.status(401).json({
                        message: "Você não pode criar uma solicitação de visita para seu proprio pet!",
                    });
                }
                const requestVisitData = {
                    petId: pet.id,
                    adopterId: adopter.id,
                };
                yield RequestVisit_1.default.create(requestVisitData);
                return res
                    .status(200)
                    .json({ message: "Solicitação enviada ao dono do pet!" });
            }
            catch (error) {
                console.log("erro no envio da solicitação", error);
            }
        });
    }
    deleteReqtVisit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const reqVisit = yield RequestVisit_1.default.findOne({ where: { id: id } });
            if (!reqVisit) {
                return res.status(422).json({ message: "Solicitação não encontrada!" });
            }
            yield reqVisit.destroy();
            return res.status(200).json({ message: "Solicitação deletada!" });
        });
    }
    getAllReqVisitById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield (0, getToken_1.default)(req, res);
            const user = yield (0, getUserByToken_1.default)(token, res);
            const id = req.params.id;
            if (!user) {
                return;
            }
            //buscando todas as requisições de visitas
            const reqs = yield RequestVisit_1.default.findAll({ where: { petId: id } });
            if (!reqs) {
                return res.json({ message: "Nenhuma solicitação de adoção encontrada" });
            }
            return res.status(200).json({ reqs });
        });
    }
}
exports.default = new RequestVisitController();
