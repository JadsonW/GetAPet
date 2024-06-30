import { Router } from "express";

import VisitController from "../controllers/VisitController";

import checkToken from "../helpers/checkToken";

const router = Router();

router.get("/petvisits/:id", checkToken, VisitController.getVisitByPet)
router.get("/myvisits/:id", checkToken, VisitController.getVisitByUser)
router.post("/create/:reqid", checkToken, VisitController.createVisit);
router.patch("/disconfirm/:idVisit", checkToken, VisitController.disconfirm);

export default router;
