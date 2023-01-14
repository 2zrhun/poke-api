import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemon2, setPokemon2] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [random_pokeid, setrandom_pokeid] = useState();
  const [url, setUrl] = useState({
    current: "https://pokeapi.co/api/v2/pokemon/",
    next: null,
    previous: null,
  });
  const [Image, setImage] = useState([]);
  const [Types, setTypes] = useState();
  const [id, setId] = useState();
  const navigate = useNavigate();

  const next = () => {
    const newUrl = {
      current: url.next,
      previous: url.current,
      next: url.null,
    };
    setUrl(newUrl);
  };
  const previous = () => {
    const newUrl = {
      current: url.previous,
      next: url.current,
      previous: null,
    };
    setUrl(newUrl);
  };
  useEffect(() => {
    fetch(url.current)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        setPokemon(data.results);
        setUrl({
          current: url.next,
          next: data.next,
          previous: data.previous,
        });
      })
      .catch((err) => console.error(err));
  }, [url.current]);

  useEffect(() => {
    pokemon.map((poke, index) =>
      fetch(poke.url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          console.log("affichage ID ", data.id);

          let i = 0;

          setPokemon2(data);
          let test = 0;

          let res = "";
          poke.new_types = [];
          poke.new_id = [];
          poke.new_image = [];
          for (i === 0; i < data.types.length; i++) {
            res = data.types[i].type.name;
            console.log("Affichage type ", data.types[i].type.name);
            poke.new_types.push(data.types[i].type.name);
          }
          let min = Math.ceil(1);
          let max = Math.floor(5);
          //data.id = [Math.floor(Math.random() * (max - min) + min)];
          poke.new_id.push(data.id);
          poke.new_image.push(data.sprites.front_default);
        })
        .then(setImage([]))

        .catch((err) => console.error(err))
    );
  }, [pokemon]);

  const handleClick = (event) => {
    //event.currentTarget.

    if (event.currentTarget.value == true) {
      let TableauAjouterPoke = [...selectedPokemon];
      TableauAjouterPoke.push(event.currentTarget);
      console.log("ONCLICK ggg", TableauAjouterPoke);
    }
  };

  const Test = async (id) => {
    var elt = this;
    await fetch("http://localhost:5000/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_id: [pokemon[id - 1].new_id],
        name: [pokemon[id - 1].name],
        new_types: [pokemon[id - 1].new_types],
        new_image: [pokemon[id - 1].new_image],
      }),
    }).catch((error) => {
      window.alert(error);
      return;
    });

    navigate("/");
  };
  let min = Math.ceil(1);
  let max = Math.floor(5);
  //setrandom_pokeid([Math.floor(Math.random() * (max - min) + min)]);

  return (
    <div className="container">
      {url.next && (
        <button id="next" onClick={next}>
          <FaArrowAltCircleRight />
        </button>
      )}
      <br></br>
      <br></br>
      {url.previous && (
        <button id="previous" onClick={previous}>
          {" "}
          <FaArrowAltCircleLeft />
        </button>
      )}
      {/*{url.next && (
        <div onClick={next}>
          <big>
            <FaArrowAltCircleRight />
          </big>
        </div>
      )}
      {url.next && (
        <div onClick={previous}>
          <FaArrowAltCircleLeft />
        </div>
      )}*/}
      <br />
      <ul>
        {pokemon.map(
          (pokemon1, i) => (
            <li key={i}>
              {" "}
              <div className="row">
                <div className="column">
                  <div className="card">
                    nr°<b> {pokemon1.new_id}</b>
                    <img src={pokemon1.new_image} alt="dracafeu" />
                    <img className="back" src="../image/download.png" />
                    <br></br>
                    {"name:"}
                    <b>{pokemon1.name}</b>
                    <br></br>
                    <b id="type" className={pokemon1.new_types}>
                      {JSON.stringify(pokemon1.new_types)}
                    </b>
                    <br></br>
                  </div>
                </div>
              </div>
            </li>
          )
          //))
        )}

        {console.log("test !", pokemon2.id)}
      </ul>

      <br />
    </div>
  );
}
export default App;
