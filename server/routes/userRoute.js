import express from "express";
import { createUser, deleteUser, getUser, updateUser } from "../controllers/UserController.js";
import { loginUser } from "../controllers/UserController.js";

const userRoute = express.Router();

userRoute.get("/user", getUser);
userRoute.post("/user/ajouter", createUser);
userRoute.put('/user/modifier/:id_user', updateUser);
userRoute.delete('/user/supprimer/:id_user', deleteUser);
userRoute.post("/user/login", loginUser);

export default userRoute;