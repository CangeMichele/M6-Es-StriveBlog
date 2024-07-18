import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useNavigate } from "react-router-dom";

const NewBlogPost = () => {
  const [newBlog, setNewBlog] = useState({
    category: "categoria 1",
    title: "",
    readTime: {
      value: "0",
      unit: "minute",
    },
    author: {
      nome: "Michele",
      cognome: "Cangemi",
      avatar: "https://picsum.photos/300/300",
      email: "cange.michele@gmail.com",
    },
    content: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);

    const lengthBlog = htmlContent.length;
    let readTimeValue;
    if (lengthBlog <= 1000) {
      readTimeValue = 1;
    } else if (lengthBlog > 1000 && lengthBlog <= 1200) {
      readTimeValue = 5;
    } else if (lengthBlog > 1200 && lengthBlog <= 1500) {
      readTimeValue = 10;
    } else {
      readTimeValue = 15;
    }

    setNewBlog({
      ...newBlog,
      content: htmlContent,
      readTime: { value: readTimeValue, unit: "minute" },
    });
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
    console.log("Selected file:", e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(newBlog).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", newBlog.readTime.value);
          formData.append("readTime[unit]", newBlog.readTime.unit);
        }

        if (key === "author") {
          formData.append("author[nome]", newBlog.author.nome);
          formData.append("author[cognome]", newBlog.author.cognome);
          formData.append("author[avatar]", newBlog.author.avatar);
          formData.append("author[email]", newBlog.author.email);
        }

        formData.append(key, newBlog[key]);
      });

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Logga tutti i contenuti di formData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch("http://localhost:5000/api/blogPosts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Blog post created:", result);
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            onChange={handleChange}
            value={newBlog.title}
            name="title"
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            onChange={handleChange}
            value={newBlog.category}
            name="category"
            required
          >
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            placeholder="Inserisci qui il contenuto del blog"
            name="content"
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-img" className="mt-3">
          <Form.Label>Inserisci un'immagine</Form.Label>
          <Form.Control
            type="file"
            name="cover"
            onChange={handleFileChange}
            required
          />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button
            type="reset"
            size="lg"
            variant="outline-dark"
            style={{ marginLeft: "1em" }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
