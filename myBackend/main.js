const express = require("express");
const app = express();
// const { uuid } = require("uuidv4");// uuid without {}
const axios = require("axios");
const articlesRouter = express.Router();
const usersRouter = express.Router();
const db = require("./db");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Article, Comment, Role } = require("./schema");
const port = process.env.PORT;
const secret = process.env.SECRET;



// console.log("...........",process.env.DB_URL);

//Middleware application level
app.use(express.json());
app.use("/articles", articlesRouter);
app.use("/users", usersRouter)

//get All Articles
//with populate => Article.find({},"title description").populate("author","firstName lastName")
articlesRouter.get("/", (req, res) => {
    Article.find({}, "title description author")
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json(err);
        });
});

//get Article by Author's name
articlesRouter.get("/search_1/", async (req, res) => {
    // console.log("..search_1......", req.query.name)
    let author;
    await User.findOne({ firstName: req.query.author })
        .then((result) => {
            author = result;
            console.log("user findOne.....", author.firstName)
        })
        .catch((err) => {
            res.send(err);
        });
    Article.find({ author: author._id })
        .then((result) => {
            console.log("Article findOne.....", result)
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});

//get Article by Id
articlesRouter.get("/search_2/:id", (req, res) => {
    Article.find({ _id: req.params.id }).populate("author", "firstName lastName age")
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.send(err)
        })
})

//create new Article
articlesRouter.post("/", async (req, res) => {
    const { title, description, author } = req.body.article;
    const newArticle = new Article({
        title,
        description,
        author,
    });
    console.log("......newArticle.......", newArticle.author)
    newArticle.save()
        .then((result) => {
            res.status(201);
            res.json(result);
        }).catch((err) => {
            res.send(err);
        })
});
//closure function called authorization
//string it is token
const authorization = (permission)=>{
    
    return function(req,res,next){
        console.log("token.role ..authorization..", req.token.role); 
        Role.findById({_id:req.token.role})
                .then((result)=>{
                    console.log("result.permissions ......",result.permissions);
                    const perm = result.permissions;
                    if(perm.includes(permission)){
                            console.log("match......")
                            next();
                        } else {
                            res.status(403);
                            res.json("forbidden");
                        }
                })
                .catch((err)=>{
                    res.send("There is no Role")
                })
    }
}

//middleware function authentication
const authentication = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secret, (err, result) => {
            if (result) {
                console.log("result......",result )
                req.token = result;
                console.log("authentic............",result.role)
                next()
            } else {
                res.status(403);
                res.json("The token is invalid or expired");
            }
        })
    } else {
        // const err = new Error
        res.json("No Headers.authorization are found")
    }
};


//create new Comment
articlesRouter.post("/:id/comment", authentication,authorization("CREATE_COMMENT"), async (req, res) => {
    // console.log("new Comment...", req.body)
    const { comment, commenter } = req.body;
    const newComment = new Comment({ comment, commenter })
    newComment.save()
        .then((result) => {
            res.status(200);
            res.send(result)
        })
        .catch((err) => {
            res.send(err)
        })
})

//update an Article by Id
articlesRouter.put("/:id", (req, res) => {
    Article.findOneAndUpdate({ _id: req.params.id }, req.body.article, { new: true })
        .then((result) => {
            res.status(201);
            res.json(result)
        })
        .catch((err) => {
            res.send(err)
        })
});

//delete Article by Id
articlesRouter.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete({ _id: req.params.id })
        .then((result) => {
            res.status(200);
            res.json(result);
        })
        .catch((err) => {
            res.send(err)
        })
});

// delete Articles by Author
articlesRouter.delete("/", async (req, res) => {
    console.log(".......delete by author", req.query.author);
    let author;
    await User.findOne({ firstName: req.query.author })
        .then((result) => {
            author = result;
        })
        .catch((err) => {
            res.send(err);
        });
    Article.deleteMany({ author: author._id })
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err)
        })
})

//create new user
usersRouter.post("/", (req, res, next) => {
    const { firstName, lastName, age, country, email, password, role} = req.body;
    const author1 = new User({ firstName, lastName, age, country, email, password ,role})//.populate("role", "role permission")
    console.log("...3....", author1)
    author1.save()
        .then((result) => {
            res.status(201);
            res.json(result);
        }).catch((err) => {
            res.send(err);
        })
})

//login with Authentication
app.post("/login", async (req, res) => {
    let userInfo;
    await User.findOne({ email: req.body.email })
        .then((result) => {
            userInfo =result;
            console.log("result is found ", result.password)
            if (!null) {
                bcrypt.compare(req.body.password, result.password, (err, result) => {
                    if (result) {
                        console.log("is result true ?.... ", result)
                        res.status(200);
                        // res.json("Valid login credentials");
                        //sign a jwt......
                        const payload = {
                            userId: userInfo._id,
                            country: userInfo.country,
                            role: userInfo.role,
                        };
                        const options = { expiresIn: '60m' };
                        const token = jwt.sign(payload, secret, options);
                        console.log("login token....",payload)
                        res.json(token);
                    } else {
                        // console.log("is result false ? ", result)
                        res.status(403);
                        res.send("The password you’ve entered is incorrect");
                    }
                })
            }
            //else {
            //     // console.log("..........",result.length);
            //     // console.log("result is not found ", result)
            //     res.status(404);
            //     res.send("The email doesn't exist");
            // }
        })
        .catch(() => {
            res.status(404);
            res.send("The email doesn't exist");
        });
})

//............................................................................................
//News API
const getNews = async () => {
    try {
        let response = await axios.get('https://newsapi.org/v2/everything?q=tesla&from=2021-04-15&sortBy=publishedAt&apiKey=b0cd0b2802fa4c8ebcec5b2f918d816b');
        console.log(response.data.articles)
    } catch (error) {
        console.log(error)
    }
}
// getNews()
// console.log(getNews());

//weather API
//e43ffba62618a9ae08a3644cc2e98c08
//api.openweathermap.org/data/2.5/weather?q={Amman}&appid={e43ffba62618a9ae08a3644cc2e98c08}

app.get('/weather', async (req, res) => {
    try {
        let response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=886705b4c1182eb1c69f28eb8c520e20`);
        res.status(200).json(response.data)
    } catch (error) {
        console.log("error/////////////////.......................", error)
        res.json(error)
    }
})
//............................................................................................

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)

});