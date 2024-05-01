"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getToken = (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não encontrado!" });
    }
    return token;
};
exports.default = getToken;
