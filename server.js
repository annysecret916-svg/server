const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ตัวอย่างการตอบกลับตาม Endpoint ที่เกมเรียกใช้งาน
app.post('/live/player/authen', (req, res) => {
    res.json({
        status: "success",
        code: 0,
        data: { token: "mock_token_12345" }
    });
});

app.post('/live/player/gameplay/checkversion', (req, res) => {
    res.json({
        status: "success",
        code: 0,
        data: { latestVersion: true }
    });
});

// ค่าเผื่อสำหรับ Endpoint อื่นๆ ที่เกมอาจจะเรียก
app.all('*', (req, res) => {
    res.json({
        status: "success",
        code: 0,
        message: "OK",
        data: {}
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
