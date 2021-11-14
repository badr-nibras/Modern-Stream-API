const router = require("express").Router();
const tournement = require("../controllers/tournement")
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

// Create a tournement
router.post('/create', verifyAccessToken, upload("modern-stream-images").single("files"), tournement.create)

// get all tournements 
router.get("/", tournement.allTournements)

// get the tournement of a user 
// get all tournements 
router.post("/", verifyAccessToken, tournement.myTournements)

// get tournement by Id
router.get("/:Tid", tournement.getTournement)

// Delete a tournement
router.post('/delete/:Tid', verifyAccessToken, tournement.delete)

// Join a tournement
router.post('/join/:Tid', verifyAccessToken, tournement.joinRound1)

router.post('/join2/:Tid', verifyAccessToken, tournement.joinRound2)

router.post('/join3/:Tid', verifyAccessToken, tournement.joinRound3)

router.post('/join4/:Tid', verifyAccessToken, tournement.joinRound4)

router.post('/join5/:Tid', verifyAccessToken, tournement.joinRound5)

router.post('/winner/:Tid', verifyAccessToken, tournement.winner)

module.exports = router
