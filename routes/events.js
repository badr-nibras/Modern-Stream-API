const router = require("express").Router();
const event = require("../controllers/event")
const { verifyAccessToken } = require('../helpers/jwt_helper')
const multer = require('multer')
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");


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

// Create a event
router.post('/create', verifyAccessToken, upload("modern-stream-images").single("files"), event.create)

// get all events 
router.get("/", event.allEvents)

// get the event of a user 
// get all events 
router.post("/", verifyAccessToken, event.myEvents)

// get event by Id
router.get("/:Eid", event.getEvent)

// Delete a event
router.post('/delete/:Eid', verifyAccessToken, event.delete)


module.exports = router
