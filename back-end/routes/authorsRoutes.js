import express from "express";
import Author from "../models/Author.js";
import Blog from "../models/Blog.js";

const router = express.Router();

// GET/authors => ritorna lista degli autori
router.get("/", async (req, res) => {
    try {
        const author = await Author.find({});
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET/authors/:_id => ritorna il singolo autore
router.get("/:id", async (req, res)=>{
    try {
        const author = await Author.findById(req.params.id)
        if(!author){
            return res.status(404).json({message: "utente non trovato"})
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});

// POST/authors => crea nuovo autore
router.post("/", async (req, res) =>{
    const author = new Author(req.body);
    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//----- Extra

// PUT/authors/:id => modifica l'autore associato (uso patch per aggiornare singola voce e non tutto il documento)
router.patch("/:id", async (req, res) =>{
try {
    const updateAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updateAuthor);

} catch (error) {
    res.status(400).json({message: error.message});
    
}});


// DELETE /authors/:id
router.delete("/:id", async (req, res) => {
    try {
        await Author.findByIdAndDelete(req.params.id);
        res.json({message: "Utente cancellato"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});



//GET dei blog di un dato autore
router.get('/:id/blogPosts', async (req, res) =>{
    try {
        const author = await Author.findById(req.params.id);
        if(!author){
            return res.status(404).json({message: "Autore non trovato"})
        }

        const blogPosts = await Blog.find({ 'author.email': author.email });
        res.json(blogPosts);

    } catch (error) {
        res.status(500).json({message: error.message});

    }
})


export default router;



