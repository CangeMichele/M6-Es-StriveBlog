import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET/authors => ritorna lista degli autori
router.get("/authors", async (req, res) => {
    try {
        const user = await User.find({});
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET/authors/:_id => ritorna il singolo autore
router.get("/authors/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message: "utente non trovato"})
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});

// POST/authors => crea nuovo autore
router.post("/authors", async (req, res) =>{
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//----- Extra

// PUT/authors/:id => modifica l'autore associato (uso patch per aggiornare singola voce e non tutto il documento)
router.patch("/authors/:id", async (req, res) =>{
try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updateUser);

} catch (error) {
    res.status(400).json({message: error.message});
    
}});


// DELETE /authors/:idf
router.delete("/authors/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({message: "Utente cancellato"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;



