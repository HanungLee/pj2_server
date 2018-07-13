var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var like_info = new Schema({
    post_id: {type: Schema.Types.ObjectId, required: true},
    number: {type: Number, default: 1}      //default 1 or 0?
});

var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    post: {type: [Schema.Types.ObjectId], default: null},          //posts are written by user.
    post_like: {type: [like_info], default: null}                  //ports are liked by user. 
    //post_like: {type: [Schema.Types.ObjectId], default: null}
});

module.exports = mongoose.model('user', userSchema);