const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{ type: String },
    lastName:{ type: String },
    age:{ type: Number },
    country: { type: String },
    email: { type: String },
    password: { type: String },
})

const articleSchema = new mongoose.Schema({
    title: { type: String },
    description:  { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User"}

})

const User = mongoose.model("User", userSchema)
const Article = mongoose.model("Article", articleSchema)

module.exports.User = User;
module.exports.Article =Article;

