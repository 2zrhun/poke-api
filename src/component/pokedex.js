import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/record/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();

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

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3>Record List - My pokedex</h3>
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
                <td>{note.props.record.new_id[0]}</td>
                <td>{note.props.record.name[0]}</td>
                <td>{note.props.record.new_types[indice]}</td>
                <td>
                  <img src={note.props.record.new_image[0]} />
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
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>types</th>
            <th>images</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
