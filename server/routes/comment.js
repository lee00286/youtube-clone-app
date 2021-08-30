const express = require('express');
const router = express.Router();

const { Comment } = require("../models/Comment");
const { auth } = require("../middleware/auth");

//=================================
//             Comment
//=================================

// 작성한 커멘트를 저장
router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body);
    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err });
        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({ success: true, result });
            });
    });
});

// 작성된 커멘트를 가져옴
router.post('/getComments', (req, res) => {
    Comment.find({ "postId": req.body.videoId })
        .populate('writer')
        .exec((err, comments ) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, comments });
        });
});

module.exports = router;