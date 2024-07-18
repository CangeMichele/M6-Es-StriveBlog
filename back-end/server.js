import express from "express"
import endpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authorsRoutes from "./routes/authorsRoutes.js";
import blogsRoutes from "./routes/blogsRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log("MONGOOSE connesso"))
    .catch((err) => console.error("MONGOOSE: errore - ", err))

const PORT = process.env.PORT || 5001;

app.use("/api/authors", authorsRoutes);
app.use("/api/blogPosts", blogsRoutes);

app.listen(PORT, ()=> {
    console.log(`Server acceso alla porta ${PORT}`);
    console.log("Sono disponibli i seguenti end points");
    console.table(endpoints(app));

});