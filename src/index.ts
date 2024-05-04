import express from "express";
import * as dotenv from "dotenv";

import db from "./db";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Identity Reconciliation Server");
});

app.post("/identify", (req, res) => {
  res.send(req.body);
});

app.listen(port, async () => {
  db.connect();
  console.log(`Server listening on port ${port}`);
});
