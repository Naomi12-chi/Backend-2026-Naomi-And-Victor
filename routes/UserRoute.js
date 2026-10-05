const express = require("express");
const {
  createUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    getProfilePicture,
} = require("../controllers/userController");
const upload = require("../middlewares/multer");
// const { verifyToken, verifyRole } = require("../middlewares/verify");
const router = express.Router();

router.post("/", upload.single("file"), createUser);
router.post("/login", loginUser);
router.get("/user/:id", getUser);
router.get("/", getUsers);
router.get ("/profile-picture/:id", getProfilePicture)
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
