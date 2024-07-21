import React, { useEffect } from "react";
import { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";

const BlogItem = (props) => {
  const [infoAuthor, setInfoAuthor] = useState("");
  const { title, cover, author, _id } = props;

  //interogo DB per ottenere info autore cos' che siano semrpe aggiornate
  useEffect(() => {
    fetch(`http://localhost:5000/api/authors/email/${author.email}`)
      .then((response) => response.json())
      .then((data) => {
        setInfoAuthor(data);
      })
      .catch((err) => console.error("ERRORE ", err));
  }, [author]);

  return (
    <Link to={`/blog/${_id}`} className="blog-link">
      <Card className="blog-card">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
        <Card.Footer>
          <BlogAuthor {...infoAuthor} />
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default BlogItem;
