const express = require('express')

const taskModel = require('../models/task.model')
const authTaskRole = require('../middlewares/authTaskRole.middleware')

const taskRouter = express.Router();

taskRouter.get('/', authTaskRole(["admin", "user"]), async (req, res) => {
    const { title, status } = req.body
    const userId = req.user._id;
    try {
        const tasks = await taskModel.find({ userId })
        if (!tasks) {
            console.log(`tasks not found!`);
            return res.status(400).send(`tasks not found!`)
        }
        console.log(`all tasks  found!`);
        return res.status(200).send(`all tasks:${tasks}`);
    } catch (error) {
        console.log(`error in tasks  getting !`);
        return res.status(200).send(`error in tasks  getting :${error}`);
    }
})

taskRouter.post('/create', authTaskRole(["admin", "user"]), async (req, res) => {
    const { title, descriptions, duedate, status } = req.body;
    const userId = req.user._id;
    try {
        // console.log(userId);
        const taskExist = await taskModel.findOne({ title })
        if (taskExist) {
            console.log(`task already craeted!`);
            return res.status(400).send(`task already craeted!:${taskExist}`)
        }

        const taskCreate = await taskModel({ title, descriptions, duedate: new Date(duedate), status, userId: userId })
        await taskCreate.save()
        console.log(`tasks created successfully!`);
        return res.status(200).send(`tasks created successfully!:${taskCreate}`)

    } catch (error) {
        console.log(`error during task creating!`);
        return res.status(500).send(`error during task creating:${error}`)
    }
})


taskRouter.put('/update/:id', authTaskRole(["admin", "user"]), async (req, res) => {
    const payload = req.body;
    const taskId = req.params.id;
    const userId = req.user._id;
    try {
        const updateTask = await taskModel.findById(taskId );
        if (!updateTask) {
            console.log(`update Task not found!`);
            return res.status(400).send(`update Task not found:${updateTask}`)
        }
        if (userId.toString() == updateTask.userId.toString()) {
            await taskModel.findByIdAndUpdate({ _id: taskId }, payload);
            console.log(`update Task successfully!`);
            return res.status(200).send(`update Task successfully!:${updateTask}`)
        } else {
            console.log(`you are not authoried for update Task!`);
            return res.status(400).send(`you are not authoried for update Task!:${updateTask}`);
        }
    } catch (error) {
        console.log(`error updateing  task !`);
        return res.status(500).send(`error updating Task:${error}`)
    }
})

taskRouter.delete('/delete/:id', authTaskRole(["admin"]), async (req, res) => {
    const taskId  = req.params.id;
    const userId = req.user._id;
    try {
        const deleteTask = await taskModel.findOne({ _id: taskId })
        if (!deleteTask) {
            console.log(`delete Task not found!`);
            return res.status(400).send(`delete Task not found:${deleteTask}`)
        }
        if (userId.toString() == deleteTask.userId.toString()) {
            await taskModel.findByIdAndDelete({ _id: taskId })
            console.log(`delete Task successfully!`);
            return res.status(200).send(`delete Task successfully!:${deleteTask}`)
        }
        console.log(`you are not authoried for delete Task !`);
        return res.status(200).send(`you are not authoried for delete Task !:${deleteTask}`)

    } catch (error) {
        console.log(`error delete  task creating!`);
        return res.status(500).send(`error delete Task creating:${error}`)
    }
})

module.exports = taskRouter;