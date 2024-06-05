"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Controlador
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
//helpers
const checkToken_1 = __importDefault(require("../helpers/checkToken"));
const imageUpload_1 = __importDefault(require("../helpers/imageUpload"));
//Rotas
router.post("/create", UserController_1.default.createdUser);
router.get("/checkuser", checkToken_1.default, UserController_1.default.checkUser);
router.get("/:id", checkToken_1.default, UserController_1.default.getUserById);
router.delete("/remove/:id", checkToken_1.default, UserController_1.default.removeUser);
router.post("/login", UserController_1.default.login);
router.patch("/edit", checkToken_1.default, imageUpload_1.default.single("image"), UserController_1.default.updatedUser);
exports.default = router;
