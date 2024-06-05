import { Router } from "express";

//Controlador
import UserController from "../controllers/UserController";

const router = Router();

//helpers
import checkToken from "../helpers/checkToken";
import imageUpload from "../helpers/imageUpload";

//Rotas
router.post("/create", UserController.createdUser);
router.get("/checkuser", checkToken, UserController.checkUser)
router.get("/:id", checkToken, UserController.getUserById);
router.delete("/remove/:id", checkToken, UserController.removeUser);
router.post("/login", UserController.login);
router.patch(
  "/edit",
  checkToken,
  imageUpload.single("image"),
  UserController.updatedUser
);


export default router;
