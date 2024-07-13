import express from "express"
import endpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

const app = express();

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log("MONGOOSE connesso"))
    .catch((err) => console.error("MONGOOSE: errore - ", err))

const PORT = process.env.PORT || 5001;

app.use("/", userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server acceso alla porta ${PORT}`);
    console.log("Sono disponibli i seguenti end points");
    console.table(endpoints(app));

});