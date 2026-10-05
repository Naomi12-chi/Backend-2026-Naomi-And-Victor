require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// serve frontend
server.use(express.static(path.join(__dirname, "public")));

const port = 3900;

mongoose
  .connect(process.env.MONGODB_URI)

  .then(() => {
    console.log("Database Connected");
  })

  .catch((error) => {
    console.error("there is an error");
  });

const userRouter = require("./routes/UserRoute");
server.use("/users", userRouter);

server.listen(port, () => {
  console.log(`it is running on port:${3900}`);
});
