const express = require('express')
const router = express.Router()
const rfr = require('rfr')
// const { sentiAclPriviledge, sentiAclResourceType } = require('senti-apicore')
const { /* aclClient, */ authClient } = require('../../server')

const sentiTagService = rfr('lib/tag/tagService')
console.log(sentiTagService)
const tagService = new sentiTagService()

router.all('*', async (req, res, next) => {

	let lease = await authClient.getLease(req)
	if (lease === false) {
		res.status(401).json()
		return
	}
	next()
})

router.post('/create', async (req, res) => {
	try {
		console.log('Entered')
		let tagR = req.body.tag
		// let resourceUUID = req.body.tag.resourceUUID
		let result = await tagService.createTag(tagR)
		res.status(404).json(result)
	}
	catch (e) {
		console.log(e)
		res.status(500).json(e)
	}
})

module.exports = router