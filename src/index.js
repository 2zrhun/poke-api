import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Header from "./component/Header";
import Pokedex from "./component/pokedex";
import Connexion from "./component/connexion";
import Pokedex2 from "./component/pokedex2";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Connexion />} />
          <Route
            path={`record/${localStorage.getItem("Saved_UserId")}`}
            element={<Pokedex />}
          />
          <Route path="/pokemons" element={<App />} />
          <Route path="/connexion" element={<Connexion />} />

          <Route
            path={`pokedex2/${localStorage.getItem("Saved_UserId")}`}
            element={<Pokedex2 />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
