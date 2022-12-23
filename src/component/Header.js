import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../style/Header.css";

export default function Header() {
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
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}
