import express from "express";
import Blog from "../models/Blog.js";

import cloudinaryUploader from "../config/cloudinaryConfig.js"
import { sendEmail } from "../services/mailServices.js";


const router = express.Router();

// ----- POST/blogPosts => crea nuovo blog con caticamento file
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
    try {

        //recupero i dati da inserire nel db
        const blogData = req.body;

        //assegno a "cover" l'url dell'immagine
        if (req.file) {
            blogData.cover = req.file.path;
        }

        //salvo i dati nel db
        const newBlog = new Blog(blogData);
        await newBlog.save();

        //creo email di conferma 
        /*
        const htmlContent = `
        <h1>Pubblicazione effettua !<h1>
        <p>ciao <strong>${newBlog.author.nome}</strong>,</P>
        <P>il tuo post <strong>"${newBlog.title}"</strong> è stato pubblicato con successo.</p>
        `;


        //invio email
        await sendEmail(newBlog.author.email, 'StriveBlog - caricamento effettuato', htmlContent);
        */
        res.status(201).json(newBlog);

    } catch (error) {
        console.error("Errore nella creazione nuovo blog", error);
        res.status(400).json({ message: error.message });
    }
});


// ----- PATCH/blogPosts/:_id => modifica blog
router.patch("/:id", async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})


// ----- DELETE /blogPosts/:id
router.delete("/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog cancellato" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ---- GET/blogPosts => ritorna lista dei blog SENZA impaginazione
router.get("/all", async (req, res) => {
    try {
        const blog = await Blog.find({});
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 

// ----- GET/blogPosts => ritorna lista dei blog CON paginazione
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({})
            .skip(skip)
            .limit(limit)

        const total = await Blog.countDocuments();

        res.json({
            blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBlogs: total
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ----- GET/blogPosts/:_id => ritorna il singolo blog
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({ message: "blog non trovato" })
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});


// ----- GET/blogPosts => ricerca su titolo
router.get("/", async (req, res) => {
    try {
        let query = {};
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: 'i' } //i = insensitive
        }
        const blog = await Blog.find(query);
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ----- GET/blogPosts/:id/comments => ritorna tutti i commenti di uno specifico post
router.get("/:id/comments", async (req, res) =>{
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog) {
            return res.status(404).json({message: "Blog non trovato"});
        }
        res.json(blog.comments)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// ----- GET/blogPosts/:id/comments/:commentId => ritorna uno commento specifico di un post specifico
router.get("/:id/comments/:commentId", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog non trovato"});
        }

        const comment = blog.comments.id(req.params.commentId);
        if(!comment){
            return res.status(404).json({message: "Commento non trovato"});
        }
        res.json(comment);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// ----- POST/blogPosts/:id/comments => aggiungi un nuovo commento ad un post specifico
router.post("/:id/comments", async (req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog non trovato"});
        }
        
        const newComment = {
            nome: req.body.nome,
            cognome: req.body.cognome,
            email: req.body.email,
            content: req.body.content
          };

          blog.comments.push(newComment);
          await blog.save();
          res.status(201).json(newComment);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// ------ PUT/blogPosts/:id/comments/:commentId => cambia un commento di un post specifico
router.put("/:id/comments/:commentId", async (req, res) =>{
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog non trovato"});
        }
        const comment = blog.comments.id(req.params.commentId);
        if(!comment){
            return res.status(404).json({message: "Commento non trovato"});
        }
        comment.content = req.body.content;
        await blog.save();
        res.json(comment);
        
    } catch (error) {
        res.status(500).json({message: error.message});

    }
})

// -----  DELETE/blogPosts/:id/comments/:commentId => elimina un commento specifico di un post specifico
router.delete("/:id/comments/:commentId", async (req, res) =>{
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog non trovato"});
        }
        const comment = blog.comments.id(req.params.commentId);
        if(!comment){
            return res.status(404).json({message: "Commento non trovato"});
        }
        // COMMENT mi restuituisce un oggetto JavaScript normale, non un documento Mongoose.  
        //comment.remove(); 

        await blog.save();
           // Rimuovi il commento usando l'operatore $pull
           await Blog.updateOne(
            { _id: req.params.id },
            { $pull: { comments: { _id: req.params.commentId } } }
        )
        res.json("commento eliminato con successo")
    } catch (error) {
        res.status(500).json({message: error.message});

    }
})


export default router;
