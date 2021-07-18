const User = require("../models/User");

exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({
            username,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            user: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res
            .status(400)
            .json({ success: false, error: "Email or password not provided" });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res
                .status(404)
                .json({ success: false, error: "User not found or invalid" });
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            res.status(404).json({ success: false, error: "Password not valid" });
        }

        res.status(200).json({
            success: true,
            token: "sampletoken",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.forgotpassword = (req, res, next) => {
    res.send("Forgot Password Route");
};

exports.resetpassword = (req, res, next) => {
    res.send("Reset Password Route");
};
