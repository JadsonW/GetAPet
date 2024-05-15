import { Router } from "express";

//Controller
import PetController from "../controllers/PetController";

//Helpers
import checkToken from "../helpers/checkToken";
import imageUpload from "../helpers/imageUpload";

const router = Router();

router.get("/", PetController.getAll);
router.get("/mypets", checkToken, PetController.getAllUserPets);
router.post(
  "/create",
  checkToken,
  imageUpload.array("images"),
  PetController.create
);
router.patch("/conclude", checkToken, PetController.adoptPet);
router.delete("/remove/:id", checkToken, PetController.remove);
router.patch(
  "/update/:id",
  checkToken,
  imageUpload.array("images"),
  PetController.update
);

export default router;
