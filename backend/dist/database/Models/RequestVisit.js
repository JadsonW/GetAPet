"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//conection bd
const conn_1 = __importDefault(require("../conn/conn"));
//Models
const User_1 = __importDefault(require("./User"));
const Pet_1 = __importDefault(require("./Pet"));
class RequestVisit extends sequelize_1.Model {
}
RequestVisit.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    timestamps: true,
    sequelize: conn_1.default,
});
RequestVisit.belongsTo(Pet_1.default, {
    foreignKey: "petId",
    as: "pet",
});
RequestVisit.belongsTo(User_1.default, {
    foreignKey: "adopterId",
    as: "adopter",
});
exports.default = RequestVisit;
