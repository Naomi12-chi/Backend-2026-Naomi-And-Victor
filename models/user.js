const mongoose = require ("mongoose");

const userSchema = mongoose.Schema ({
userName: String,

password: {
    type: String, required: true
},

email: {
    type: String, required: true, unique: true 
},
role: {
    type: String, default:"user", enum: ["user", "admin"]
},
profilePicture: {type: String},

});
const User = mongoose.model("User", userSchema);

module.exports = User;

