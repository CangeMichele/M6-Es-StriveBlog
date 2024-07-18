import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    category: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    cover: {
      type: String,
      required: true
    },

    readTime: {
        value: {
          type: Number,
          required: true
        },
        unit: {
          type: String,
          enum: ["minute"],
          required: true
        }
    },

    author: {
      type: {
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
          required: true
        },
        avatar: {
          type: String,
          required: false
        }
      },
    },

    content: {
      type: String,
      required: true
    }

  },

  {
    collection: "blog",
    timestamps: true
  }
);

const Blog = model("Blog", blogSchema);
export default Blog;
