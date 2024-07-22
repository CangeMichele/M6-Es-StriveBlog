import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

import { Button, Container, Form } from "react-bootstrap";

import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";

import { createBlog, getMe } from "../../services/api";


import "./styles.css";

const NewBlogPost = () => {
  const [newBlog, setNewBlog] = useState({
    category: "",
    title: "",
    readTime: {
      value: "0",
      unit: "minute",
    },
    author: {
      email: "",
    },
    content: "",
    cover:"https://picsum.photos/1000/300"
  });

  const [coverFile, setCoverFile] = useState(null);
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setNewBlog((prevBlog) => ({ ...newBlog, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  // gestore cambiamento campi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  // gestore cambiamento dell'editor
  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);

    const lengthBlog = htmlContent.length;
    let readTimeValue;
    // in base alla lunghezza del blog calcolo il tempo di lettura
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

  // gestore cambiamento seleziona file
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  // gestore invio dati form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(newBlog).forEach((key) => {

        if (key === "readTime") {
          formData.append("readTime[value]", newBlog.readTime.value);
          formData.append("readTime[unit]", newBlog.readTime.unit);
        
        } else if (key === "author") {
          formData.append("author[email]", newBlog.author.email);
       
        } else {
          formData.append(key, newBlog[key]);
        }

      });

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Logga tutti i contenuti di formData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await createBlog(formData);
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
            <option>Student Stories</option>
            <option>Getting Started</option>
            <option>The W Pledge</option>
            <option>Learnings and Tips</option>
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
