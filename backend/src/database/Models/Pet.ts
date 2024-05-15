import { Model, DataTypes, ForeignKey, Association } from "sequelize";
import conn from "../conn/conn";

import User from "./User";

interface petAttributes {
  id?: number;
  name?: string;
  age?: number;
  weight?: number;
  color?: string;
  adopterID?: number;
  userId?: number;
  available?: boolean;
}

class Pet extends Model<petAttributes> {
  declare id: number;
  declare name: string;
  declare age: number;
  declare weight: number;
  declare color: string;
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
