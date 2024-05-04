import express from "express";
import * as dotenv from "dotenv";

import db from "./db";
import { reconcile } from "./reconciler";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const contacts = await db.show();
  res.status(200).json(contacts);
});

app.post("/identify", async (req, res) => {
  console.log("INPUTS", req.body.phoneNumber, req.body.email);
  const grpId = await reconcile(req.body.phoneNumber, req.body.email);
  res.status(200).json(grpId);
});

app.listen(port, async () => {
  db.connect();
  console.log(`Server listening on port ${port}`);
});
