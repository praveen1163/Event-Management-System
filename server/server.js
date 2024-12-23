const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// SQLite Database setup
const db = new sqlite3.Database('../event_management.db', (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create events table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL
  )
`);

// Routes
// Get root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API routes for CRUD operations
app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to fetch events.');
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/events', (req, res) => {
  const { name, date, location } = req.body;
  const query = 'INSERT INTO events (name, date, location) VALUES (?, ?, ?)';
  db.run(query, [name, date, location], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to add event.');
    } else {
      res.status(201).send({ message: 'Event added successfully!', id: this.lastID });
    }
  });
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, date, location } = req.body;
  const query = 'UPDATE events SET name = ?, date = ?, location = ? WHERE id = ?';
  db.run(query, [name, date, location, id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to update event.');
    } else if (this.changes === 0) {
      res.status(404).send('Event not found.');
    } else {
      res.status(200).send('Event updated successfully!');
    }
  });
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM events WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to delete event.');
    } else if (this.changes === 0) {
      res.status(404).send('Event not found.');
    } else {
      res.status(200).send('Event deleted successfully!');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
