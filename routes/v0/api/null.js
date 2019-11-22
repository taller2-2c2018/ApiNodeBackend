const express = require('express')
const router = express.Router()

const health = async function (req, res) {
    res.status(200)
    return res.json()
}

/* GET users listing. with async/await with error wrapping*/
router.get('/health', health)

module.exports = router