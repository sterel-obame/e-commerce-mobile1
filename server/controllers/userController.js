import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/Features.js";
import { body, validationResult} from "express-validator";


// cette méthode fonctionne bien, elle a été testé.
export const registerController = [
    // Validation des champs
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("answer").notEmpty().withMessage("Answer is required"),

    async (req, res) => {
        // Vérifie les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Logique d'inscription
        try {
            const { name, email, password, address, city, country, phone, answer } = req.body;

            // Vérification de l'existence de l'utilisateur
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already taken",
                });
            }

            const user = await userModel.create({
                name,
                email,
                password,
                address,
                city,
                country,
                phone,
                answer,
            });

            // Génération du token
            const token = user.generateToken();

            // Réponse avec le cookie
            res.cookie("token", token, {
                expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
                sameSite: "strict",
            });

            // Réponse finale
            return res.status(201).json({
                success: true,
                message: "Registration success",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    city: user.city,
                    country: user.country,
                    phone: user.phone,
                    answer: user.answer,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error In Register API",
                error,
            });
        }
    },
];
/*
pour enrégistrer un user on va utiliser
{
    "name":"sterel obame",
    "email":"obamesterel@yahoo.fr",
    "password":"sauveur1995",
    "city":"casablanca",
    "address":"sidi maarouf",
    "country":"maroc",
    "phone":"0624571578",
    "answer":"oyem", //c'est la question de sécurité
    "role":"admin"  //facultatif
}
*/

// GET ALL USER
export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password').select('-password'); // Exclure les mots de passe de la réponse
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in retrieving users",
        });
    }
};

// GET USER BY ID
export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id, '-password').select('-password'); // Exclure le mot de passe de la réponse

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in retrieving user",
        });
    }
};

// DELETE
export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérification si l'utilisateur existe
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Suppression de l'utilisateur
        await userModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in Delete User API",
        });
    }
};


//LOGIN
// export const loginController = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         //validation
//         if (!email || !password) {
//             return res.status(500).send({
//                 success: false,
//                 message: "Please Add Email OR Password",
//             });
//         }
//         // check user
//         const user = await userModel.findOne({ email });
//         //user valdiation
//         if (!user) {
//             return res.status(404).send({
//                 success: false,
//                 message: "User Not Found",
//             });
//         }
//         //check pass
//         const isMatch = await user.comparePassword(password);
//         //valdiation pass
//         if (!isMatch) {
//             return res.status(500).send({
//                 success: false,
//                 message: "invalid credentials",
//             });
//         }

//         //token
//         const token = user.generateToken();
//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//         });

//         // on va valider le token généré par le cookie
//         res
//         .status(200)
//         .cookie("token", token, {
//             expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
//             secure: process.env.NODE_ENV === "development" ? true : false,
//             httpOnly: process.env.NODE_ENV === "development" ? true : false,
//             sameSite: process.env.NODE_ENV === "development" ? true : false,
//         })
//         .send({
//             success: true,
//             message: "Login Successfully",
//             token,
//             user,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: "false",
//             message: "Error In Login Api",
//             error,
//         });
//     }
// };
export const loginController = [
    // Validation des champs
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    async (req, res) => {
        // Vérifie les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Logique de connexion
        try {
            const { email, password } = req.body;
console.log(email, password)
            // Vérification de l'existence de l'utilisateur
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found",
                });
            }

            // Vérification du mot de passe
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid password",
                });
            }

            // Génération du token
            const token = user.generateToken();

            // Réponse avec le cookie
            res.cookie("token", token, {
                expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
                sameSite: "strict",
            });

            // Réponse finale
            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                success: false,
                message: "Error in login API",
                error,
            });
        }
    }
];
/*
pour se connecter on aura besoin du password et l'email d'où l'objet sera
{
    "email":"on donne un email",
    "password":"on donne un password"
}
*/

// GET USER PROFILE
export const getUserProfileController = async (req, res) => {
    console.log("ce que je reçoit:", req.user._id)
    try {
        const user = await userModel.findById(req.user._id);
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "USer Prfolie Fetched Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In PRofile API",
            error,
        });
    }
};

