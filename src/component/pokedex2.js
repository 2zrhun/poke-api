import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Connexion from "./connexion";
import Axios from "axios";

export default function Pokedex2(props) {
  const [roundPoke, setRoundpoke] = useState([]);
  const [piece, setPiece] = useState(4);
  const [Img, setImg] = useState("");
  const [Type, setType] = useState("");
  const [chosedPoke, setChosedPoke] = useState("");
  const navigate = useNavigate();

  let url = "https://pokeapi.co/api/v2/pokemon/";
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.results);
        setRoundpoke(data.results);
      })
      .catch((err) => console.error(err));
  }, [url]);

  const getPokemon = (event) => {
    let nb_piece_btn = parseInt(event.currentTarget.id);
    let calcul_piece = piece - nb_piece_btn;
    setPiece(calcul_piece);
    let min = Math.ceil(1);
    let max = Math.floor(1153);
    let random_pokeid = [Math.floor(Math.random() * (max - min) + min)];
    //do {
    if (calcul_piece >= 0) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${random_pokeid}/`)
        .then((resultat) => resultat.json())
        .then((data) => {
          setRoundpoke(data);
          let i = 0;
          roundPoke.new_types = [];
          let new_id = [];

          let res = 0;

          console.log(data.stats[0].base_stat);
          for (i === 0; i < data.types.length; i++) {
            res = data.types[i].type.name;

            roundPoke.new_types.push(data.types[i].type.name);

            setType(data.types[i].type.name);
          }
          new_id.push(data.id);
          setImg(data.sprites.front_default);
        })
        .catch((err) => console.error(err));
      let results = [];
      setChosedPoke(roundPoke);
      const savedPokemons = JSON.stringify(roundPoke);
      localStorage.setItem("savedPoke", ...savedPokemons);
    } else {
      alert(
        "Votre equipe est maintenant formee, vous n' avez plus de piece pour acheter un autre pokemon !"
      );
    }
  };
  const Test = async (id) => {
    var elt = this;
    console.log("test", Type);
    await fetch(
      `http://localhost:5000/record/add/${localStorage.getItem(
        "Saved_UserId"
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //new_id: [roundPoke[id - 1].id],
          userId: localStorage.getItem("Saved_UserId"),
          new_id: roundPoke.id,
          name: roundPoke.name,
          new_types: Type,
          new_image: Img,
        }),
      }
    ).catch((error) => {
      window.alert(error);
      return;
    });
    alert("ajouter le prochain pokemon");
  };

  return (
    <div>
      <h2>Achetez un pokemon </h2>
      <button id={1} onClick={getPokemon}>
        Debloque un pokemon avec des pieces
      </button>
      <h5>{piece}</h5>
      <h5>{console.log("username", Connexion.props)}</h5>

      <ul>
        <li>
          <div className="row">
            <div className="column">
              <div className="card">
                id#<b> {roundPoke.id}</b>
                <img src={Img} alt="d" />
                <img className="back" src="../image/download.png" />
                <br></br>
                {"name:"}
                <b>{roundPoke.name}</b>
                <br></br>
                Type: <b>{Type}</b>
                <br></br>
                <p>{roundPoke.tableauAdded}</p>
                {console.log(roundPoke)}
                <button id={roundPoke.id} onClick={() => Test(roundPoke.id)}>
                  Add To pokedex
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
