import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";

import { Container, Form, Button } from "react-bootstrap";


export default function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    // gestisce  cambiamento  input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // gestisce invio form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);

            // memorizza token in localStorage
            localStorage.setItem("token", response.token);

            // Trigger per aggiornare la Navbar
            window.dispatchEvent(new Event("storage"));

            alert("Login effettuato con successo!");
            navigate("/");

        } catch (error) {
            console.error("Errore di autenticazione:", error);
            alert("Credenziali errate");
        }
    };

    return (

        <Container className="login-form-container">
            <h2>Login</h2>
            <Form className="mt-5" onSubmit={handleSubmit}>

                <Form.Group controlId="login-form-email" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        size="lg"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="login-form-password" className="mt-3">
                    <Form.Label>password</Form.Label>
                    <Form.Control
                        size="lg"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                </Form.Group>


                <Button
                    type="submit"
                    size="lg"
                    variant="dark"
                >
                    Accedi
                </Button>
            </Form>
        </Container>
    );
}