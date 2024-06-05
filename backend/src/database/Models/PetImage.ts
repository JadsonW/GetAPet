import { Model, DataTypes, ForeignKey, Association } from "sequelize";
import conn from "../conn/conn";

import Pet from "./Pet";

interface petImageAttribute {
  id?: number;
  name?: string;
  petId?: number;
  src?: string;
}

class PetImage extends Model<petImageAttribute> {
  declare id: number;
  declare imageUrl: string;
  declare src: string;

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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    src: {
      type: DataTypes.STRING,
    }
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

export { petImageAttribute };
export default PetImage;
