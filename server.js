const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = { password: hashedPassword, name: req.body.name };
    users.push(user);
    res.status(201).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/users/login", async (req, res) => {
  const user = await users.find(user => user.name === req.body.name);
  if (user === null) {
    return res.status(400).send("Cannot find User");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
