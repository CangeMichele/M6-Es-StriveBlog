import pkg from 'jsonwebtoken';
const { verify } = pkg;

import Author from "../models/Author.js"

export const authMiddleware = async (req, res, next) => {
    try {
        //  ? previene errori se authorization undefined
        // replace('Bearer ', '') rimuove il prefisso 'Bearer ' dal token
        const token = req.headers.authorization?.replace("Brearer:", "");
        if (!token) { return res.status(401).send("Token mancante"); }

        const author = await Author.findById(decoded.id).select("-password");
        if (!author) { return res.status(401).send("Autore non trovato"); }

        req.author = author;

        next();

    } catch (error) {
        res.status(401).send("Token non valido");
    }
};