const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const salt = 5;



const userSchema = new mongoose.Schema({
    firstName:{ type: String },
    lastName:{ type: String },
    age:{ type: Number },
    country: { type: String },
    email: { type: String },
    password: { type: String },
    role: {type: mongoose.Schema.Types.ObjectId, ref:"Role"}
})

const articleSchema = new mongoose.Schema({
    title: { type: String },
    description:  { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comments: [{comment: { type: String },
                commenter: { type: mongoose.Schema.Types.ObjectId, ref:"User"}}]
})

const commentsSchema = new mongoose.Schema({
    comment: { type: String },
    commenter: { type: mongoose.Schema.Types.ObjectId, ref:"User"}
})

const rolesSchema = new mongoose.Schema({
    role: { type: String },
    permissions: [{type: String}]
})

//hash the password
userSchema.pre("save", async function () {
    this.email = this.email.toLowerCase();
    this.password = await bcrypt.hash(this.password, salt);   
})

const User = mongoose.model("User", userSchema)
const Article = mongoose.model("Article", articleSchema)
const Comment = mongoose.model("Comment", commentsSchema)
const Role = mongoose.model("Role", rolesSchema)

module.exports.User = User;
module.exports.Article = Article;
module.exports.Comment = Comment;
module.exports.Role = Role;

