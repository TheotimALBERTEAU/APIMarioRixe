const DAOFactory = require("../dao/dao-factory");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
    connectUser: async (reqBody) => {
        try {
            const foundUser = await DAOFactory.getDAOUser().selectByEmail(reqBody.email);

            if (!foundUser) {
                return { code: "601", message: "Email/password Mismatch", data: null };
            }

            const isPasswordValid = await bcrypt.compare(reqBody.password, foundUser.password);
            if (!isPasswordValid) {
                return { code: "601", message: "Email/password Mismatch", data: null };
            }

            const token = jwt.sign(
                { email: foundUser.email, pseudo: foundUser.pseudo, id: foundUser._id },
                process.env.JWTSECRET || "secret_jest",
                { expiresIn: "24h" }
            );

            return {
                code: "200",
                message: "login successfully achieved",
                data: {
                    token,
                    user: {
                        id: foundUser._id,
                        email: foundUser.email,
                        pseudo: foundUser.pseudo
                    }
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return { code: "500", message: "Server error", data: null };
        }
    },

    signupUser: async (reqBody) => {
        try {
            const foundUser = await DAOFactory.getDAOUser().selectByEmail(reqBody.email);
            if (foundUser) {
                return { code: "602", message: "Email already taken by another account", data: null };
            }

            if (reqBody.password !== reqBody.passwordConfirm) {
                return { code: "603", message: "Password mismatch", data: null };
            }

            if (reqBody.password.length < 6) {
                return { code: "605", message: "Password must be at least 6 characters", data: null };
            }

            const hashedPassword = await bcrypt.hash(reqBody.password, 10);

            let newUser = {
                email: reqBody.email,
                pseudo: reqBody.pseudo,
                password: hashedPassword,
            };

            const createdUser = await DAOFactory.getDAOUser().insert(newUser);

            const token = jwt.sign(
                { email: createdUser.email, pseudo: createdUser.pseudo, id: createdUser._id },
                process.env.JWTSECRET || "secret_jest",
                { expiresIn: "24h" }
            );

            return {
                code: "200",
                message: "Signup successfully achieved",
                data: {
                    token,
                    user: {
                        id: createdUser._id,
                        email: createdUser.email,
                        pseudo: createdUser.pseudo
                    }
                }
            };
        } catch (error) {
            console.error('Signup error:', error);
            return { code: "500", message: "Server error", data: null };
        }
    }

}