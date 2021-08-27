const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: { 
        type: mongoose.Schema.Types.ObjectId, // 아이디만 넣어도 User 정보를 다 불러올 수 있음
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50,
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String 
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true }); // createDate, updateDate가 표시됨

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };