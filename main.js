const express = require("express");
const app = express();
const port = 5000;


const articlesRouter = express.Router();


app.use(express.json());
app.use("/articles", articlesRouter);

//get All Articles
articlesRouter.get("/", (req, res, next) => {
    if (articles.length <= 0) {
        const err = new Error("no articles");
        err.status = 404;
        next(err);
    }
    res.status(200);
    res.json(articles);
});

articlesRouter.get("/search_2/:id", (req, res, next) => {
    let index;
    const articleId = req.params.id;//query
    const found = articles.find((ele, i) => {
        index = i;
        // if(ele.id === articleId)
        return ele.id == Number (articleId)
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