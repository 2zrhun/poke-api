import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Connexion from "./connexion";
import Axios from "axios";

export default function Pokedex2(props) {
  const [roundPoke, setRoundpoke] = useState([]);
  const [piece, setPiece] = useState(4);
  const [Img, setImg] = useState("");
  const [Type, setType] = useState("");
  const [Hp, setHp] = useState("");
  const [Attack, setAttack] = useState("");
  const [order, setorder] = useState("");
  const [defense, setDefense] = useState("");
  const [name, setName] = useState("");
  const [Id, setId] = useState("");
  const [chosedPoke, setChosedPoke] = useState([]);
  const [add, setAdd] = useState("");
  const navigate = useNavigate();
  const Mytoken = localStorage.getItem("Saved_Token");

  /* let url = "https://pokeapi.co/api/v2/pokemon/";
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.results);
        setRoundpoke(data.results);
      })
      .catch((err) => console.error(err));
  }, [url]);*/

  const getPokemon = (event) => {
    ChangePiece();

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
          setRoundpoke((current) => [...current, data]);
          let i = 0;
          roundPoke.new_types = [];
          let new_id = [];

          let res = 0;

          console.log("HP ", data.stats[0].base_stat);
          console.log("Attack ", data.stats[1].base_stat);

          setHp(data.stats[0].base_stat);
          setAttack(data.stats[1].base_stat);
          setorder(data.order);
          setName(data.name);
          setId(data.id);
          setDefense(data.stats[2].base_stat);
          for (i === 0; i < data.types.length; i++) {
            res = data.types[i].type.name;

            roundPoke.new_types.push(data.types[i].type.name);

            setType(data.types[i].type.name);
          }

          new_id.push(data.id);
          setImg(data.sprites.front_default);
          //console.log("ooo", roundPoke);
        })
        .catch((err) => console.error(err));

      const savedPokemons = JSON.stringify(roundPoke);
      localStorage.setItem("savedPoke", ...savedPokemons);
    } else {
      alert(
        "Votre equipe est maintenant formee, vous n' avez plus de piece pour acheter un autre pokemon !"
      );
    }
  };

  async function ChangePiece() {
    const response3 = await fetch(
      `http://localhost:5000/updatepiece/${localStorage.getItem(
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
  }
  const Test = async (id) => {
    var elt = this;
    //console.log("test", Type);
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
          new_id: Id,
          name: name,
          new_types: Type,
          new_image: Img,
          hp: Hp,
          attack: Attack,
          order: order,
          defense: defense,
        }),
      }
    ).catch((error) => {
      window.alert(error);
      return;
    });
    alert("ajouter le prochain pokemon");
  };
  function tt() {
    let tmp = [...roundPoke];
    tmp.push(roundPoke);
    setChosedPoke(tmp);
  }
  const gt = () => {
    tt();
  };
  if (Mytoken == null) {
    //alert("Veuillez vous connecter ! ");
    navigate("/connexion");
  } else {
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
                  {roundPoke.map((ad, index) => (
                    <tr key={"index-" + index}>
                      <br></br>
                      Attack:<b>{ad.stats[1].base_stat}</b>
                      Hp: <b>{ad.stats[0].base_stat}</b>
                      Order: <b>{ad.order}</b>
                      Defense: <b>{ad.stats[2].base_stat}</b>
                      <br></br>
                      ID: <td>{ad.id}</td>
                      NAME<td>{ad.name}</td>
                      type:<td>{ad.types[0].type.name}</td>
                      <td>
                        <img src={ad.sprites.front_default} />
                      </td>
                      <button id={ad.id} onClick={() => Test(ad.id)}>
                        Add To pokedex
                      </button>
                    </tr>
                  ))}
                </div>
              </div>
            </div>
          </li>
        </ul>
        {console.log("the adversaire", roundPoke)}
      </div>
    );
  }
}
/**<div className="row">
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
                  Attack:<b>{Attack}</b>
                  Hp: <b>{Hp}</b>
                  Order: <b>{order}</b>
                  Defense: <b>{defense}</b>
                  <br></br>
                  <p>{roundPoke.tableauAdded}</p>
                  <button id={roundPoke.id} onClick={() => Test(roundPoke.id)}>
                    Add To pokedex
                  </button>
                </div>
              </div>
            </div> */
/**<div>
              {roundPoke.map((ad, index) => (
                <tr key={"index-" + index}>
                  <br></br>
                  Type: <b>{Type}</b>
                  Attack:<b>{Attack}</b>
                  Hp: <b>{Hp}</b>
                  Order: <b>{order}</b>
                  Defense: <b>{defense}</b>
                  <br></br>
                  ID: <td>{ad.id}</td>
                  NAME<td>{ad.name}</td>
                  type:<td>{ad.Type}</td>
                  <td>
                    IMAGE: <img src={ad.new_image} />
                  </td>
                </tr>
              ))}
            </div> */
