import React from "react";

import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";

import Register from "./views/register/Register";
import Login from "./views/login/Login";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
        <Route path="/" exact element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
