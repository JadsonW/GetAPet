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
const Yup = __importStar(require("yup"));
//Models
const Pet_1 = __importDefault(require("../database/Models/Pet"));
const User_1 = __importDefault(require("../database/Models/User"));
const PetImage_1 = __importDefault(require("../database/Models/PetImage"));
//Helpers
const getUserByToken_1 = __importDefault(require("../helpers/getUserByToken"));
const getToken_1 = __importDefault(require("../helpers/getToken"));
const Visit_1 = __importDefault(require("../database/Models/Visit"));
class PetController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, age, weight, color } = req.body;
                let images;
                const schema = Yup.object().shape({
                    color: Yup.string().required("A cor do pet é obrigatoria!"),
                    weight: Yup.number().required("O peso do pet é obrigatorio!"),
                    age: Yup.number().required("A idade do pet é obrigatoria"),
                    name: Yup.string().required("O nome do pet é obrigatorio!"),
                });
                yield schema.validate(req.body, { abortEarly: true });
                const token = (0, getToken_1.default)(req, res);
                const user = yield (0, getUserByToken_1.default)(token, res);
                if (!user) {
                    return res
                        .status(422)
                        .json({ message: "Faça login para completar a ação!" });
                }
                const petData = {
                    name: name,
                    age: age,
                    weight: weight,
                    color: color,
                    available: true,
                    userId: user.id,
                };
                const petCreate = yield Pet_1.default.create(petData);
                if (req.files) {
                    images = req.files;
                    images.map((image) => {
                        const petImageData = {
                            name: image.filename,
                            petId: petCreate.id,
                        };
                        PetImage_1.default.create(petImageData);
                    });
                }
                return res
                    .status(201)
                    .json({ message: "Usuario criado com sucesso!", petCreate });
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    const yupErrors = error.message;
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
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const pet = yield Pet_1.default.findByPk(id);
            if (!pet) {
                return res.status(422).json({ message: "Pet não encontrado!" });
            }
            const petImages = yield PetImage_1.default.findAll({ where: { petId: pet.id } });
            if (petImages) {
                petImages.map((Petimage) => {
                    Petimage.destroy();
                });
            }
            pet.destroy();
            return res.status(200).json({ message: "Usuario deletado com sucesso!" });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, age, weight, color } = req.body;
                const id = parseInt(req.params.id);
                let images;
                const schema = Yup.object().shape({
                    color: Yup.string(),
                    weight: Yup.number(),
                    age: Yup.number(),
                    name: Yup.string(),
                });
                yield schema.validate(req.body, { abortEarly: true });
                const token = (0, getToken_1.default)(req, res);
                const user = yield (0, getUserByToken_1.default)(token, res);
                if (!user) {
                    return res
                        .status(422)
                        .json({ message: "Faça login para completar a ação!" });
                }
                const petSometimes = yield Pet_1.default.findByPk(id);
                if (!petSometimes) {
                    return res.status(422).json({ message: "Pet não encontrado" });
                }
                const petData = {
                    name: name,
                    age: age,
                    weight: weight,
                    color: color,
                };
                const petUpdate = yield petSometimes.update(petData, {
                    where: { id: id },
                });
                if (req.files) {
                    images = req.files;
                    images.map((image) => {
                        const petImageData = {
                            name: image.filename,
                            petId: id,
                        };
                        PetImage_1.default.destroy({ where: { petId: id } });
                        PetImage_1.default.create(petImageData);
                    });
                }
                return res
                    .status(200)
                    .json({ message: "Pet editado com sucesso", petUpdate });
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    const yupErrors = error.message;
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
    getPetById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            const pet = yield Pet_1.default.findByPk(id);
            if (!pet) {
                return res.status(422).json({ message: "Pet não cadastrado!" });
            }
            return res.status(200).json({ pet });
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pets = yield Pet_1.default.findAll();
            if (!pets) {
                return res.status(422).json({ message: "Nenhum pet cadastrado" });
            }
            return res.status(200).json({ pets });
        });
    }
    getAllUserPets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, getToken_1.default)(req, res);
            const user = yield (0, getUserByToken_1.default)(token, res);
            if (!user) {
                return res.status(401).json({ message: "Acesso negado!" });
            }
            const pets = yield Pet_1.default.findAll({ where: { userId: user.id } });
            return res.status(200).json({ pets });
        });
    }
    getAllUserAdoptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, getToken_1.default)(req, res);
            const user = yield (0, getUserByToken_1.default)(token, res);
            if (!user) {
                return res.status(401).json({ message: "Acesso negado!" });
            }
            const pets = yield Pet_1.default.findAll({
                where: { adopterID: user.id },
            });
            return res.status(200).json({ pets });
        });
    }
    adoptPet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const petId = req.body.petId;
            const adopterEmail = req.body.email;
            const visit = yield Visit_1.default.findOne({ where: { petId: petId } });
            if (!visit) {
                return;
            }
            const pet = yield Pet_1.default.findByPk(petId);
            if (!pet) {
                return res.status(404).json({ message: "Pet não encontrado!" });
            }
            if (!pet.available) {
                return res.status(503).json({ message: "Pet ja adotado!" });
            }
            const adopter = yield User_1.default.findOne({ where: { email: adopterEmail } });
            if (!adopter) {
                return res.status(404).json({
                    message: `Usuario com email '${adopterEmail}' não encontrado`,
                });
            }
            const petData = {
                adopterID: adopter.id,
                available: false,
            };
            yield pet.update(petData);
            return res
                .status(200)
                .json({ message: "Parabéns a adoção do pet foi concluida!" });
        });
    }
}
exports.default = new PetController();
