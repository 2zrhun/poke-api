import { Navbar, Nav, Container } from "react-bootstrap";
import "../style/Header.css";
import logo from "../image/logo.jpg";
export default function Header() {
  const Mytoken = localStorage.getItem("Saved_Token");
  const usId = localStorage.getItem("Saved_UserId");
  async function LogOut() {
    const response3 = await fetch(
      `http://localhost:5000/updatefalse/${localStorage.getItem(
        "Saved_UserId"
      )}`,
      {
        method: "POST",
      }
    );
    if (!response3.ok) {
      const message = `An error occurred: ${response3.statusText}`;
      window.alert(message);
      return;
    }
    localStorage.removeItem("Saved_Token");
    localStorage.removeItem("Saved_UserId");
    localStorage.removeItem("Saved_Username");
    alert("Vous etes desormais deconnecte ! ");
    console.log("voici la reponse");
  }
  let nav_Poke = `pokedex2/${localStorage.getItem("Saved_UserId")}`;

  return (
    <div>
      <Navbar className="nvbar">
        <Container>
          <Nav className="me-auto">
            <Navbar.Brand>
              <img src={logo} />
            </Navbar.Brand>
            <p className="title">PokeFighter</p>
            <Nav.Link href="/pokemons">Pokemons</Nav.Link>

            <Nav.Link
              href={`/pokedex2/${localStorage.getItem("Saved_UserId")}`}
            >
              My pokedex2
            </Nav.Link>
            <Nav.Link href={`/record/${localStorage.getItem("Saved_UserId")}`}>
              Fight
            </Nav.Link>
            {/*putting this in a popup ??*/}

            <div className="drpdown">
              <button className="drpbtn">Mon compte:</button>
              <div className="drpdown-content">
                <a href="/connexion">connexion</a>
                <a href="/connexion">inscription</a>
                <button onClick={LogOut}>Deconnexion</button>
              </div>
            </div>
            <p className="username" color="white">
              {" "}
              <big>{localStorage.getItem("Saved_Username")}</big>
            </p>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}
