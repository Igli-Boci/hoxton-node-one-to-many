import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = new Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(express.json());
app.use(cors());
const port = 3010;

const getAllMuseums = db.prepare(`SELECT * FROM museums`);
const getMuseumId = db.prepare(`SELECT * FROM museums WHERE id = ?`);

const getAllWorks = db.prepare(`SELECT * FROM works`);
const getWorkId = db.prepare(`SELECT * FROM works WHERE id = ?`);
const getAllWorksOfMuseum = db.prepare(
  `SELECT * FROM works WHERE museumId = ?`
);

app.get("/", (req, res) => {
  res.send("<h1>Welcome To The Collection</h1>");
});

app.get("/museums", (req, res) => {
  const museums = getAllMuseums.all();

  for (let museum of museums) {
    const works = getAllWorksOfMuseum.all(museum.id);
    museum.works = works;
  }
  res.send(museums);
});

app.get("/museums/:id", (req, res) => {
  const { id } = req.params;
  const museum = getMuseumId.get(id);

  if (museum) {
    const works = getAllWorksOfMuseum.all(museum.id);
    museum.works = works;
    res.send(museum);
  } else {
    res.status(404).send({ error: "This Museum Does Not Exist" });
  }
});

app.get("/works", (req, res) => {
  const works = getAllWorks.all();

  for (let work of works) {
    const museum = getMuseumId.get(work.museumId);
    work.museum = museum;
  }
  res.send(works);
});

app.get("/works/:id", (req, res) => {
  const { id } = req.params;
  const work = getWorkId.get(id);

  if (work) {
    const museum = getMuseumId.get(work.museumId);
    work.museum = museum;
    res.send(work);
  } else {
    res.status(404).send({ error: "No ArtWork Found" });
  }
});

const createNewMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (@name, @city);
`);

app.post("/museums", (req, res) => {
  const data = createNewMuseum.run(req.body);
  const newMuseum = getMuseumId.get(data.lastInsertRowid);

  const works = getAllWorksOfMuseum.all(newMuseum.id);
  newMuseum.works = works;
  res.send(newMuseum);
});

const createNewWork = db.prepare(`
INSERT INTO works (name, picture, museumId) VALUES (@name, @picture, @museumId);
`);

app.post("/works", (req, res) => {
  const newWork = createNewWork.run(req.body);
  res.send(newWork);
});

app.listen(port, () => {
  console.log(`Site online at http://localhost:${port}`);
});
