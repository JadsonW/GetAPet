import { Model, DataTypes, ForeignKey, Association } from "sequelize";
import conn from "../conn/conn";

import Pet from "./Pet";

class PetImage extends Model {
  declare id: number;
  declare imageUrl: string;

  declare petId: ForeignKey<Pet["id"]>;

  declare static associations: {
    petImages: Association<PetImage, Pet>;
  };
}

PetImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: conn,
    timestamps: true,
  }
);

PetImage.belongsTo(Pet, {
  foreignKey: "petId",
  as: "petImages",
});

export default PetImage;
