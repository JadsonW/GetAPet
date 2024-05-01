import { sign } from "jsonwebtoken";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET!;

const createToken = async (req: Request, user: any, res: Response) => {
  const token = sign(
    {
      name: user.name,
      id: user.id,
    },
    secret
  );

  return res.status(200).json({token, userId: user.id})
};

export default createToken;
