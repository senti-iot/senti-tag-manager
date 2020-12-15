const express = require('express')
const router = express.Router()
const rfr = require('rfr')


// const sentiDatabrokerCoreService = rfr('lib/databrokerCore/sentiCoreService')
// const sentiDataCore = new sentiDatabrokerCoreService()

const sentiTagService = rfr('lib/tag/tagService')
const tagService = new sentiTagService()

// const { sentiAclPriviledge, sentiAclResourceType } = require('senti-apicore')
// const { aclClient } = require('../../server')


router.get('/resources/:tagUUID', async (req, res) => {
	let uuid = req.params.tagUUID
	let resources = await tagService.getRTagsByTagUUID(uuid)
	// let lease = req.lease

	/**TODO ACL HERE */

	res.status(200).json(resources)
})

// getRTagsByTagUUID
module.exports = router