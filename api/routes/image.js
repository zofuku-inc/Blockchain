const router = require('express').Router();
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

router.post('/', (req, res) => {
    const values = Object.values(req.files)
    const promises = values.map(image => cloudinary.uploader.upload(image.path))
    Promise
        .all(promises)
        .then(results => {
            res.status(200).json(results[0].url)
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
})

module.exports = router;