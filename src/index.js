const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

let agenda = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", function (req, res) {
  const body = req.body;
  return JSON.stringify(body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Home page</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(agenda);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = agenda.find((person) => {
    return person.id == id;
  });
  if (!person) {
    return res.status(404).end();
  }
  res.json(person);
});

app.get("/info", (req, res) => {
  const date = new Date(Date.now());

  res.send(`
        <h3>Phonebook has info for ${agenda.length} people</h3>
        <h3>${date.toDateString()} ${date.toTimeString()}</h3>`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  agenda = agenda.filter((person) => {
    return person.id != id;
  });

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  let person = req.body;

  const aux = agenda.find((elem) => {
    return elem.name == person.name;
  });

  if (!person.name) {
    res.status(400).json({
      error: "missing name",
    });
  } else if (!person.number) {
    res.status(400).json({
      error: "missing number",
    });
  } else if (aux) {
    res.status(400).json({
      error: "already in phonebook",
    });
  }

  person = { id: Math.floor(Math.random() * 1000), ...person };
  agenda.push(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
