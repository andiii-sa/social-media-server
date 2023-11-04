require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const io = require("socket.io")(process.env.PORT_SOCKET, {
  cors: {
    origin: process.env.ROOT_CLIENT_URL,
  },
  path: "/room-socket",
});

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var authRouter = require("./routes/auth");
var instagramRouter = require("./routes/instagram");
var blogRouter = require("./routes/blog");

var roomSocket = require("./routes/roomSocket");
roomSocket(io);

var app = express();
const URL = `/api/v1`;

app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// API V1
app.use(`${URL}/auth`, authRouter);
app.use(`${URL}/user`, userRouter);
app.use(`${URL}/instagram`, instagramRouter);
app.use(`${URL}/blog`, blogRouter);

module.exports = app;
