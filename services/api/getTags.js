const express = require('express')
const router = express.Router()
const rfr = require('rfr')

const sentiDatabrokerCoreService = require('../../lib/databrokerCore/sentiCoreService')
const sentiDataCore = new sentiDatabrokerCoreService()

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
	let appId = req.headers.appid
	let orgId = await sentiDataCore.getOrganisationIdByUserUUID(lease.uuid)
	let aclOrgResources = await sentiDataCore.getAclOrgResourcesOnName(orgId)
	console.log('OrgId', orgId)
	console.log('aclOrgResource', aclOrgResources)
	if (!aclOrgResources) {
		res.status(500).json()
	}
	let resources = await aclClient.findResources(lease.uuid, '00000000-0000-0000-0000-000000000000', sentiAclResourceType.tag, sentiAclPriviledge.tag.read)
	console.log(resources)
	// if (resources.length === 0) {
	// res.status(200).json([])
	// return
	// }
	// let resourceUUIDs = resources.map(i => i.uuid)
	// let tags = await tagService.getTagsByUUIDs(resourceUUIDs)
	let tags = await tagService.getTagsByAppIdOrgId(appId, orgId)
	res.status(200).json(tags)
})

module.exports = router