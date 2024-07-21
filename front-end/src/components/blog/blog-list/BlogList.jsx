import React, { useEffect, useState } from "react";
import { Col, Row, Button, Form } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import { getBlogsPage } from "../../../services/api";

const BlogList = (props) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(3);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {

      //richiamo i dati dal db con impaginazione
     const fetchBlogs = async () => {
      try {
        const response = await getBlogsPage(currentPage, limit);
        setBlogs(response.data.blogs);
        setTotalPages(response.data.totalPages); 
      } catch (error) {
        console.error("Errore nella fetch del post:", error);
      }
    };
    fetchBlogs();

  }, [currentPage, limit]);


  return (
    <>
      <Row>
        {blogs.map((blog, i) => (
          <Col
            key={`item-${i}`}
            md={4}
            style={{
              marginBottom: 50,
            }}
          >
            <BlogItem key={blog.title} {...blog} />
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center align-items-center my-3">
        <Col className="text-center">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-2"
          >
            Back
          </Button>
          <h5 className="d-inline mx-2">
            {currentPage} / {totalPages}{" "}
          </h5>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-2"
          >
            Next
          </Button>
          <Form.Select
            value={limit}
            onChange={
              (e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1)
              }
            }
            className="mx-2"
            style={{ width: 'auto' }}
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
          </Form.Select>
        </Col>
      </Row>
    </>
  );
};

export default BlogList;
