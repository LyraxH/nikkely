import express from 'express';
import sqlite3Pkg from 'sqlite3';
import cors from 'cors';

const sqlite3 = sqlite3Pkg.verbose();
const app = express();
const db = new sqlite3.Database('nikkedb.db');

app.use(express.json());
app.use(cors());

app.get('/nikkes', (req, res) => {
    db.all('SELECT * FROM nikkes', [], (err, rows) => {
        if (err) { res.status(500).json({ error: err.message }); return; }
        res.json(rows);
    });
});

app.post('/nikkes', (req, res) => {
    const { rarity, name, manufacturer, element, weapon, role, squad, burst } = req.body;
    const sql = 'INSERT INTO nikkes (rarity, name, manufacturer, element, weapon, role, squad, burst) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [rarity, name, manufacturer, element, weapon, role, squad, burst], function(err) {
        if (err) {
            console.error("DATABASE ERROR:", err.message);
            res.status(500).json({ error: err.message }); 
            return;
        }
        res.json({ message: 'Nikke added successfully', id: this.lastID });
    });
});

app.delete('/nikkes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM nikkes WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: "Nikke not found in database" });
        } else {
            res.json({ message: "Deleted successfully" });
        }
    });
});

app.get('/skills', (req, res) => {
    db.all('SELECT * FROM skills', [], (err, rows) => {
        if (err) { res.status(500).json({ error: err.message }); return; }
        res.json(rows);
    });
});

app.post('/skills', (req, res) => {
    const {nikke_id, skill_name, type, cooldown, description } = req.body;
    const sql = 'INSERT INTO skills (nikke_id, skill_name, type, cooldown, description) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [nikke_id, skill_name, type, cooldown, description], function(err) {
        if (err) {
            console.error("DATABASE ERROR:", err.message);
            res.status(500).json({ error: err.message }); 
            return;
        }
        res.json({ message: 'Skill added successfully', id: this.lastID });
    });
})

app.delete('/skills/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM skills WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: "Skill not found in database" });
        } else {
            res.json({ message: "Deleted successfully" });
        }
    });
});

app.get('/nikke-by-name/:name', (req, res) => {
    const { name } = req.params;
    db.get('SELECT nikke_id FROM nikkes WHERE name = ?', [name], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: "Nikke not found" });
            return;
        }
        res.json(row);
    });
});

app.listen(3000, () => {
    console.log('Backend running at http://localhost:3000');
});