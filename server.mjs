'use strict';

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { createUser } from "./user.mjs";

// Launch app

const app = express();
const PORT = process.env.PORT;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});

// POST method to create a test user
app.post("/create", (req, res) => {
    const user = createUser(req);
    res.send(user);
})