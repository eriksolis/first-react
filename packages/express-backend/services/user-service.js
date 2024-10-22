import mongoose from "mongoose";
import userModel from "../models/user.js";

mongoose.set("debug", true);


function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function getUsers(name, job) {
  let promise;
  if (name && job) {
    promise = userModel.find({ name: name, job: job }); 
  } else if (name) {
    promise = userModel.find({ name: name }); 
  } else if (job) {
    promise = userModel.find({ job: job }); 
  } else {
    promise = userModel.find();
  }
  return promise;
} 

function deleteUser(id) {
  return userModel.findByIdAndDelete(id); // Mongoose method to delete by ID
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
};
