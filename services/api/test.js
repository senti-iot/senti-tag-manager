const express = require('express')
const router = express.Router()


router.get('/test', async (req, res) => {
	res.send(`Senti Tag Manager API is up and running`)
})


module.exports = router