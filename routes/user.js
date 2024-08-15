const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req,res) => {
    return res.render("signin");
});


router.get("/signup", (req,res) => {
    return res.render("signup");
});


router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await User.matchPasswordandgenerateToken(email, password);
  
      return res.cookie("token", token).redirect("/");
    } catch (error) {
      return res.render("signin", {
        error: "Incorrect Email or Password",
      });
    }
  });

// router.post("/signin", async (req, res) => {
//    const {email, password} = req.body;
//    //const user = await User.matchPasswordandgenerateToken(email, password); // when user matches , goes to models and returns user 
//    const token = await User.matchPasswordandgenerateToken(email, password);

//    // console.log("User", user);
//    console.log("token", token);

//    // return res.redirect("/");

//    return res.cookie("token", token).redirect("/");
// } catch (error) {
//     return res.render("signin")
// }
// });

router.get("/logout", (req,res) => {
    res.clearCookie("token").redirect("/");
});
  

// to get user details on the front end 
router.post("/signup", async (req,res) => {
    const {fullName , email, password} = req.body;
   // console.log(email, password);
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/"); //when you get signed up you will log onto the homepage
});

module.exports = router;

