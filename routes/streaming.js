const express = require('express');
const {createChannel,
    publishStream,
    deleteStream,
    getChat,
    getChannel,
    deleteChannel,
    getChannels,
    getStream,
    stopStream,
    getStreams,
    getStreamByUser,
    getStreamById,
    getVideoById,
    createRecording,
    getRecording,
    deleteRecording,
    getVideos,
    getVideosByArn,
    getStreamByArn
} = require('../controllers/streaming');
const { verifyAccessToken } = require('../helpers/jwt_helper')
const multer = require('multer')
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const router = express.Router();

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
})


const upload = (bucketName) =>
    multer({
        storage: multerS3({
            s3,
            bucket: bucketName,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, `image-${Date.now()}` + '-' + file.originalname);
            },
        }),
    });


router.post('/channel/create', verifyAccessToken, createChannel);
router.post('/stream/publish', verifyAccessToken, upload("modern-stream-images").single("files"), publishStream);
router.post('/stream/delete', verifyAccessToken, deleteStream);
router.post('/stream/Chat', verifyAccessToken, getChat);
router.post('/channel', verifyAccessToken, getChannel);
router.post('/channel/delete', verifyAccessToken, deleteChannel);
router.post('/channels', verifyAccessToken, getChannels);
router.post('/stream', verifyAccessToken, getStream);
router.post('/stream/stop', verifyAccessToken, stopStream);
router.get('/streams', verifyAccessToken, getStreams);
router.get('/streamByUser/:id', getStreamByUser);
router.get('/streamById/:id', verifyAccessToken, getStreamById);
router.get('/videoById/:id', verifyAccessToken, getVideoById);
router.post('/streamByArn', verifyAccessToken, getStreamByArn);
router.post('/recording/create', verifyAccessToken, createRecording);
router.post('/recording', verifyAccessToken, getRecording);
router.post('/recording/delete', verifyAccessToken, deleteRecording);
router.get('/vod', verifyAccessToken, getVideos);
router.post('/vodByArn', verifyAccessToken, getVideosByArn);

module.exports = {
    routes: router
}