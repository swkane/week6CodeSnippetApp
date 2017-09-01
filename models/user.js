const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  snippets: Array
});

userSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
}

userSchema.statics.authenticate = function(username, password, done) {
    this.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            done(err, false)
        } else if (user && user.authenticate(password)) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
};

const User = mongoose.model('User', userSchema);

module.exports = User;
