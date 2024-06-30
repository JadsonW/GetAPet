import { Router } from "express";

//controller
import RequestVisitController from "../controllers/RequestVisitController";

//helpers
import checkToken from "../helpers/checkToken";

const router = Router();

router.post(
  "/create/:petid",
  checkToken,
  RequestVisitController.createReqtVisit
);
router.delete('/delete/:id', checkToken, RequestVisitController.deleteReqtVisit)
router.get("/allReqs/:id", checkToken, RequestVisitController.getAllReqVisitById)

export default router;
