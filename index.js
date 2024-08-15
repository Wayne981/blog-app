const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require('./routes/user');
const cookiePaser = require("cookie-parser");
const {
    checkForAuthenticationCookie,
  } = require("./middlewares/authentication");
const blogRoute = require("./routes/blog")
const Blog = require("./models/blog");

const app = express();
const PORT = 8001;
// te

app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blogify', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));



// Routes
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  });

// Use user route
app.use('/user', userRoute);
app.use('/blog', blogRoute);

// Start server
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));






