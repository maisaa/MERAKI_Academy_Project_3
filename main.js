const express = require("express");
const app = express();
const { uuid } = require("uuidv4");// uuid without {}
const axios = require("axios");
const articlesRouter = express.Router();
const usersRouter = express.Router();
const db = require("./db");
const { User, Article } = require("./schema");
const port = 5000;


//Middleware application level
app.use(express.json());
app.use("/articles", articlesRouter);
app.use("/users", usersRouter)

//get All Articles
// articlesRouter.get("/", (req, res, next) => {
//     if (articles.length <= 0) {
//         const err = new Error("No articles");
//         err.status = 404;
//         next(err);
//     }
//     res.status(200);
//     res.json(articles);
// });

//with populate => Article.find({},"title description").populate("author","firstName lastName")
    
articlesRouter.get("/",(req,res)=>{
    Article.find({},"title description author")
    .then((result)=>{
        res.json(result);
    })
    .catch((err)=>{
        res.json(err);
    });
});

// //get Article by Author's name
// articlesRouter.get("/search_1/", (req, res, next) => {
//     const articleAuthor = req.query.author;//query
//     const found = articles.filter((ele) => {
//         return ele.author === articleAuthor;
//     });
//     if (found.length > 0) {
//         res.status(200);
//         res.json(found)
//     } else {
//         const err = new Error("Author not Found");
//         err.status = 404;
//         next(err);
//     }
// });

articlesRouter.get("/search_1/:name",async (req, res)=>{
    // console.log("..search_1......", req.params.name)
    let author;
    await User.findOne({firstName: req.params.name})
                .then((result)=>{
                    author = result;
                    console.log("user findOne.....",author.firstName)
                })
                .catch((err)=>{
                    res.send(err);
                });
    Article.find({author : author._id})
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err);
        });
});

//get Article by Id
// articlesRouter.get("/search_2/:id", (req, res, next) => {
//     let index;
//     const articleId = req.params.id;
//     const found = articles.find((ele, i) => {
//         index = i;
//         return ele.id == Number(articleId)
//     });
//     if (found) {
//         res.status(200);
//         console.log("articleId....", (index) + 1)
//         res.json(articles[(index)]);
//     } else {
//         const err = new Error(`this id(${articleId}) not Found`);
//         err.status = 404;
//         next(err);
//     }
// })

articlesRouter.get("/search_2/:id",(req,res)=>{
    console.log("60a2b36d4bf74e31a0e60655   ",req.params.id)
    Article.find({_id:req.params.id})
            .then((result)=>{
                res.status(200);
                // console.log("......",result[0].title);
                res.send(result);
            })
            .catch((err)=>{
                res.send(err)
            })
})

//create new Article 
// articlesRouter.post("/", (req, res, next) => {
//     try {
//         const newArticle = req.body.article;
//         newArticle.id = uuid();// uuid.uuid if we use uuid without {}
//         console.log("new...........", newArticle);
//         articles.push(newArticle);
//         res.status(201);
//         res.json(newArticle);
//     } catch (error) {
//         const err = new Error(`‘Something went wrong!’`);
//         err.status = 500;
//         next(err);
//     }
// });
articlesRouter.post("/", async (req, res) => {
    const {title, description} = req.body.article;
    let author;
    // // console.log(":::::",newArticle)
    await User.findOne({user:User._id})
                .then((result) =>{
                    author = result;
                    console.log("......>>",author._id)
                })
                .catch((err)=>{
                    console.log(err);
                });
    const newArticle = new Article({
        title,
        description,
        author: author._id,
    });
    console.log("......newArticle.......",newArticle.description)
    newArticle.save()
        .then((result) => {
            res.status(201);
            res.json(result);
        }).catch((err) => {
            res.send(err);
        })
});

// //update an Article by Id
// articlesRouter.put("/:id", (req, res, next) => {
//     let index;
//     const articleId = req.params.id;
//     // console.log("........put....",articleId);
//     const found = articles.find((ele, i) => {
//         index = i;
//         return ele.id == Number(articleId);// or === Number(id) 
//     });
//     if (found) {
//         // console.log("........put....",articles[index]);
//         articles[index] = req.body.article;
//         articles[index].id = articleId;
//         res.status(200);
//         res.json(articles[index])
//     } else {
//         console.log("....put...:", found)
//         const err = new Error(`This Id:${articleId} not Found`);
//         err.status = 404;
//         next(err);
//     }
// });

// //delete Article by Id
articlesRouter.delete("/:id", (req, res, next) => {
    let index;
    const articleId = req.params.id;
    const found = articles.find((ele, i) => {
        index = i;
        return ele.id === Number(articleId);
    });
    if (found) {
        articles.splice(index, 1);
        res.status = 200;
        res.json(`Success Delete article with id => ${articleId}`)
    } else {
        const err = new Error(`This id:${articleId} Not Found`);
        err.status = 404;
        next(err);
    }
});

// delete Articles by Author
articlesRouter.delete('/', (req, res, next) => {
    const authorName = req.body.name;
    const found = articles.filter((ele, i) => {
        return ele.author === authorName;
    });
    if (found) {
        articles.forEach((ele, i) => {
            if (articles[i] === found[i]) {
                articles.splice(i, 1);
            }
        });
        res.status = 200;
        res.json(`Success delete all the articles for the author => ${authorName}`)
    } else {
        const err = new Error(`No articles from this author: ${authorName} `);
        err.status = 404;
        next(err);
    }
});

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
        // console.log(".........................",response.data)
        // console.log(response.data);
        res.status(200).json(response.data)
    } catch (error) {
        // console.log("error/////////////////.......................",error)
        res.json(error)
    }
})
//..........................Part 2............
usersRouter.post("/", (req, res, next) => {

    const { firstName, lastName, age, country, email, password } = req.body;
    const author1 = new User({ firstName, lastName, age, country, email, password })
    console.log("...3....",author1)
    author1.save()
        .then((result) => {
            res.status(201);
            res.json(result);
        }).catch((err) => {
            res.send(err);
        })
})




//errors handling 
articlesRouter.use((err, req, res, next) => {
    res.status(err.status);
    res.json({
        err: {
            status: err.status,
            message: err.message,
        },
    });
});

const articles = [
    {
        id: 1,
        title: 'How I learn coding?',
        description:
            'Lorem, Quam, mollitia.',
        author: 'Jouza',
    },
    {
        id: 2,
        title: 'Coding Best Practices',
        description:
            'Lorem, ipsum dolor sit, Quam, mollitia.',
        author: 'Besslan',
    },
    {
        id: 3,
        title: 'Debugging',
        description:
            'Lorem, Quam, mollitia.',
        author: 'Jouza',
    },
];

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)

});