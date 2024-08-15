const { Router } = require("express");
const path = require("path");
const multer = require("multer"); 
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });
  
  const upload = multer({ storage: storage });

// Route to render the form for adding a new blog
router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy"); //gives blog by id
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  //console.log("comments", comments);
  //console.log("blog", blog);
//
  return res.render("blog", {
  user: req.user, //gives user details and respective blog
  blog,
  comments,
});
});

// comment on that particular blog id 
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content, // passing the content of the comment from the frontend
    blogId: req.params.blogId, 
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

// Route to handle form submission and file upload
router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  });

module.exports = router;


 