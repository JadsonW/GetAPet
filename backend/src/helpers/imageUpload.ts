import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes("user")) {
      folder = "users";
    } else if (req.baseUrl.includes("pet")) {
      folder = "pets";
    }

    cb(null, `src/public/images/${folder}/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const imageUpload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Por favor, envie apenas png, jpg, ou jpeg!"));
    }
    cb(null, true);
  },
});
export default imageUpload;
