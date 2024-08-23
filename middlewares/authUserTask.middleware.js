const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const tokenModel = require('../models/token.model');

const authUserTask = async (req, res, next) => {
    const authHead = req.headers.authorization;
    if (!authHead) {
        console.log(`error in authHead`);
        return res.status(400).send(`error in authHead`);
    }
    try {
        const accesstoken = authHead.split(" ")[1];

        if (!accesstoken) {
            console.log(`accesstoken not found in auth`);
            return res.status(400).send(`accesstoken not found in auth`);
        }


        jwt.verify(accesstoken, process.env.secret_key1, async (err, decoded) => {
            if (err) {
                console.log(`error in accesstoken verifing!`);
                return res.status(400).send(`error in accesstoken verifing ${err}`);
            }
            if (decoded) {
                const userId = decoded.id;
                const user = await userModel.findById(userId);
                if (!user) {
                    console.log(`error in getting user accesstoken verifing!`);
                    return res.status(400).send(`error in getting user accesstoken verifing `);
                }
                
                const blockUserObj = await tokenModel.findOne({userId:userId})
                // console.log(blockUserObj)
                if ( blockUserObj && blockUserObj.blockToken.toString() == accesstoken.toString()) {
                    console.log(`accesstoken is blocked , please login again!`);
                    return res.status(400).send(`accesstoken is blocked, please login again!`);
                };
                req.user = user;
                next();
            }
        });

    } catch (error) {
        console.log(`error in authentication`);
        return res.status(500).send(`error in authentication:${error.message}`);
    }
}

module.exports = authUserTask;