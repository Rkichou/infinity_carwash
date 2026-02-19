const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001; // Port 5001 pour éviter les conflits

app.use(cors());
app.use(bodyParser.json());

let reservations = [];

app.get("/api/reservations", (req, res) => {
    res.json(reservations);
});

app.post("/api/reservations", (req, res) => {
    const reservation = {
        id: Date.now(),
        ...req.body,
        status: "pending"
    };
    reservations.push(reservation);
    console.log("Nouvelle réservation reçue:", reservation);
    res.status(201).json(reservation);
});

app.listen(PORT, () => {
    console.log(`Serveur Infinity Car Wash lancé sur http://localhost:${PORT}`);
});
