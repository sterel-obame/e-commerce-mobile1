import express from "express";
import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  getUserProfileController,
  loginController,
  logoutController,
  passwordResetController,
  registerController,
  udpatePasswordController,
  updateProfileController,
  updateProfilePicController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import { rateLimit } from "express-rate-limit";
import { body, check , validationResult} from "express-validator";


// RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

// VOICI LA ROUTE PAR DEFAUT du user http://localhost:8080/api/v1/user/ et la suite est chemin et la méthode http qu'on souhaite utiliser
// exemple pour enrégistrer les user on va utiliser http://localhost:8080/api/v1/user/register

// NB: chaque méthode et son chemin appellent le controller correspondant et toute la logique se trouve dans le controller


//router object: c'est ce objet qui permet de gérer les routes
const router = express.Router();

// register
router.post("/register", limiter, registerController);

//login
router.post("/login", limiter, loginController);

// Route pour récupérer tous les utilisateurs
router.get('/all-user', getAllUsersController);

// Route pour récupérer un seul utilisateur par ID
router.get('/user-id/:id', getUserByIdController);

// delete
router.delete('/user-delete/:id', deleteUserController);

//profile
router.get("/profile", isAuth, getUserProfileController);

//logout
router.get("/logout", isAuth, logoutController);

// uopdate profile
router.put("/profile-update", isAuth, updateProfileController);

// updte password
router.put("/update-password", isAuth, udpatePasswordController);

// update profile pic
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

// FORGOT PASSWORD
router.post("/reset-password", passwordResetController);

//export
export default router;
