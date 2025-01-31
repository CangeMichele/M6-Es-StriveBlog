import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
      // Recupera il token dalla memoria locale
      const token = localStorage.getItem("token");
      if (token) {
        // Se il token esiste, aggiungilo all'header di autorizzazione
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log("Token inviato:", token); 
      }
      return config; 
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// ***** ----- CRUD BLOG ----- *****

//GET tutti i blog
export const getBlogs = () => api.get("/blogPosts/all");

// GET tutti i blog con impaginazione
export const getBlogsPage = (currentPage, limit) =>
    api.get('blogPosts', {
        params: {
            page: currentPage,
            limit: limit
        }
    });

//GET singolo blog
export const getBlog = (id) =>
    api.get(`/blogPosts/${id}`).then((response) => response.data);

//POST nuovo blog
export const createBlog = (newBlogData) =>
    api.post("/blogPosts", newBlogData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

//PATCH singolo blog 
export const updateBlog = (id, blogData) =>
    api.patch(`/blogPosts/${id}`, blogData);

//DELETE un blog
export const deleteBlog = (id) => api.delete(`/blogPosts/${id}`);




// ***** ----- CRUD BLOG => commenti ----- *****

//GET tutti i commenti di un blog
export const getComments = (blogId) =>
    api.get(`/blogPosts/${blogId}/comments`).then((response) => response.data);

//POST commento ad un blog
export const addComment = (blogId, commentData) =>
    api
        .post(`/blogPosts/${blogId}/comments`, commentData)
        .then((response) => response.data);

//GET di un commento di un blog
export const getComment = (postId, commentId) =>
    api
        .get(`/blogPosts/${postId}/comments/${commentId}`)
        .then((response) => response.data);

//PATCH di un comemnto di un blog
export const updateComment = (blogId, commentId, commentData) =>
    api
        .patch(`/blogPosts/${blogId}/comments/${commentId}`, commentData)
        .then((response) => response.data);

//DELETE un commento di un blog 
export const deleteComment = (blogId, commentId) =>
    api
        .delete(`/blogPosts/${blogId}/comments/${commentId}`)
        .then((response) => response.data);



// ***** ----- CRUD AUTHORS ----- *****

//GET autore per email
export const getAuthorEmail = (email) =>
    api.get(`/authors/email/${email}`).then((response) => response.data);

//POST nuovo utente
export const newUser = (userData) =>
    api.post("/authors", userData);

// login di un utente
export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Errore nella chiamata login", error);
        throw error;
    }
};

// Dati dell'utente attualmente loggato 
export const getMe = () =>
    api.get("/auth/me").then((response) => response.data);

// Dati dell'utente attualmente loggato con gestione degli errori

export const getUserData = async () => {
    try {
        const response = await api.get("/auth/me");
        return response.data
    } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error); // Log dell'errore per debugging
        throw error;
    }
};




export default api;