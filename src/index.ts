import express from "express";
import * as dotenv from "dotenv";

import db from "./db";
import { reconcile } from "./reconciler";
import { ContactGroup, ContactIdentity } from "./interfaces";

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

  const grpId: number = await reconcile(input);
  if (grpId != -1) {
    const grp: ContactGroup = await db.getGroup(grpId);
    res.status(200).json(grp);
  } else {
    res.status(400).json({
      error: "Empty Credentials provided",
    });
  }
});

app.listen(port, async () => {
  db.connect();
  console.log(`Server listening on port ${port}`);
});
