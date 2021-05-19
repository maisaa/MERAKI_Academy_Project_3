const mongoose = require("mongoose");
require("dotenv").config()

const option = {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

console.log("...................",process.env.DB_URL);

mongoose.connect(process.env.DB_URL, option).then(
    () => { console.log("DB connected") },
    (err) => { console.log(err); }
)