// LOGOUT
export const logoutController = async (req, res) => {
    try {
        // Supprimer le cookie "token"
        res
            .status(200)
            .cookie("token", "", {
                expires: new Date(Date.now()), // Expire immédiatement
                secure: process.env.NODE_ENV !== "development", // Activer en production
                httpOnly: true, // Toujours activé
                sameSite: "strict", // Toujours "strict" pour la sécurité
            })
            .json({
                success: true,
                message: "Logout successfully",
            });
    } catch (error) {
        // Journaliser l'erreur
        console.error("Error in logout API:", error);

        // Renvoyer une réponse d'erreur
        res.status(500).json({
            success: false,
            message: "Error in logout API",
            error: error.message, // Ne pas renvoyer l'objet d'erreur complet en production
        });
    }
};

// UPDATE USER PROFILE
export const updateProfileController = [
    // Validation des champs
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    // body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    // body("answer").notEmpty().withMessage("Answer is required"),

    async (req, res) => {
        try {
            const user = await userModel.findById(req.user._id);
            const { name, email, address, city, country, phone } = req.body;
            // validation + Update
            user.name = name;
            user.email = email;
            user.address = address;
            user.city = city;
            user.country = country;
            user.phone = phone;
            //save user
            await user.save();

            res.status(200).send({
                success: true,
                message: "User Profile Updated",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error In update profile API",
                error,
            });
        }
    },
]
/*
    l'objet va correspondre aux champ qu'on voudra modifier
    {
        "name":"newName"
    }
*/

// update user passsword
export const udpatePasswordController = [
    body("oldPassword").isLength({ min: 6 }).withMessage("oldPassword must be at least 6 characters long"),
    body("newPassword").isLength({ min: 6 }).withMessage("newPassword must be at least 6 characters long"),


    async (req, res) => {
        try {
            const user = await userModel.findById(req.user._id);
            const { oldPassword, newPassword } = req.body;

            // old pass checkla méthode "comparePassword" se trouve dans le schema de "user"
            const isMatch = await user.comparePassword(oldPassword);
            //validaytion
            if (!isMatch) {
                return res.status(500).send({
                    success: false,
                    message: "Invalid Old Password",
                });
            }
            user.password = newPassword;
            await user.save();

            res.status(200).send({
                success: true,
                message: "Password Updated Successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error In update password API",
                error,
            });
        }
    },
]
/*
    l'objet de la requettes va ressemnler à ça
    {
        "oldPassword":"sauveur1995",
        "newPassword":"S@uveur1995"
    }
*/

/// Update user profile photo
export const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        // file get from client photo
        const file = getDataUri(req.file);
        // delete prev image in the cloud 
        // si le profile ne possède pas de photo, pour ajouter la première photo, il faut d'abord commenter cette ligne qui est en bas
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        // update
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };
        // save func
        await user.save();

        res.status(200).send({
            success: true,
            message: "profile picture updated",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In update profile pic API",
            error,
        });
    }
};
/*
    l'objet va avoir un seul champ qui sera "file" et ce sera une photo
*/

// FORGOT PASSWORD
export const passwordResetController = [
    // Validation des champs
    body("email").isEmail().withMessage("Invalid email"),
    body("newPassword").isLength({ min: 6 }).withMessage("newPassword must be at least 6 characters long"),
    body("answer").notEmpty().withMessage("Answer is required"),

    async (req, res) => {
        try {
            // user get email || newPassword || answer
            const { email, newPassword, answer } = req.body;
            
            // find user
            const user = await userModel.findOne({ email, answer });
            //valdiation
            if (!user) {
            return res.status(404).send({
                success: false,
                message: "invalid user or answer",
            });
            }

            user.password = newPassword;
            await user.save();

            res.status(200).send({
                success: true,
                message: "Your Password Has Been Reset Please Login !",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error In password reset API",
                error,
            });
        }
    },
]
/*
l'URL aura cette forme: http://localhost:8080/api/v1/user/reset-password
l'objet aura cette forme:
{
    "email":"ericondo2@gmail.com",
    "newPassword":"S@uveur1995",
    "answer":"oyem"
}
    le "email" doit correspondre à celui qui est enrégistré 
    le "answer" doit correspondre à celui qui est enrégistré 
*/

