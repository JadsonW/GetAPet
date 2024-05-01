import { DataTypes, Model } from "sequelize";
import conn from "../conn/conn";

export interface UserAttributes {
  id?: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  image?: string;
}

class User extends Model<UserAttributes> {
  public id?: number;
  public name!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public image?: string;
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
