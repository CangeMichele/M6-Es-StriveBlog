import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { newUser } from "../../services/api";
import { Container, Form, Button } from "react-bootstrap";


export default function Register() {

    const [newAuthor, setNewAuthor] = useState({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        data_nascita: ""
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();


    //aggiorna formData al cambiamento dei campi form
    const handleChange = (e) => {
        setNewAuthor({ ...newAuthor, [e.target.name]: e.target.value });
    };


    // gestore cambiamento seleziona file
    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    //gestisce l'invio dati
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            Object.keys(newAuthor).forEach((key) => {

                formData.append(key, newAuthor[key]);

            });
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }


            for (let pair of formData.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }

            await newUser(newAuthor);

            alert("Registrato!");

            navigate("/login");
        } catch (error) {
            console.error("Errore durante la registrazione:", error);
            alert("Errore durante la registrazione. Riprova.");
        }
    };

    return (
        <Container className="new-user-container">
            <h2>Registrati</h2>
            <Form className="mt-5" onSubmit={handleSubmit}>

                <Form.Group controlId="newAuthor-form-nome" className="mt-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        size="lg"
                        placeholder="Mario"
                        onChange={handleChange}
                        value={newAuthor.nome}
                        name="nome"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="newAuthor-form-cognome" className="mt-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control
                        size="lg"
                        placeholder="Rossi"
                        onChange={handleChange}
                        value={newAuthor.cognome}
                        name="cognome"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="newAuthor-form-email" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        size="lg"
                        placeholder="Mario.rossi@email.it"
                        onChange={handleChange}
                        value={newAuthor.email}
                        name="email"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="newAuthor-form-password" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="password"
                        placeholder="*********"
                        onChange={handleChange}
                        value={newAuthor.password}
                        name="password"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="newAuthor-form-data_nascita" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="date"
                        name="data_nascita"
                        placeholder="*********"
                        onChange={handleChange}
                        value={newAuthor.data_nascita}
                        
                    />
                </Form.Group>

                <Form.Group controlId="blog-img" className="mt-3">
                    <Form.Label>Inserisci un'immagine profilo</Form.Label>
                    <Form.Control
                        type="file"
                        name="avatar"
                        onChange={handleFileChange}
                        required
                    />
                </Form.Group>

                <Button
                    type="submit"
                    size="lg"
                    variant="dark"
                    style={{ marginLeft: "1em" }}
                >
                    Registrati
                </Button>
            </Form>
        </Container>
    );
}