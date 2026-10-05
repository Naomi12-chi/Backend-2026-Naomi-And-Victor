const User = require("../models/user");
 const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getBucket } = require("../middlewares/gridfs");
 const { objectId } = require("mongodb");
 const mongoose = require("mongoose")

const KEY = process.env.SPECIAL_KEY;

//create
const createUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const bucket = getBucket();
    if (!bucket) { 
      return res.status(500).json({ message: "GridFS not initilized"})
    }

    if (!req.file) {
      return res.status(400).json ({
        message: "No file uploaded"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
      contentType: req.file.mimetype,
      },
    });

    uploadStream.end (req.file.buffer);
      uploadStream.on ("finish", async () => {
        try {
          
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
       profilePicture: uploadStream.id
    });
    return res.status(201).json({
      message: "User account created",
       user
      });
    } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      message: err.message,
    });
  }
      });

      uploadStream.on("error", (err) => {
        console.error ("GridFS upload error:", err);

        return res.status(500).json({
          message: "File upload Failed",
        });
      });

      // return res.status(500).json({
      //   message: "File upload failed"
      // })
    } catch (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    }
  };



//login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json("User not found");

    //const isValidPassword = await bcrypt.compare (password, user.password);
    // if (!isValidPassword) return res.status(401).json ("invalid credentials")
    const token = jwt.sign(
      { userId: user._id, userEmail: user.email, role: user.role },
      KEY,
      {
        expiresIn: "5m",
      },
    );

    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

//get User by Id
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    // if (id !== req.user.userId || req.user.role === "admin")
    //   res.status(403).json("forbidden access");
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      message: "User found",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
        ? `users/profile-picture/${user.profilePicture}`
        : null,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

//get users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

//update user
const updateUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    if (req.params.id !== req.user.userId || req.user.role === "admin")
      return res.status(403).json("must be an admin");

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      userName,
      email,
      password,
      role,
    });
    res.status(200).json("User updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

//delete user
const deleteUser = async (req, res) => {
  console.log("ran");
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    console.log(id);
    // const token = jwt.sign({ userId: user._id, userEmail: user.email, role: user.role }, KEY, {
    //     expiresIn: "5m",
    // });
    if (req.params.id !== req.user.userId || req.user.role === "admin")
      return res.status(403).json("must be an admin");
    res.status(200).json("User deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

//get profile picture
const getProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const bucket = getBucket();

    if (!bucket) {
      return res.status(500).json ({
        message: "GridFs not initialized"
      })
    }

    const file = await bucket
    .find ({
      _id: new mongoose.Types.ObjectId(id),
    })
    .next();
    console.log(file)
    if (!file) {
      return res.status(404).json ({
        message: "Profile picture not found",
      })
    }

    const contentType = file.metadata?.contentType;
    res.set("Content-Type", contentType || "application/octet-stream");
    const downloadStream = bucket.openDownloadStream(file._id);

    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getProfilePicture,
};
