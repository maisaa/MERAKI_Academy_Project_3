const express = require("express");
const app = express();
// const { uuid } = require("uuidv4");// uuid without {}
const axios = require("axios");
const articlesRouter = express.Router();
const usersRouter = express.Router();
const db = require("./db");
const { User, Article, Comment } = require("./schema");
const port = 5000;


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
//create new Comment
articlesRouter.post("/:id/comment",async (req,res)=>{
    console.log("new Comment...",req.body)
    const {comment, commenter} = req.body;
    const newComment = new Comment({ comment, commenter})
    newComment.save()
            .then((result)=>{
                res.status(200);
                res.send(result)
            })
            .catch((err)=>{
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
articlesRouter.delete("/:id",async (req,res)=>{
    await Article.findByIdAndDelete({_id:req.params.id})
    .then((result)=>{
        res.status(200);
        res.json(result);
    })
    .catch((err)=>{
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

    const { firstName, lastName, age, country, email, password } = req.body;
    const author1 = new User({ firstName, lastName, age, country, email, password })
    console.log("...3....", author1)
    author1.save()
        .then((result) => {
            res.status(201);
            res.json(result);
        }).catch((err) => {
            res.send(err);
        })
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
    } catch (error) {console.log("error/////////////////.......................",error)
        res.json(error)
    }
})
//............................................................................................

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)

});