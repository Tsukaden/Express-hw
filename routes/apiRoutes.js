const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile } = require('../helpers/fsUtils');

// GET Route for retrieving notes
router.get('/notes', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => res.status(500).json({ error: 'Failed to read the database file.' }));
});

// POST Route for creating a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Note title and text are required.' });
  }

  const newNote = {
    id: uuidv4(),
    title,
    text,
  };

  readFromFile('./db/db.json')
    .then((data) => {
      const notes = JSON.parse(data);
      notes.push(newNote);
      writeToFile('./db/db.json', notes)
        .then(() => res.json(newNote))
        .catch((err) => res.status(500).json({ error: 'Failed to save the note to the database.' }));
    })
    .catch((err) => res.status(500).json({ error: 'Failed to read the database file.' }));
});

module.exports = router;