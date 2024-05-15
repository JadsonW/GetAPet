import { Association, DataTypes, ForeignKey, Model } from "sequelize";

//conection bd
import conn from "../conn/conn";

//Models
import User from "./User";
import Pet from "./Pet";

interface requestVisitAttributes {
  id?: number;
  petId?: number;
  adopterId?: number;
}

class RequestVisit extends Model<requestVisitAttributes> {
  declare id: number;

  declare petId: ForeignKey<Pet["id"]>;
  declare adopterId: ForeignKey<User["id"]>;

  declare static associations: {
    pet: Association<RequestVisit, Pet>;
    adopter: Association<RequestVisit, User>;
  };
}

RequestVisit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: true,
    sequelize: conn,
  }
);

RequestVisit.belongsTo(Pet, {
  foreignKey: "petId",
  as: "pet",
});
RequestVisit.belongsTo(User, {
  foreignKey: "adopterId",
  as: "adopter",
});

export { requestVisitAttributes };
export default RequestVisit;
