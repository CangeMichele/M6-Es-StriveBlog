import express from "express"
import endpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authorsRoutes from "./routes/authorsRoutes.js";
import blogsRoutes from "./routes/blogsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler,
} from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MONGOOSE connesso"))
    .catch((err) => console.error("MONGOOSE: errore - ", err))

app.use("/api/auth", authRoutes)
app.use("/api/authors", authorsRoutes);
app.use("/api/blogPosts", blogsRoutes);

const PORT = process.env.PORT || 5001;

//middelware della gestione errori 
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);


app.listen(PORT, () => {
    console.log(`Server acceso alla porta ${PORT}`);
    console.log("Sono disponibli i seguenti end points");
    console.table(endpoints(app));

});