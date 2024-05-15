"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Controller
const PetController_1 = __importDefault(require("../controllers/PetController"));
//Helpers
const checkToken_1 = __importDefault(require("../helpers/checkToken"));
const imageUpload_1 = __importDefault(require("../helpers/imageUpload"));
const router = (0, express_1.Router)();
router.get("/", PetController_1.default.getAll);
router.get("/mypets", checkToken_1.default, PetController_1.default.getAllUserPets);
router.post("/create", checkToken_1.default, imageUpload_1.default.array("images"), PetController_1.default.create);
router.patch("/conclude", checkToken_1.default, PetController_1.default.adoptPet);
router.delete("/remove/:id", checkToken_1.default, PetController_1.default.remove);
router.patch("/update/:id", checkToken_1.default, imageUpload_1.default.array("images"), PetController_1.default.update);
exports.default = router;
