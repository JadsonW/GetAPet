import { Request, Response } from "express";

const getToken = (req: Request, res: Response): string | any => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não encontrado!" });
  }
  return token;
};

export default getToken;
