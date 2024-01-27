const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    favoriteSongs: [{ type: String }],
}, {
    collection: "UserInfo" 
});

mongoose.model("UserInfo", userInfoSchema);
