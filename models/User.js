import { Schema, model } from "mongoose";

const userSchema = new Schema(
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
            required: false,
        }
    },

    {
        collection: "users"
    }

);

const User = model("User", userSchema);
export default User;
