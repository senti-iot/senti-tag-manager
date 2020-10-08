const express = require('express')
const router = express.Router()
const rfr = require('rfr')

const sentiTagService = rfr('lib/tag/tagService')
const tagService = new sentiTagService()

router.get('/tags/:resourceUUID', async (req, res) => {

	let uuid = req.params.resourceUUID
	let tags = await tagService.getTagsByResourceUuid(uuid)
	res.status(200).json(tags)

})

module.exports = router