"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let folder = "";
        if (req.baseUrl.includes("user")) {
            folder = "users";
        }
        else if (req.baseUrl.includes("pet")) {
            folder = "pets";
        }
        cb(null, `src/public/images/${folder}/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const imageUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error("Por favor, envie apenas png, jpg, ou jpeg!"));
        }
        cb(null, true);
    },
});
exports.default = imageUpload;
