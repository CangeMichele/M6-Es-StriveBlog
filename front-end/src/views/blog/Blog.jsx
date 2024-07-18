import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const { id } = params;

    fetch(`http://localhost:5000/api/blogPosts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERRORE ", err);
        navigate("/404");
      });
  }, [params, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return null; // Or you could return a 404 component if desired
  }

  return (
    <div className="blog-details-root">
      <Container>
        <Image className="blog-details-cover" src={blog.cover} fluid />
        <h1 className="blog-details-title">{blog.title}</h1>

        <div className="blog-details-container">
          <div className="blog-details-author">
            <BlogAuthor {...blog.author} />
          </div>
          <div className="blog-details-info">
            <div>{new Date(blog.createdAt).toLocaleDateString()}</div>
            <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
            <div
              style={{
                marginTop: 20,
              }}
            >
              <BlogLike defaultLikes={["123"]} onChange={console.log} />
            </div>
          </div>
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        ></div>
      </Container>
    </div>
  );
};

export default Blog;
