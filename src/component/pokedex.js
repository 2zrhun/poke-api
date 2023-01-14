import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Axios from "axios";

const Record = (props) => (
  <tr>
    <td>{props.record.new_id}</td>
    <td>{props.record.name}</td>
    <td>{props.record.new_types}</td>
    <td>
      <img src={props.record.new_image}></img>
      {}
    </td>
    <td>
      <button
        className="btn btn-link"
        onClick={() => {
          props.deleteRecord(props.new_id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);
export default function Pokedex() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [adversaire, setAdversaire] = useState("");
  const [AdversPokes, setAdversPokes] = useState([]);
  const [winner, setWinner] = useState("");
  const [loser, setLoser] = useState("");
  const [gain, setGain] = useState("");
  const navigate = useNavigate();
  const Mytoken = localStorage.getItem("Saved_Token");
  const usId = localStorage.getItem("Saved_UserId");

  // This method fetches the records from the database.
  useEffect(() => {
    if (Mytoken == null && usId == null) {
      //alert("Veuillez vous connecter ! ");
      navigate("/connexion");
    } else {
      async function getRecords() {
        const response = await fetch(
          `http://localhost:5000/record/${localStorage.getItem("Saved_UserId")}`
        );

        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const records = await response.json();
        setRecords(records);
      }
      getRecords();
    }

    return;
  }, [records.length]);
  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5000/record/${id}`, {
      method: "DELETE",
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  async function Fight() {
    ChangeBollStatus();

    Axios.get(
      `http://localhost:5000/getFight/${localStorage.getItem("Saved_UserId")}`
    ).then((response) => {
      if (response.data.message) {
        alert(response.data.message);
        setAdversaire(response.data.adversaire);
        setAdversPokes(response.data.allEnPokes);
        setWinner(response.data.Winner);
        setLoser(response.data.loser);
        setGain(response.data.piece);
      }
    });
  }
  async function ChangeBollStatus() {
    const response3 = await fetch(
      `http://localhost:5000/update/${localStorage.getItem("Saved_UserId")}`,
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
  if (Mytoken == null && usId == null) {
    //alert("Veuillez vous connecter ! ");
    navigate("/connexion");
  } else {
    function recordList() {
      return records.map((record, index) => {
        return (
          <Record
            record={record}
            deleteRecord={() => deleteRecord(record._id)}
            key={index}
          />
        );
      });
    }

    //This following section will display the table with the records of individuals.

    return (
      <div>
        <h3>Record List - My pokedex</h3>
        <h3>TON Adversaire {adversaire}</h3>
        <h3>
          THE WINNER IS {winner} et Vous avez gagne +1 Voici VOTRE GAIN MTN{" "}
          {gain}
        </h3>
        <input
          type="text"
          placeholder="rechercher avec NOM."
          className="form-control"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button>Search</button>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <tr key={records._id}>
            {recordList()
              .filter((val, i) => {
                //console.log("test", val.props);
                if (search === "") {
                  return val;
                } else if (
                  val.props.record.name[0]
                    .toLowerCase()
                    .includes(search.toLowerCase())
                  //val.new_types.toLowerCase().includes(search.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((note, indice) => (
                <tr key={"notes-" + indice}>
                  <td>{note.props.record.new_id}</td>
                  <td>{note.props.record.name}</td>
                  <td>{note.props.record.new_types}</td>
                  <td>
                    <img src={note.props.record.new_image} />
                  </td>
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      note.props.deleteRecord(note.props.record._id);
                      //console.log("tess222", note.props.record._id);
                    }}
                  >
                    Delete
                  </button>
                </tr>
              ))}
          </tr>
          <button onClick={Fight}>Fight</button>
        </table>
        <div>
          {AdversPokes.map((ad, index) => (
            <tr key={"index-" + index}>
              <td>{ad.new_id}</td>
              <td>{ad.name}</td>
              <td>{ad.new_types}</td>
              <td>
                <img src={ad.new_image} />
              </td>
            </tr>
          ))}
          {console.log("the adversaire", AdversPokes)}
        </div>
      </div>
    );
  }
}
