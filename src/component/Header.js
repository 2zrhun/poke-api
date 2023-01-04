import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../style/Header.css";
import Axios from "axios";

export default function Header() {
  function LogOut() {
    // const saved_token = JSON.stringify(response.data.token);
    localStorage.removeItem("Saved_Token");
    alert("Vous etes desormais deconnecte ! ");
    console.log("voici la reponse");
  }
  return (
    <div>
      <Navbar className="nvbar" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src="../image/download.png" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="record">My pokedex</Nav.Link>
            <Nav.Link href="pokemons">Pokemons</Nav.Link>
            <Nav.Link href="pokemons">Fight</Nav.Link>
            <Nav.Link href="connexion">Connexion</Nav.Link>
            <button onClick={LogOut}>Deconnexion</button>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}
