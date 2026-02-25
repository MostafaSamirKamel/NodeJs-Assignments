const express = require('express');
const cors = require('cors');
const sequelize = require('./src/db/connection');
const { User, Post, Comment } = require('./src/models/index');
const userRouter = require('./src/modules/users/user.router');
const postRouter = require('./src/modules/posts/post.router');
const commentRouter = require('./src/modules/comments/comment.router');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.use('/users', userRouter);
app.use('/user', userRouter); // For /user/:id endpoint
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

sequelize.sync({ alter: false, force: false }) // Using force: false for safety
    .then(() => {
        console.log('Database synced');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Database sync error:', err);
    });
