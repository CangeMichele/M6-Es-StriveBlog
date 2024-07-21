import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getAuthorEmail } from "../../../services/api";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";

const BlogItem = (props) => {
  const [infoAuthor, setInfoAuthor] = useState("");
  const { title, cover, author, _id } = props;


  //interogo DB per ottenere info autore cos' che siano semrpe aggiornate
  useEffect(() => {

    const fetchAuthorEmail = async () => {
      try {
        const response = await getAuthorEmail(author.email);
        setInfoAuthor(response);
      } catch (error) {
        console.error("Errore nella fetch AuthorEmail:", error);
      }
    };
    fetchAuthorEmail();

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
