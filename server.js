const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ดักจับทุก Request เพื่อดูว่าเกมยิงไปที่ Path ไหนบ้าง (เช็กได้ที่ Log ของ Render)
app.use((req, res, next) => {
    console.log(`[Incoming Request] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Home Sweet Home Online Private Server is running!');
});

// ปรับโครงสร้าง JSON ตอบกลับให้เกมยอมรับผ่าน
app.all('*', (req, res) => {
    res.json({
        status: "success",
        code: 0,
        message: "OK",
        data: {
            token: "mock_token_12345",
            result: true
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
