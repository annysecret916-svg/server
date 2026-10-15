const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// ตั้งค่าอ่านข้อมูลจาก Form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ตั้งค่า View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// เชื่อมต่อฐานข้อมูล SQLite
const db = new sqlite3.Database('./whitelist.db', (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to whitelist.db');
});

// สร้างตารางหากยังไม่มี
db.run(`
    CREATE TABLE IF NOT EXISTS Whitelist (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        DiscordId TEXT NOT NULL UNIQUE,
        GameUid TEXT
    )
`);

// 1. หน้าแสดงรายการ Whitelist ทั้งหมด
app.get('/', (req, res) => {
    const search = req.query.search || '';
    let sql = 'SELECT * FROM Whitelist ORDER BY Id DESC';
    let params = [];

    if (search) {
        sql = 'SELECT * FROM Whitelist WHERE DiscordId LIKE ? OR GameUid LIKE ? ORDER BY Id DESC';
        params = [`%${search}%`, `%${search}%`];
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).send('Database Error: ' + err.message);
        }
        res.render('index', { whitelist: rows, search: search });
    });
});

// 2. API / Action สำหรับเพิ่ม Whitelist
app.post('/add', (req, res) => {
    const { discordId, gameUid } = req.body;
    if (!discordId) {
        return res.redirect('/?error=MissingDiscordId');
    }

    const sql = 'INSERT INTO Whitelist (DiscordId, GameUid) VALUES (?, ?)';
    db.run(sql, [discordId.trim(), gameUid ? gameUid.trim() : ''], function(err) {
        if (err) {
            console.error(err.message);
            return res.redirect('/?error=DuplicateOrError');
        }
        res.redirect('/');
    });
});

// 3. API / Action สำหรับลบ Whitelist
app.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM Whitelist WHERE Id = ?';
    db.run(sql, id, function(err) {
        if (err) console.error(err.message);
        res.redirect('/');
    });
});

// เริ่มทำงานเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Whitelist Web Dashboard running on http://localhost:${PORT}`);
});
