const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userModel = require('../models/user.model')
const tokenModel = require('../models/token.model')
const authUserRole = require('../middlewares/authUserRole.middleware')

const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
    const { name, email, password, age, role } = req.body
    try {
        const users = await userModel.find()
        if (!users) {
            console.log(`users not found!`);
            return res.status(400).send(`users not found!`)
        }
        // res.set('Custom-Header', 'Task-Response');
        console.log(`users  found!`);
        return res.status(200).json(users)


    } catch (error) {
        console.log(`error in users  getting !`);
        return res.status(200).send(`error in users  getting :${error}`);
    }
})

userRouter.post('/register',authUserRole(["admin","user"]), async (req, res) => {
    const { name, email, password, age, role } = req.body
    try {
        const userExist = await userModel.findOne({email })
        if (userExist) {
            console.log(`user already registered!`);
            return res.status(400).send(`user already registered!:${userExist}`)
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log(`error during hasing!`);
                return res.status(400).send(`error during hasing!:${err}`)
            }
            const registerUser = userModel({ name, email, password: hash, age, role });
            await registerUser.save();

            console.log(`user registered  successfully!`);
            return res.status(200).send(`user registered successfully:${registerUser}`)
        });
    } catch (error) {
        console.log(`error during registering!`);
        return res.status(500).send(`error during registering!:${error}`)
    }
})


userRouter.post('/login',authUserRole(["admin","user"]), async (req, res) => {
    const { name, email, password, age, role } = req.body
    try {
        const userLogin = await userModel.findOne({ email })
        if (!userLogin) {
            console.log(`user not registered ,registered first!`);
            return res.status(400).send(`user not registered ,registered first:${userLogin}`)
        }

        bcrypt.compare(password, userLogin.password, async (err, result) => {
            if (err) {
                console.log(`error during password matching!`);
                return res.status(500).send(`error during password matching!:${err}`)
            }
            const accesstoken = jwt.sign({ id: userLogin._id, email: userLogin.email, password: userLogin.password },
                process.env.secret_key1, { expiresIn: '1h' });

            const refreshtoken = jwt.sign({ id: userLogin._id, email: userLogin.email, password: userLogin.password },
                process.env.secret_key1, { expiresIn: '1day' });

            if (!accesstoken && !refreshtoken) {
                console.log(`error during token crteation!`);
                return res.status(500).send(`error during token crteation!`)
            }

            console.log(`token created successfully!`);
            return res.status(200).json({
                "msg": "token created successfully!",
                "accesstoken": `${accesstoken}`,
                "refreshtoken": `${refreshtoken}`
            })
        });
    } catch (error) {
        console.log(`error during registering!`);
        return res.status(500).send(`error during registering!: ${error}`)
    }
})

userRouter.post('/logout',authUserRole(["admin","user"]), async (req, res) => {
    const { name, email, password, age, role } = req.body;
    const accesstoken = req.headers.authorization?.split(" ")[1]
    try {
        const logoutUser = await userModel.findOne({ email });
        if (!logoutUser) {
            console.log(`logout user not in db `);
            return res.status(400).send(`logout user not in db!`)
        }
        if (!accesstoken) {
            console.log(`logout accesstoken not found`);
            return res.status(400).send(`logout accesstoken not found!`)
        }

        const pastBlockTokenObj = await tokenModel.findOne({ userId: logoutUser._id });
       
        if (pastBlockTokenObj) {
            await tokenModel.findByIdAndDelete(pastBlockTokenObj._id);
        }

        const blocktoken = tokenModel({ userId: logoutUser._id, blockToken: accesstoken });
        if (!blocktoken) {
            console.log(`logout block token not genrated successfully!`);
            return res.status(400).send(`logout block token not genrated successfully!`)
        }

        await blocktoken.save();
        console.log(`logout successfully!`);
        return res.status(200).send(`logout successfully!`)
    } catch (error) {
        console.log(`error during logout!`);
        return res.status(500).send(`error during logout!: ${error}`)
    }
})

module.exports = userRouter;