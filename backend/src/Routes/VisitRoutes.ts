import { Router } from "express";

import VisitController from "../controllers/VisitController";

import checkToken from "../helpers/checkToken";

const router = Router();

router.get("/myvisits", checkToken, VisitController.getVisitByUser)
router.post("/create/:reqid", checkToken, VisitController.createVisit);
router.patch("/disconfirm/:id", checkToken, VisitController.disconfirm);

export default router;
