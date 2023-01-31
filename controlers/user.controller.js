const User = require("../models/usermodel");
const jwt = require("../helpers/generateJwt")
var admin = require("firebase-admin");
const rp = require("request-promise");

exports.Registration = async (req, res) => {
    try {
        var data = req.body;
        var user = await User.create(data);
    } catch (e) {
        console.log(e);

        return res.status(404).json({
            status: "ALREADY REGISTERED",
            message: e,
        });
    }
    return res.send({
        success: true,
        user: user,
        message: "User registered successfully",
    });
};

exports.veryfyIdToken = async (req, res) => {
    admin.auth()
        .verifyIdToken(req.body.token)
        .then((decodedToken) => {
            console.log(decodedToken)
            const uid = decodedToken.uid;
            return res.status(200).json({
                error: false,
                message: uid,
            });
        })
        .catch((error) => {
            return res.status(200).json({
                error: true,

            });
        });
}

exports.generateIdToken = async (req, res) => {
    try {
        const { uuid } = req.body;

        let token = await admin.auth().createCustomToken(uuid);
        const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyCKu1Dypn5xcgh34qkWPXNsPHGbBgH-IV0`;
        const data = {
            token: token,
            returnSecureToken: true
        };

        var options = {
            method: "POST",
            uri: url,
            body: data,
            json: true // Automatically stringifies the body to JSON
        };

        return rp(options)
            // idToken is the firebase id token that can be used with verifyIdToken
            .then((parsedBody) => {
                return res.status(200).json({
                    error: true,
                    message: parsedBody.idToken,
                });
            })
            .catch(function (err) {
                // POST failed...
            });

    } catch (err) {
        console.error("Login error", err);
        return res.status(500).json({
            error: true,
            message: "Couldn't login. Please try again later.",
        });
    }
};

exports.allUsers = async (req, res) => {
    var users = await User.find().populate('icds')
    return res.send({
        success: true,
        users: users,
        message: "User logged in",
    });

};

exports.update = async (req, res) => {

    var users = await User.updateMany(
        {
            email: { $regex: "^Test", $options: 'i' }
        },
        {
            name: "Test"
        }
    )
    users = await User.find(
        {
            email: { $regex: "^Test", $options: 'i' }
        }
    )
    return res.send({
        success: true,
        users: users
    });

};

exports.allUsersAge = async (req, res) => {
    var users = await User.aggregate(
        [
            {

                $project: {
                    email: "$email",
                    name: "$name",
                    address: "$address",
                    dob: "$dob",
                    last_login: "$last_login",
                    age: {
                        $divide: [{ $subtract: [new Date(), "$dob"] },
                        (365 * 24 * 60 * 60 * 1000)]
                    }

                }
            }
        ]
    )
    return res.send({
        success: true,
        users: users,
        message: "User logged in",
    });
};

exports.delete = async (req, res) => {
    var users = await User.findByIdAndDelete(req.body.id);
    return res.send({
        success: true,
        users: users,
        message: "User Deleted",
    });

};

exports.login = async (req, res) => {
    try {
        user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (!user) {
            return res.status(404).json({
                status: "User not found"
            });
        } else {
            var user1 = await User.findByIdAndUpdate(
                user._id,
                {
                    last_login: new Date()
                }
            )
            console.log(user1)
            var token = await jwt.generateJwt(user.toObject());
            delete user._doc.password
            return res.status(200).json({
                status: "Login Success",
                token: token.token,
                user: user
            });
        }
    } catch (e) {
        return res.status(404).json({
            status: "Something went wrong",
            message: e,
        });
    }
};