import express from "express";
const app = express();

const port = 3001;

app.listen(port, () => {
    console.log(`http server is running at port:${port}`);
});