const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

const { Video } = require("../models/Video");
const { Subscriber } = require('../models/Subscriber');
const { auth } = require("../middleware/auth");

// STORAGE MULTER CONFIG
var storage = multer.diskStorage({
    destination: (req, file, cb) => {                       // 파일을 저장할 장소
        cb(null, "uploads/");                               // uploads 폴더에 저장됨
    },
    filename: (req, file, cb) => {                          // 파일 이름 지정
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {                        // 파일 형식 필터링
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4' || ext !== '.MP4') {
            return cb(res.status(400).end('mp4/MP4 형식의 파일만 올릴 수 있습니다.'), false);
        }
        cb(null, true);
    }
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

// post 요청이 index.js로 갔다가 오기 때문에 앞에 /api/video는 생략
router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장 (multer dependency 사용)
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
    });
});

router.post('/thumbnail', (req, res) => {
    let thumbsFilePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기 (ffprobe - fffmpeg dependency와 함께 설치됨 - 사용)
    ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    })

    // 썸네일 생성 (ffmpeg dependency 사용)
    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames) { // 파일 이름 생성
            console.log('Will generate ' + filenames.join(', '));
            thumbsFilePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () {  // 썸네일을 생성하고 나서 무엇을 할 것인지
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration });
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err });
        })
        .screenshots({ // 스크린샷을 찍음
            // Will take screenshots at 20%, 40%, 60%, and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails', // 썸네일 저장 장소
            size: '320x240',
            // '%b': input basename (filename w/o extension)
            filename: 'thumbnail-%b.png'
        });
});

// post 요청이 index.js로 갔다가 오기 때문에 앞에 /api/video는 생략
router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videoDetail });
        });
});

// post 요청이 index.js로 갔다가 오기 때문에 앞에 /api/video는 생략
router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보냄
    Video.find() // Video안에 있는 모든 video를 가져옴
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videos });
        })
});

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보 MongoDB에 저장
    const video = new Video(req.body);

    video.save((err, video) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

router.post('/getSubscriptionVideos', (req, res) => {
    // userFrom을 이용해 구독중인 사람들을 찾음
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err);
            
            // 구독중인 사람들은 subscriber.userTo에 해당함
            let subscribedUser = []; // userTo array
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            });
            // userTo를 이용해 구독중인 사람들의 비디오를 가지고 옴
            Video.find({ writer: { $in: subscribedUser } }) // 구독중인 사람이 여러 명일 수 있으므로 MongoDB의 $in 메소드 사용
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, videos });
                });
        });
})

module.exports = router;