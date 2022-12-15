import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemon2, setPokemon2] = useState([]);
  const [url, setUrl] = useState({
    current: "https://pokeapi.co/api/v2/pokemon/",
    next: null,
    previous: null,
  });
  const [Image, setImage] = useState([]);
  const [Types, setTypes] = useState("");
  const [id, setId] = useState();

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
    pokemon.map((poke, i) =>
      fetch(poke.url)
        .then((res) => res.json())
        .then((data) => {
          setImage((current) => [...current, data.sprites.front_default]);
          console.log(data);
          // let idi = 0;
          console.log("affichage ", data.id);
          //setId(pokemon.push(data.id));
          let i = 0;
          //let tab = pokemon.push(data.id);
          //console.log(" tableau", tab);
          //setId(data.id);

          setPokemon2(data);
          for (i === 0; i < 20; i++) {
            console.log("Affichage type ", data.types[i].type.name);
          }
          setTypes(data.types[i].type.name);
        })
        .then(setImage([]))

        .catch((err) => console.error(err))
    );
  }, [pokemon]);
  //pokemon.url
  //console.log(pokemon);
  return (
    // FAIRE UN .MAP DANS UN .MAO AUR POKEMON.URL
    <div>
      <h2>HEADER</h2>
      <ul>
        {pokemon.map(
          (pokemon1, i) => (
            //pokemon2.map((poke2, index) => (
            <li key={i}>
              {" "}
              <br></br>
              {id}
              <br></br>
              {pokemon1.name} <br></br>
              {pokemon1.url}
              <br></br>
              <img src={Image[i]} alt="dracafeu" />
              <hr></hr>
            </li>
          )
          //))
          //pokemon.map((e) => console.log(e))
        )}
        <h3>TEST FOR EVERY POKE</h3>

        {console.log("test", pokemon2)}
        {pokemon2.map(
          (poke2, index) => (
            // pokemon2.map((poke2, index) => (
            <li key={index}>
              {" "}
              <br></br>
              {poke2.id}
              {console.log("test2", poke2.id)}
              <br></br>
              {""} <br></br>
              <br></br>
              <hr></hr>
            </li>
          )
          //))
          //pokemon.map((e) => console.log(e))
        )}
      </ul>

      {url.previous && <button onClick={previous}> Previous</button>}
      {url.next && <button onClick={next}>next</button>}
      <br />
      <img src={Image} alt="dracafeu" />
    </div>
  );
  //} catch (error) {
  //  console.log(error);
  //}
}
export default App;
