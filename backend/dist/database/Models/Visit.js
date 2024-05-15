"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conn_1 = __importDefault(require("../conn/conn"));
const User_1 = __importDefault(require("../Models/User"));
const Pet_1 = __importDefault(require("../Models/Pet"));
class Visit extends sequelize_1.Model {
}
Visit.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    data: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    local: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    confirmed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: true,
    sequelize: conn_1.default,
});
Visit.belongsTo(Pet_1.default, {
    foreignKey: "petId",
    as: "pet",
});
Visit.belongsTo(User_1.default, {
    foreignKey: "adopterId",
    as: "adopter",
});
Visit.belongsTo(User_1.default, {
    foreignKey: "ownerId",
    as: "owner",
});
exports.default = Visit;
