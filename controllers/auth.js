const User = require("../models/User");
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({
            username,
            email,
            password,
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Email or password not provided", 400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorResponse("User not found or invalid", 404));
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new ErrorResponse("Password not valid", 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
};

exports.forgotpassword = (req, res, next) => {
    res.send("Forgot Password Route");
};

exports.resetpassword = (req, res, next) => {
    res.send("Reset Password Route");
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}