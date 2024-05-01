import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET!;

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const verified = verify(token, secret) as JwtPayload;
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

export default checkToken