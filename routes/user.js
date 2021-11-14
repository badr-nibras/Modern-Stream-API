const router = require("express").Router();
const auth = require("../controllers/user")
const { verifyAccessToken } = require('../helpers/jwt_helper')
const multer = require('multer')
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
//const path = require('path');
//const fs = require('fs');

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

/* to store images in local
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirName = path.join("C:\\Users\\Hajjaji\\Documents\\GitHub\\modern-stream\\modern_stream_ui\\public", '.\\files')
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
        cb(null, dirName)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
var upload = multer({ storage: storage })
*/

// Refresh token
router.post("/refresh-token", auth.refreshToken)

// get all users
router.get("/users", auth.users)

// Get my info
router.get("/:userId", verifyAccessToken, auth.info)

//add channelArn to user
router.post("/addchannel/:id", verifyAccessToken, auth.addChannelArn)

// Update user fields
router.post("/updateUser/:userId", verifyAccessToken, auth.updateUser)

// Upload user Images
router.post("/uploadProfilePic", verifyAccessToken, upload("modern-stream-images").single("files"), auth.uploadProfilePic)
router.post("/uploadCoverPic", verifyAccessToken, upload("modern-stream-images").single("files"), auth.uploadCoverPic)

//Reset Password
router.post('/resetPassword', auth.resetPassword)

//set streamkey
router.post('/streamkey', auth.putStreamKey)

//change Password
router.post("/changePass", verifyAccessToken, auth.changePass)

router.post("/changePassword", auth.changePassword)

// follow
router.post("/follow/:userId", verifyAccessToken, auth.follow)

// unfollow 
router.post("/unfollow/:userId", verifyAccessToken, auth.unfollow)
// check following
router.post("/check/:userId", verifyAccessToken, auth.checkFollowing)

module.exports = router
