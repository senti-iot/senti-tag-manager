const express = require('express')
const router = express.Router()
const { authClient } = require('../../server')

router.all('*', async (req, res, next) => {

	let lease = await authClient.getLease(req)
	if (lease === false) {
		res.status(401).json()
		return
	}
	req.lease = lease
	next()
})


module.exports = router