const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const userConnet = require('./config/users.db');
const taskConnet = require('./config/tasks.db');
const userRouter = require('./routes/user.route');
const taskRouter = require('./routes/task.route');
const authUserTask = require('./middlewares/authUserTask.middleware');

app.use(express.json());
app.use(cors({origin:"*"}))


app.use('/user', userRouter);
app.use('/task', authUserTask, taskRouter);

app.listen(PORT, async () => {
    try {
        await userConnet;
        await taskConnet;
        console.log(`server running on port: ${PORT} and connected with dbs of users and tasks!`)
    } catch (error) {
        console.log(`error in server running on port: 3000 is ${error}!`)
    }
})