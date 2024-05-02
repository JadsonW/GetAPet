import { Model, DataTypes, ForeignKey, Association } from "sequelize";
import conn from "../conn/conn";

import User from "./User";

class Pet extends Model {
  declare id: number;
  declare name: string;
  declare age: number;
  declare weight: number;
  declare color: string;
  declare adopter: boolean;

  declare userId: ForeignKey<User["id"]>;

  declare static associations: {
    petOwner: Association<Pet, User>;
  };
}

Pet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adopter: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
    sequelize: conn,
  }
);

Pet.belongsTo(User, {
  foreignKey: "userId",
  as: 'petOwner'
});

export default Pet;
