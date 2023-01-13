import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import Axios from "axios";

function Connexion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [piece, setPiece] = useState(4);

  const [username2, setUsername2] = useState("");
  const [password2, setPassword2] = useState("");

  const [status, setStatus] = useState("");
  const ls = localStorage;

  const Registre = () => {
    Axios.post(`http://localhost:5000/connexion/`, {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        alert(response.data.message);
      }

      console.log(response);
    });
  };
  function getConnected() {
    Axios.post(`http://localhost:5000/connexion/verification/`, {
      username: username2,
      password: password2,
    }).then((response) => {
      if (response.data.message) {
        alert(response.data.message);

        const saved_token = JSON.stringify(response.data.token);
        const saved_UserId = response.data.userId;
        const username = response.data.username;
        localStorage.setItem("Saved_Username", username);

        localStorage.setItem("Saved_Token", saved_token);
        localStorage.setItem("Saved_UserId", saved_UserId);
        console.log("voici la reponse", response.data.message);
        console.log("Voici son id ", response.data.userId);
      }
    });
  }

  return (
    <div>
      <div>
        <h3>INCRIPTION</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nom d´utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nom d´utilisateur"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

            <Form.Text className="text-muted">use a valid username</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={Registre}>
            Submit
          </Button>
        </Form>
      </div>
      <div>
        <h3>Connexion</h3>
        <h4>Vous obtenez 4 pieces lors de votre premiere connexion </h4>
        <h5>{piece}</h5>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nom d´utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nom d´utilisateur"
              onChange={(e) => {
                setUsername2(e.target.value);
              }}
            />

            <Form.Text className="text-muted">use a valid username</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={getConnected}>
            Submit
          </Button>
        </Form>
        <h3>{status}</h3>
      </div>
    </div>
  );
}

export default Connexion;
