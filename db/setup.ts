import Database from "better-sqlite3";

const museums = [
  {
    name: "Vatican Museums",
    city: "Vatican City",
  },
  {
    name: "J. Paul Getty Center",
    city: "Los Angeles",
  },
  {
    name: "Tate Modern",
    city: "London",
  },
  {
    name: "National Gallery of Art",
    city: "Washington",
  },
  {
    name: "Uffizi Gallery",
    city: "Florence",
  },
];

const works = [
  {
    name: "Apollo Belvedere",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Apollo_del_Belvedere.jpg/270px-Apollo_del_Belvedere.jpg",
    museumId: 1,
  },
  {
    name: "Laocoön and His Sons",
    picture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGgOFHAg-04YetNYdABtVsUwdmKPZMlFzxqj5uPseWhw&s",
    museumId: 1,
  },
  {
    name: "Mummy of Herakleides",
    picture:
      "http://lh3.googleusercontent.com/0o5k-sMe2WWWoBNMR5CHacQaPbbBL3Anr7Qes6_CfpRBH3XWY0ahdST6bmuXwUA3cQ=w172-h300-n-l64",
    museumId: 2,
  },
  {
    name: "Victorious Youth",
    picture:
      "data:image/jpeg;base64,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",
    museumId: 2,
  },
  {
    name: "No Woman No Cry",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Mural_del_Gernika.jpg",
    museumId: 3,
  },
  {
    name: "I Love the Whole World",
    picture:
      "https://render.fineartamerica.com/images/rendered/default/canvas-print/8/6.5/mirror/break/images/artworkimages/medium/2/guitar-and-newspaper-1925-juan-gris-canvas-print.jpg",
    museumId: 3,
  },
  {
    name: "Venus with a Mirror",
    picture:
      "http://lh3.googleusercontent.com/ZweLqOV6z8inuovW8jiqyXTq-5ZoUaw68itK3y0NhRJRPexPBGB9PGp9P_feJplQHQ=w250-h300-n-l64",
    museumId: 4,
  },
  {
    name: "The Emperor Napoleon in His Study at the Tuileries",
    picture:
      "http://lh3.googleusercontent.com/CXl22sc__oOZ0-i02wt755Km1FN8znrE2QogqW22beJVHvpkSI3PY4FRGXqX7wacZcI=w180-h300-n-l64",
    museumId: 4,
  },
  {
    name: "Medusa",
    picture:
      "http://lh3.googleusercontent.com/J_YhPEPwfwcn1WkjfXiiW12dqsk4iLB-r6UeWhgFatGvniLIRyHY3XYN-q5v2f35ow=w293-h300-n-l64",
    museumId: 5,
  },
  {
    name: "Venus of Urbino",
    picture:
      "http://lh3.googleusercontent.com/H5Dm3a10FRn1pkSxacheS1wcDFgMcMlknWkAp7ilqO9i6qSBnt0zxSZ4wHPykJGUtw=w454-h300-n-l64",
    museumId: 5,
  },
];

const db = Database("./db/data.db", { verbose: console.log });

const createMuseumsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
    id INTEGER,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    PRIMARY KEY(id)
);
`);

createMuseumsTable.run();

const ceateMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?)
`);

for (let museum of museums) ceateMuseum.run(museum.name, museum.city);

const createWorksTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS works (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    picture TEXT NOT NULL,
    museumId INTEGER NOT NULL,
    FOREIGN KEY (museumId) REFERENCES museums(id)
  );
`);

createWorksTable.run();

const createWork = db.prepare(`
INSERT INTO works(name, picture, museumId) VALUES(?, ?, ?)
`);

for (let work of works) createWork.run(work.name, work.picture, work.museumId);
