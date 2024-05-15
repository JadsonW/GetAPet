import { Association, DataTypes, ForeignKey, Model } from "sequelize";
import conn from "../conn/conn";

import User from "../Models/User";
import Pet from "../Models/Pet";

interface visitAttributes {
  id?: number;
  data?: Date;
  local?: string;
  time?: string;
  description?: string;
  adopterId?: number;
  petId?: number;
  ownerId?: number
  confirmed?: boolean;
}

class Visit extends Model<visitAttributes> {
  declare id: number;
  declare data: Date;
  declare local: string;
  declare time: string;
  declare description?: string;
  declare confirmed?: boolean;

  declare adopterId: ForeignKey<User["id"]>;
  declare petId: ForeignKey<Pet["id"]>;
  declare ownerId: ForeignKey<User["id"]>;

  declare static associations: {
    adopter: Association<Visit, User>;
    pet: Association<Visit, Pet>;
    owner: Association<Visit, User>;
  };
}

Visit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    local: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: conn,
  }
);

Visit.belongsTo(Pet, {
  foreignKey: "petId",
  as: "pet",
});
Visit.belongsTo(User, {
  foreignKey: "adopterId",
  as: "adopter",
});
Visit.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

export { visitAttributes };
export default Visit;
