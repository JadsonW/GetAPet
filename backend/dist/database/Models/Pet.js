"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conn_1 = __importDefault(require("../conn/conn"));
const User_1 = __importDefault(require("./User"));
//Adicionar o tipo do pet
class Pet extends sequelize_1.Model {
}
Pet.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    color: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    adopterID: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    available: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    timestamps: true,
    sequelize: conn_1.default,
});
Pet.belongsTo(User_1.default, {
    foreignKey: "userId",
    as: "petOwner",
});
exports.default = Pet;
