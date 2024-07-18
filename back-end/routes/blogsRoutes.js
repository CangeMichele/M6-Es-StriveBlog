import express from "express";
import Blog from "../models/Blog.js";

import cloudinaryUploader from "../config/cloudinaryConfig.js"


const router = express.Router();

// POST/blog => crea nuovo blog
// router.post("/", async (req, res) => {
//     const { category, title, cover, readTime, author, content } = req.body;

//     try {
//       const newBlog = await Blog.create({
//         //destrutturo per essere sicuro di non ritrovarmi campi id automatici non richiesti
//         category,
//         title,
//         cover,
//         readTime,
//         author,
//         content
//       });
//       console.log(newBlog);


//       res.status(201).json(newBlog);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

// POST/blog => crea nuovo blog con caticamento file
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
    try {
        const blogData = req.body;
        if (req.file) {
            blogData.cover = req.file.path;
        }

        const newBlog = new Blog(blogData);
        await newBlog.save();

        res.status(201).json(newBlog);
        
    } catch (error) {
        console.error("Errore nella creazione nuovo blog", error);
        res.status(400).json({ message: error.message });
    }
});





// PATCH/blog/:_id => modifica blog
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

// DELETE /blogPosts/:id
router.delete("/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog cancellato" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// GET/blog => ritorna lista dei blog
// router.get("/", async (req, res) => {
//     try {
//         const blog = await Blog.find({});
//         res.json(blog);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// GET/blog => ritorna lista dei blog con paginazione
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

// GET/blog/:_id => ritorna il singolo blog
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({ message: "utente non trovato" })
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});


//GET/blog => ricerca su titolo
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




export default router;