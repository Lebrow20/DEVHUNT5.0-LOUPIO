import { Sequelize } from "sequelize";

const db = new Sequelize("devhunt5_0", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

db.authenticate()
    .then(() => console.log("Connexion à la base de données réussie"))
    .catch((error) => console.log("Il y a une erreur lors de la connexion à la base de données: ", error));

export default db;