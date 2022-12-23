import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Pokedex from "./component/pokedex";

import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemon2, setPokemon2] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
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

  /*useEffect(() => {
    for (i === 0; i <= 22; i++) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
        .then((res) => res.json())
        .then((data) => {
          setImage(data.sprites.front_default);
          console.log(data);
          console.log("affichage ", data.id);
          console.log("Affichage type ", data.types[0].type.name);
          setTypes(data.types[0].type.name);

          setId(data.id);
          setPokemon2(data);
        })
        .then(setTypes())
        .catch((err) => console.error(err));
    }
  }, [i]);*/

  useEffect(() => {
    pokemon.map((poke, index) =>
      fetch(poke.url)
        .then((res) => res.json())
        .then((data) => {
          //setImage((current) => [...current, data.sprites.front_default]);
          console.log(data);
          //setId(data.id);

          console.log("affichage ID ", data.id);
          //console.log("voir url", poke.url);
          //setId(pokemon.push(data.id));
          let i = 0;
          //let tab = pokemon.push(data.id);
          //console.log(" tableau pokemon", pokemon);

          setPokemon2(data);
          let test = 0;
          //pokemon.map((pokemon1, i) => (
          /*data.types.map(
            (e, ind) => (
              console.log("test", e, ind),
              //test = ;
              setTypes(e.type.name)
            )
          );*/

          let res = "";
          poke.new_types = [];
          poke.new_id = [];
          poke.new_image = [];
          for (i === 0; i < data.types.length; i++) {
            res = data.types[i].type.name;
            console.log("Affichage type ", data.types[i].type.name);
            poke.new_types.push(data.types[i].type.name);
            //pokemon.push(data.types[i].type.name);
            //setTypes(res);
          }
          poke.new_id.push(data.id);
          poke.new_image.push(data.sprites.front_default);
          //setId(data.id);
        })
        .then(setImage([]))

        .catch((err) => console.error(err))
    );
  }, [pokemon]);
  /*function Ajouter() {
    if (inputTodo.trim().length == 0) {
      return null;
    }
    let tableauAdded = [...todos];
    let id = Date.now();
    tableauAdded.push(inputTodo.trim());
    setTodos(tableauAdded);
    setInputTodo("");
    console.log("tableau todos: ", tableauAdded);
    const newItems = JSON.stringify([...tableauAdded]);
    localStorage.setItem("myItems", newItems);
    //console.log("set todos:", setTodos);

    //return tableautest;
  }*/
  /*function Add() {
    console.log("selected", TableauAjouterPoke);
    const handleClick = event => {
      console.log(event.currentTarget.id);
    }*/
  /*if (inputTodo.trim().length == 0) {
    return null;
  }
  let tableauAdded = [...todos];
  let id = Date.now();
  tableauAdded.push(inputTodo.trim());
  setTodos(tableauAdded);
  setInputTodo("");
  console.log("tableau todos: ", tableauAdded);
  const newItems = JSON.stringify([...tableauAdded]);
  localStorage.setItem("myItems", newItems);
  //console.log("set todos:", setTodos);*/

  //return tableautest;

  //let TableauAjouterPoke = [];
  const handleClick = (event) => {
    //event.currentTarget.

    if (event.currentTarget.value == true) {
      let TableauAjouterPoke = [...selectedPokemon];
      TableauAjouterPoke.push(event.currentTarget);
      console.log("ONCLICK ggg", TableauAjouterPoke);
    }
  };
  /*const Test = (id) => {
    console.log("voici le test de l id", id - 1);
  };*/

  // This function will handle the submission.
  const Test = async (id) => {
    // async function onSubmit(e) {
    //e.preventDefault();
    var elt = this;

    // id de l'element

    //var idElt = this.getAttribute("id");

    // When a post request is sent to the create url, we'll add a new record to the database.

    //console.log("valeur", e.currentTarget.id);
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
      //JSON.stringify(newPerson),
    }).catch((error) => {
      window.alert(error);
      return;
    });

    //setForm({ name: "", position: "", level: "" });
    navigate("/");
  };

  //pokemon.url
  //console.log(pokemon);
  return (
    // FAIRE UN .MAP DANS UN .MAP AUR POKEMON.URL
    <div className="container">
      <h2>Chose you pokemons ;)</h2>
      <ul>
        {pokemon.map(
          (pokemon1, i) => (
            <li key={i}>
              {" "}
              <div className="row">
                <div className="column">
                  <div className="card">
                    id#<b> {pokemon1.new_id}</b>
                    <img src={pokemon1.new_image} alt="dracafeu" />
                    <img className="back" src="../image/download.png" />
                    <br></br>
                    {"name:"}
                    <b>{pokemon1.name}</b>
                    <br></br>
                    Type: <b>{JSON.stringify(pokemon1.new_types)}</b>
                    <br></br>
                  </div>
                  <button
                    id={pokemon1.new_id}
                    onClick={() => Test(pokemon1.new_id)}
                  >
                    Add To pokedex
                  </button>
                </div>
              </div>
            </li>
          )
          //))
        )}

        {console.log("test !", pokemon2.id)}
      </ul>

      {url.previous && <button onClick={previous}> Previous</button>}
      {url.next && <button onClick={next}>next</button>}
      <br />
    </div>
  );
  //} catch (error) {
  //  console.log(error);
  //}
}
export default App;
