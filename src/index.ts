import express from "express";
import * as dotenv from "dotenv";

import db from "./db";
import { reconcile } from "./reconciler";
import { ContactIdentity } from "./interfaces";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const contacts = await db.show();
  res.status(200).json(contacts);
});

app.post("/identify", async (req, res) => {
  const input: ContactIdentity = req.body;
  if (!input.email && !input.phoneNumber) {
    res.status(400).json({
      error: "Empty Credentials provided",
    });
  } else {
    const grpId: Number = await reconcile(input);
    res.status(200).json(grpId);
  }
});

app.listen(port, async () => {
  db.connect();
  console.log(`Server listening on port ${port}`);
});
