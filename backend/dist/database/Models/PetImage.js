"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conn_1 = __importDefault(require("../conn/conn"));
const Pet_1 = __importDefault(require("./Pet"));
class PetImage extends sequelize_1.Model {
}
PetImage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: conn_1.default,
    timestamps: true,
});
PetImage.belongsTo(Pet_1.default, {
    foreignKey: "petId",
    as: "petImages",
});
exports.default = PetImage;
