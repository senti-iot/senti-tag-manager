const express = require('express')
const router = express.Router()
const rfr = require('rfr')

const sentiTagService = rfr('lib/tag/tagService')
const tagService = new sentiTagService()

const { sentiAclPriviledge, sentiAclResourceType } = require('senti-apicore')
const { aclClient } = require('../../server')

router.get('/tags/:resourceUUID', async (req, res) => {

	let uuid = req.params.resourceUUID
	let tags = await tagService.getTagsByResourceUuid(uuid)
	res.status(200).json(tags)

})

router.get('/tags', async (req, res) => {
	let lease = req.lease
	let resources = await aclClient.findResources(lease.uuid, '00000000-0000-0000-0000-000000000000', sentiAclResourceType.tag, sentiAclPriviledge.tag.read)
	if (resources.length === 0) {
		res.status(200).json([])
		return
	}
	let resourceUUIDs = resources.map(i => i.uuid)
	let tags = await tagService.getTagsByUUIDs(resourceUUIDs)
	res.status(200).json(tags)
})

module.exports = router