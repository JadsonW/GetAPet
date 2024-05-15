"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VisitController_1 = __importDefault(require("../controllers/VisitController"));
const checkToken_1 = __importDefault(require("../helpers/checkToken"));
const router = (0, express_1.Router)();
router.get("/myvisits", checkToken_1.default, VisitController_1.default.getVisitByUser);
router.post("/create/:reqid", checkToken_1.default, VisitController_1.default.createVisit);
router.patch("/disconfirm/:id", checkToken_1.default, VisitController_1.default.disconfirm);
exports.default = router;
