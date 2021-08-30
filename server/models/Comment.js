const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };