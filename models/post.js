var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var like_info = new Schema({
    user_id: {type: String, required: true},
    number: {type: Number, default: 1}  //default 1 or 0?
});

var postSchema = new Schema({
    //writer: {type: Schema.Types.ObjectId, required: true},    
    
    writer: {type: String, required: true},         //email     
       
    content: {type: String, required: true},
    photo: {type: String, default: null},                  
    //liked: {type: [String], default: null},         //몇번
    
    liked: {type: [like_info], default: null},         //몇번

    like_count: {type: Number, default: 0},                               
    date: {type: Date, default: Date.now},    
    hashtag: {type: [String], default: null},                        
    comment: {type: [{
        cmt_no: Number, 
        parent_comment: Number,
        writer: Schema.Types.ObjectId,
        content: String,
        date: {type: Date, default: Date.now}       
    }], default: null},
    comment_count: {type: Number, default: 0},                               

});

module.exports = mongoose.model('post', postSchema);