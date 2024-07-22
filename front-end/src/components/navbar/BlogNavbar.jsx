import React, { useState, useEffect } from "react";
import { Button, Container, Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate  } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";

const NavBar = props => {
  const [logged, setLogget] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    // Controlla se esiste token nel localStorage
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setLogget(!!token);
    };

    // Controlla login all'avvio
    checkLoginStatus();

    // event listener per controllare lo stato login
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogget(false);
    navigate("/");
  };





  return (

    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        
        <Navbar.Brand as={Link} to="/">
        <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          
          {logged ? (
          <>
            <Button
              as={Link}
              to="/new"
              className="blog-navbar-add-button bg-dark text-white"
              size="lg"
              >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
              >
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
              </svg>
              Nuovo Articolo
            </Button>
            
            <Button variant="link" onClick={handleLogout}>
              Logout
            </Button>

          </>
          ) : (

            <>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>

              <Nav.Link as={Link} to="/register">
              Registrati
              </Nav.Link>
            </>
          )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
    }


export default NavBar;
