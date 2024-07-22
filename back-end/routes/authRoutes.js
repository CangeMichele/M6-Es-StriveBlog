import express from "express";
import Author from "../models/Author.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ----- POST/login => restituisce token accesso
router.post("/login", async (req, res)=>{
    try {
        
    const {email, password} = req.body;
    
    const author = await Author.findOne({email});
    if(!author){
        return res.status(401).json({message: "Email non valida"})
    }

    const isMatch = await author.comparePassword(password);
    if (!isMatch){
        return res.status(401).json({ message: "Password errata" });
    }

    const token = await generateJWT({id: author.id});
    res.json({ token, message: "Login: ok" });

    } catch (error) {
        console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore del server" });
    }
});

// ----- GET/me => restituisce autore collegato al token 
router.get("/me", authMiddleware, (req,res)=>{
    const authorData = req.author.toObject();
    delete authorData.password;
    res.json(authorData);
});

export default router;