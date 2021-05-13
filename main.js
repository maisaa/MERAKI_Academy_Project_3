const express = require("express");
const app = express();
const port = 5000;

console.log("hiiiiii")

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`)
});