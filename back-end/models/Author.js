import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new Schema(
    {
        nome: { type: String, required: true },
        cognome: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        data_nascita: { type: String, required: true },
        avatar: { type: String, required: false },
        password: { type: String, required: true }
    },
    {
        collection: "authors"
    }
);

// Confrontare la password
authorSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

// Hashing delle password prima del salvataggio
authorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

const Author = model("Author", authorSchema);
export default Author;
