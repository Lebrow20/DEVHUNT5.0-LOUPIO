import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { pseudo: req.body.pseudo },
    });
    if (user)
      return res.send({ message: "User existe dejà.", status: 400 });

    const newPersonnel = await User.create({
      pseudo: req.body.pseudo,
      password: req.body.password,
      email: req.body.email,
    });
    res.send({ status: 200, message: "User Crée", data: newPersonnel });
  } catch (error) {
    console.log(error.message.toString());
    res.status(500).send({ message: "Erreur Lors de l'insertion" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id_user: req.params.id_user,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = {
      pseudo: req.body.pseudo,
      password: req.body.password,
      email: req.body.email,
    };
    await User.update(user, {
      where: {
        id_user: req.params.id_user,
      },
    });
    res.status(200).json({ msg: "Mise à jour effectuée" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id_user: req.params.id_user,
      },
    });
    res.status(200).json({ msg: "User supprimé ! " });
  } catch (error) {
    console.log(error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Mot de passe incorrect" });
    
 const token = jwt.sign(
      { id: user.id, email: user.email },
      "devhunt_secret_key",             
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Connexion réussie", token,  user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email
      } });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
