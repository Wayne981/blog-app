const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/defult.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password
userSchema.pre("save", function (next) {
  const user = this;

  // Check if the password is modified
  if (!user.isModified("password")) return;

  // Generate a salt
  const salt = randomBytes(16).toString();
  //const salt = "somerandomsalt";
  
  // Hash the password with the salt
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  // Store the salt and hashed password
  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPasswordandgenerateToken",async function (email , password) {
  const user = await this.findOne({email});
  if(!user) return false;
// console.log(user);
  const salt = user.salt; // salt by user
  const hashedPassword = user.password;

  

  const userProvidedHash = createHmac("sha256", salt)
  .update(password)
  .digest("hex");

  if (hashedPassword != userProvidedHash)
    throw new Error("Incorrect password");

// return hashedPassword === userProvidedHash;

//  return user;

const token = createTokenForUser(user);
return token 
 
});

const User = model("user", userSchema);

module.exports = User;
