import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
});

//CRUD Blog
export const getAllBlogs = () => api.get("/blogPosts");
export const getBlog = (id) => api.get(`/blogPosts/${id}`);

// export const postBlog = (data) => api.post("/blogPosts", data);
export const postBlog = (data) => api.post("/blogPosts", data,{
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const patchBlog = (id, data) => api.patch(`/blogBlogs/${id}`, data);

export const deleteBlog = (id) => api.delete(`/${id}`);

export default api;