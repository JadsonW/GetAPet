import { JwtPayload, verify } from "jsonwebtoken";
import { Response } from "express";

//model
import User from "../database/Models/User";

import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET!;

const getUserByToken = async (
  token: string,
  res: Response
): Promise<User | null> => {
  if (!token) {
    return null;
  }

  const decoded = verify(token, secret) as JwtPayload;

  const userId = decoded.id;

  const user = await User.findByPk(userId);
  return user;
};

export default getUserByToken;
