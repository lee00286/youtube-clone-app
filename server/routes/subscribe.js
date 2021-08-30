const express = require('express');
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================

// 구독자 수를 반환
router.post('/subscribeNumber', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo})
        .exec((err, subscribe) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, subscribeNumber: subscribe.length });
        });
});

// 사용자의 구독 정보를 반환
router.post('/subscribed', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
        .exec((err, subscribe) => {
            if (err) return res.status(400).send(err);
            // subscribe가 0일 경우, 구독중
            // subscribe가 0이 아닐 경우, 구독하지 않음
            let result = false;
            if (subscribe.length !== 0) {
                result = true;
            }
            return res.status(200).json({ success: true, subscribed: result });
        });
});

// 구독 취소
router.post('/unSubscribe', (req, res) => {
    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc) => {
            if (err) return res.status(400).json({ success: false, err });
            return res.status(200).json({ success: true, doc });
        });
});

// 구독
router.post('/subscribe', (req, res) => {
    const subscribe = new Subscriber(req.body);
    subscribe.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    })

});

module.exports = router;