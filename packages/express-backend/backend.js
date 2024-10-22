// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from './services/user-service.js';

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();  
const port = 8000;
/*const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }  
  ]
};*/

function randomId(){
  return Math.floor(Math.random() * 1000000).toString();
}

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService.getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => res.status(500).send(error));
});

const findUserById = (id) => 
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const removeUser = (user) => {
  const indexOfUser = users["users_list"].indexOf(user);
  users["users_list"].splice(indexOfUser, 1);
};


app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  userService.findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => res.status(500).send(error));
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService.getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => res.status(500).send(error));
});


app.post("/users", (req, res) => {
  const user = req.body;
  userService.addUser(user)
    .then((result) => res.status(201).send(result))
    .catch((error) => res.status(500).send(error));
});


app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  console.log('ID to delete:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid ObjectId format:', id);
    return res.status(400).send('Invalid ID format');
  }
  
  userService.findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      } else {
        userService.deleteUser(id)
          .then(() => res.sendStatus(204))
          .catch((error) => res.status(500).send(error));
      }
    })
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});