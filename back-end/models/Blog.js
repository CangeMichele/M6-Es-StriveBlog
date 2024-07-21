import { Schema, model } from "mongoose";

// ----- Schema dei commenti(contenuti nel blog)
const commentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: true
  },
)

// ----- Schema dei blog
const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },

    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },

    author: { 
      email:{type: String, required: true }
    },
    content: { type: String, required: true },
    comments: [commentSchema] 
  },

  {
    timestamps: true,
    collection: "blogPosts",
  },
);

const Blog = model("Blog", blogSchema);
export default Blog;
