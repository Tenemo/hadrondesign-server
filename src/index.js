import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hi there from express');
});

const server = app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:4000/')
})