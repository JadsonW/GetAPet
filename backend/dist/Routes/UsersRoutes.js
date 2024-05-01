"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Controlador
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
//Rotas
router.post("/create", UserController_1.default.createdUser);
router.get("/:id", UserController_1.default.getUserById);
router.patch("/edit/:id", UserController_1.default.updatedUser);
router.delete("/remove/:id", UserController_1.default.removeUser);
exports.default = router;
