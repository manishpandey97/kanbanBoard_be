const authUserRole = (authoriedUserRole) => {

    return (req, res, next) => {
       
        try {
            const {role}=req.body;
            if(!role){
                console.log(`role not found for auth!`);
                return res.status(400).send(`role not found for auth!`);
            }
            if(authoriedUserRole.includes(role)){
                next()
            }else{
                console.log(`your are not authorized for this action!`);
                return res.status(400).send(`your are not authorized for this action!`);
            }

        } catch (error) {
            console.log(`role not found for auth!`);
            return res.status(500).send(`role not found for auth!`);
        }
    }
}

module.exports = authUserRole