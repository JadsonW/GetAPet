import { Model, DataTypes, ForeignKey, Association } from "sequelize";
import conn from "../conn/conn";

import User from "./User";

interface petAttributes {
  id?: number;
  name?: string;
  age?: number;
  weight?: number;
  color?: string;
  type?: string;
  adopterID?: number;
  userId?: number;
  available?: boolean;
}

//Adicionar o tipo do pet

class Pet extends Model<petAttributes> {
  declare id: number;
  declare name: string;
  declare age: string;
  declare weight: string;
  declare color: string;
  declare type: string;
  declare adopterID: number;
  declare available: boolean;

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
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adopterID: {
      type: DataTypes.INTEGER,
    },
    available: {
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
  as: "petOwner",
});

export { petAttributes };
export default Pet;
