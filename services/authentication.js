const JWT = require("jsonwebtoken");

const secret = "$Batman@1123";


// takes the user and creates a token for it 
function createTokenForUser(user) {
    const payload = {
        _id:user._id,
        email:user.email,
        profileImageURL:user.profileImageURL, 
        role:user.role,
    };
    const token = JWT.sign(payload, secret);
    return token;
}

// validating the token 
function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser, 
    validateToken
}