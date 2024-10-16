// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id){
        const promise = fetch(`http://localhost:8000/users/${id}`, {
                method: "DELETE",
        });

        promise
        .then((res) => {
                if (res.status == 204){
                        const updated = characters.filter((character) => character.id != id);
                setCharacters(updated);
                } else if (res.status == 404) {
                        console.error("User not found.");
                }
        })
        .catch((error) => {
                console.error("Failed to delete user:", error);
                });
        } 

  /*function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }*/

  function updateList(person) {
        postUser(person)
        .then((res) => {
                if (res.status != 201){
                        throw new Error("Object not created")
                }
                return res.json()}).then((person) => setCharacters([...characters, person]))
          .catch((error) => {
            console.log(error);
          });
      }

  function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(person)
        });
      
        return promise;
      }

  function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
      }

      useEffect(() => {
        fetchUsers()
          .then((res) => res.json())
          .then((json) => setCharacters(json["users_list"]))
          .catch((error) => {
            console.log(error);
          });
      }, []);

      
  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList}/>
  </div>
);
}

export default MyApp;