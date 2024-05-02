import { DataTypes, ForeignKey, Model } from "sequelize";
import conn from "../conn/conn";

class User extends Model {
  declare id: number;
  declare name: string;
  declare phone: string;
  declare email: string;
  declare password: string;
  declare image: string;

}

User.init(
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: conn,
  }
);

export default User;
