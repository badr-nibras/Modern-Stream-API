const router = require("express").Router();
const games = require("../controllers/games");
const { verifyAccessToken } = require('../helpers/jwt_helper');
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

// Upload
router.post('/upload', verifyAccessToken, games.upload);

// Create a game
router.post('/create', verifyAccessToken, upload("modern-stream-images").single("files"), games.create);

// get all games
router.get("/", games.allGames);


// get game by Id
router.get("/:id", games.getGame);

// Delete a game
router.delete('/:id', verifyAccessToken, games.deleteGame)

// Update a game
router.put('/:id', verifyAccessToken, games.updateGame)


module.exports = router
