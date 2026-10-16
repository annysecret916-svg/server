const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Home Sweet Home Online Private Server is running!');
});

app.all('/live/player/authen', (req, res) => {
    res.json({
        status: "success",
        code: 0,
        message: "OK",
        data: {
            token: "mock_token_12345",
            uid: "123456789"
        }
    });
});

app.all('/live/player/gameplay/checkversion', (req, res) => {
    res.json({
        status: "success",
        code: 0,
        message: "OK",
        data: {
            latestVersion: true
        }
    });
});

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
