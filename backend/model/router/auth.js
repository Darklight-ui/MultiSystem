const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require("../auth.model")
const encryptPw = async (password) => {
	return await bcrypt.hash(password, 12);
};

const NODE_ENV = process.env.NODE_ENV
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES
 
const signJwt = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    })
}
// send JWT to user

const sendToken = (user, statusCode, res, req) => {
    const token = signJwt(user._id)
    const options = {
			expires: new Date(Date.now + JWT_EXPIRES),
			secure: NODE_ENV === "production" ? true : false,
			httpOnly: NODE_ENV === "production" ? true : false,
		}
    res.cookie('jwt', token, options);

    user.password = undefined

    res.status(statusCode).json({
        status: "success", 
        token, 
        user
    })
}

router.route('/signup').post( async (req, res) => {
    const { fullname, username, email, password, profilePhoto } = req.body
    hashedPw = await encryptPw(password)
    try {
        const newUser = await User.create({
            fullname, username, email, password: hashedPw, profilePhoto
        })
        // if there is  new user asign a token
        res.json(sendToken(newUser, 201, req, res))
        if (newUser === null) {
            res.send('Fill the Input Provided')
        }
    } catch (error) {
        // res.status(400).json(error.message)
        console.log(error);
        
    }
})

/*
#######################################################
########################################################
########################################################
**/

router.route('/login').post(async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select('+password')
      
        const compared = await bcrypt.compare(password, user.password)

        compared? sendToken(user, 200, res, req) : res.status(400).json({message: "Log in Failed"})
      
        // await bcrypt.compare(password, user.password)
        // sendToken(user, 200, res, req)
    } catch (error) {
        console.log(error.message);
        console.log(error);
    }
})

/*
############################################################
############################################################
############################################################
*/

router.route('/logout').get(async (req, res) => {
    const options = {
			expires: new Date(Date.now + 10000),
			secure: NODE_ENV === "production" ? true : false,
			httpOnly: NODE_ENV === "production" ? true : false,
		};
    res.cookie("jwt", "expiredtoken", options)
    res.status(200).json({status: "success"})
})

router.route('/user').get(async (req, res) => {
    try {
        const user = await User.find()
        res.status(200).json(user._id)
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router