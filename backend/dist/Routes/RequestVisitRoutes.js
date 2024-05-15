"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//controller
const RequestVisitController_1 = __importDefault(require("../controllers/RequestVisitController"));
//helpers
const checkToken_1 = __importDefault(require("../helpers/checkToken"));
const router = (0, express_1.Router)();
router.post("/create/:petid", checkToken_1.default, RequestVisitController_1.default.createReqtVisit);
router.delete('/delete/:id', checkToken_1.default, RequestVisitController_1.default.deleteReqtVisit);
router.get("/allReqs", checkToken_1.default, RequestVisitController_1.default.getAllReqVisit);
exports.default = router;
