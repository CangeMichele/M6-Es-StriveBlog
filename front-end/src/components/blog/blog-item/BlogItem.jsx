import React, { useEffect } from "react";
import { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";


const BlogItem = (props) => {
  const [authorFound, setAuthorFound] = useState("");
  const { title, cover, author, _id } = props;
useEffect(()=> {

  fetch(
    `http://localhost:5000/api/authors/email/${author.email}`
  )
  .then((response) => response.json())
  .then((data) => {
    setAuthorFound(data);
  })
  .catch((err) => console.error("ERRORE ", err));
  

},[authorFound, author.email]);
  
  return (
    <Link to={`/blog/${_id}`} className="blog-link">
      <Card className="blog-card">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
        <Card.Footer>
          <BlogAuthor {...authorFound} />
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default BlogItem;
