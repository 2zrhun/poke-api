import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Axios from "axios";
import "../App.css";

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
  const [pi, setPi] = useState(4);
  const navigate = useNavigate();
  const Mytoken = localStorage.getItem("Saved_Token");
  const usId = localStorage.getItem("Saved_UserId");

  useEffect(() => {});
  async function getPokemon(event) {
    ChangePiece();
    let nb_piece_btn = parseInt(event.currentTarget.id);
    let calcul_piece = piece - nb_piece_btn;
    setPiece(calcul_piece);
    let min = Math.ceil(1);
    let max = Math.floor(1153);
    let random_pokeid = [Math.floor(Math.random() * (max - min) + min)];
    GetPi();
    console.log("gggg", pi);
    console.log("mes kkk", pi - 1);
    if (pi > 0) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${random_pokeid}/`)
        .then((resultat) => resultat.json())
        .then((data) => {
          setRoundpoke((current) => [...current, data]);
          let i = 0;
          roundPoke.new_types = [];
          let new_id = [];

          let res = 0;

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
        })
        .catch((err) => console.error(err));

      const savedPokemons = JSON.stringify(roundPoke);
      localStorage.setItem("savedPoke", ...savedPokemons);
    } else {
      alert(
        "Votre equipe est maintenant formee, vous n' avez plus de piece pour acheter un autre pokemon !"
      );
    }

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
  }

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

  async function GetPi() {
    Axios.get(
      `http://localhost:5000/user/${localStorage.getItem("Saved_UserId")}`
    ).then((response) => {
      if (response.data.message) {
        alert(response.data.message);
        console.log("mes piece", response.data.piece);
        setPi(response.data.piece);
      }
    });
  }
  const Test = async (id) => {
    var elt = this;

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

  if (Mytoken == null && usId == null) {
    alert("Veuillez vous connecter ! ");
    navigate("/connexion");
  } else {
    return (
      <div>
        <br></br>
        <br></br>
        <button class="btn" onClick={getPokemon}>
          <big>achetez votre pokemon</big>
        </button>

        <big>
          {" "}
          <h6 id="h6">NEW PI:{pi}</h6>
        </big>

        <ul>
          <li>
            <div className="row">
              <div className="column">
                <div className="card">
                  {roundPoke.map((ad, index) => (
                    <tr key={"index-" + index}>
                      <div id="stats">
                        <br></br>
                        Attack:<b>{ad.stats[1].base_stat}</b>
                        Hp: <b>{ad.stats[0].base_stat}</b>
                        Order: <b>{ad.order}</b>
                        Defense: <b>{ad.stats[2].base_stat}</b>
                      </div>
                      <br></br>
                      NR° <b> {ad.id}</b>
                      <br></br>
                      NAME:
                      <b>{ad.name}</b>
                      <td>
                        <b>{ad.types[0].type.name}</b>
                      </td>
                      <td>
                        <img src={ad.sprites.front_default} />
                      </td>
                    </tr>
                  ))}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
