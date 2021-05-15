const express = require("express");
const app = express();
const {uuid} = require("uuidv4");// uuid without {}
const port = 5000;


const articlesRouter = express.Router();


app.use(express.json());
app.use("/articles", articlesRouter);

//get All Articles
articlesRouter.get("/", (req, res, next) => {
    if (articles.length <= 0) {
        const err = new Error("No articles");
        err.status = 404;
        next(err);
    }
    res.status(200);
    res.json(articles);
});

//get Article by Author's name
articlesRouter.get("/search_1/:name",(req,res,next)=>{
    let index;
    const articleAuthor = req.params.name;
    const found = articles.filter((ele,i)=>{
        index = i;
        return ele.author == articleAuthor;
    });
    if(found){
        res.status(200);
        res.json(found)
    } else {
        const err = new Error("Author not Found");
        err.status = 404;
        next(err);
    }
});

//get Article by Id
articlesRouter.get("/search_2/:id", (req, res, next) => {
    let index;
    const articleId = req.params.id;//query
    const found = articles.find((ele, i) => {
        index = i;
        return ele.id == Number(articleId)
    });
    if (found) {
        res.status(200);
        console.log("articleId....", (index) + 1)
        res.json(articles[(index)]);
    } else {
        const err = new Error(`this id(${articleId}) not Found`);
        err.status = 404;
        next(err);
    }
})

//create new Article 
articlesRouter.post("/",(req,res,next)=>{
    try {
            const newArticle = req.body.article;
            newArticle.id = uuid;// uuid.uuid if we use uuid without {}
            console.log("new...........",newArticle);
            articles.push(newArticle);
            res.status(201);
            res.json(newArticle);
    } catch (error) {
        const err = new Error(`‘Something went wrong!’`);
        err.status = 500;
        next(err);
    }
    
});

//update an Article by Id
articlesRouter.put("/:id",(req,res,next)=>{
    let index;
    const articleId = req.params.id;
    // console.log("........put....",articleId);
    const found = articles.find((ele,i)=>{
        index = i;
        return ele.id == Number(articleId) ;// or === Number(id) 
    });
    if(found){
        // console.log("........put....",articles[index]);
        articles[index] =req.body.article;
        articles[index].id = articleId;
        res.status(200);
        res.json(articles[index])
    } else {
        console.log("....put...:",found)
        const err = new Error(`This Id:${articleId} not Found`);
        err.status = 404;
        next(err);
    }
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