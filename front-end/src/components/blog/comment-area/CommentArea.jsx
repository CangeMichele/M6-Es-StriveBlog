import { useState, useEffect } from "react";
import { useParams, Link  } from "react-router-dom";


import {
  getBlog,
  getComments,
  addComment,
  getUserData,
} from "../../../services/api";

import "./style.css";

export default function CommentArea() {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    nome: "",
    cognome: "",
    email: "",
    content: "",
  });

  const [logged, setLogged] = useState(false);
  const [userData, setUserData] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postResponse = await getBlog(id);
        setBlog(postResponse);

        const getResponse = await getComments(id);
        setComments(getResponse);
      } catch (error) {
        console.error("Errore caricamento dati", error);
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token"); // Recupera il token di autenticazione dalla memoria locale
      if (token) {
        setLogged(true);
        try {
          const data = await getUserData(); // Ottiene i dati dell'utente autenticato dall'API
          setUserData(data); // Imposta i dati dell'utente nello stato
          fetchComments();
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error); // Logga l'errore in console
          setLogged(false); // Imposta lo stato di autenticazione a false
        }
      } else {
        setLogged(false); // Imposta lo stato di autenticazione a false
      }
    };
  }, [id]);

  //gestore campi nuovo comemnto
  const handleComment = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  //gestore invio dati
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(id, newComment);
      const response = await getComments(id);
      setComments(response);
      setNewComment({
        nome: "",
        cognome: "",
        email: "",
        content: "",
      });
    } catch (error) {
      console.error("Errore nel caricamento nuovo commento:", error);
    }
  };

  if (!blog && logged) return <div>Caricamento commenti...</div>;

  return (
    <div className="container">
      <div className="comments-section">
        <h2>Commenti</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <h6>
                {comment.nome} {comment.cognome}
              </h6>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>Inserisci il primo commento !</p>
        )}

        {logged ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              value={newComment.nome}
              onChange={handleComment}
              placeholder="Nome"
              required
            />
            <input
              type="text"
              name="cognome"
              value={newComment.cognome}
              onChange={handleComment}
              placeholder="Cognome"
              required
            />
            <input
              type="email"
              name="email"
              value={newComment.email}
              onChange={handleComment}
              placeholder="Email"
              required
            />
            <textarea
              name="content"
              value={newComment.content}
              onChange={handleComment}
              placeholder="Il tuo commento"
              required
            ></textarea>
            <button type="submit">Invia commento</button>
          </form>
        ) : (
          <p className="no-logged-section">
            <Link to="/login">Accedi</Link> per visualizzare o lasciare commenti.
          </p>
        )}
      </div>
    </div>
  );
}
