import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import CommentArea from "../../components/blog/comment-area/CommentArea";
import BlogLike from "../../components/likes/BlogLike";

import { getBlog, getAuthorEmail} from "../../services/api";

import "./styles.css";

const Blog = () => {

  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const params = useParams();

  useEffect(() => {
    const { id } = params;

    const fetchBlog = async () => {
      try {
        const response = await getBlog(id);
        setBlog(response);
      } catch (error) {
        console.error("Errore nella fetch del post:", error);
      }
    };

    fetchBlog();
  }, [params]);
  

  useEffect(() => {
    const fetchAuthorEmail = async () => {
      if (blog && blog.author && blog.author.email) {
        try {
          const response = await getAuthorEmail(blog.author.email);
          setAuthor(response);
        } catch (error) {
          console.error("Errore nella fetch AuthorEmail:", error);
        }
      }
    };

    fetchAuthorEmail();
  }, [blog]);

  if (!blog) {
    return null; 
  }

  return (
    <div className="blog-details-root">
      <Container>
        <Image className="blog-details-cover" src={blog.cover} fluid />
        <h1 className="blog-details-title">{blog.title}</h1>

        <div className="blog-details-container">
          <div className="blog-details-author">
            <BlogAuthor {...author} />
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

        <CommentArea />
      </Container>
    </div>
  );
};

export default Blog;
