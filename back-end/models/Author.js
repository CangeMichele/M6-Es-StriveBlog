import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
        nome: {
            type: String,
            required: true
        },

        cognome: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },


        data_nascita: {
            type: String,
            required: true
        },

        avatar: {
            type: String,
            required: true,
        }


    },

    {
        collection: "authors"
    }

);

const Author = model("Author", authorSchema);
export default Author;
