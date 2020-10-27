const express = require('express')
const router = express.Router()
const rfr = require('rfr')

const { sentiAclPriviledge } = require('senti-apicore')
const { aclClient } = rfr('server')

const sentiTagService = rfr('lib/tag/tagService')
const tagService = new sentiTagService()


const typeOfPrivilege = (resourceType) => {
	switch (resourceType) {
		case 2: //Organisation
			return sentiAclPriviledge.organisation.modify
		case 4: // Group
			return sentiAclPriviledge.group.modify
		case 6: // User
			return sentiAclPriviledge.user.modify
		case 9:  // Registry
			return sentiAclPriviledge.registry.modify
		case 10: // Device Type
			return sentiAclPriviledge.deviceType.modify
		case 11: // Device
			return sentiAclPriviledge.device.modify
		case 12: // Cloud function
			return sentiAclPriviledge.cloudfunction.modify
		case 13: // Subscription
			return sentiAclPriviledge.subscription.modify
		case 15: // Dashboard
			return sentiAclPriviledge.dashboard.modify
		default:
			break
	}

}

router.delete('/delete', async (req, res) => {
	let tagUUID = req.body.tagUUID

	/*TODO: ACL */
	let result = await tagService.deleteTag(tagUUID)
	if (result && !result.error) {
		res.status(200).json(result)
	}
	if (result.error) {
		res.status(409).json()
	}
	else {
		res.status(500).json()
	}
})


router.post('/remove', async (req, res) => {
	let tagUUID = req.body.tagUUID
	let resources = req.body.resources

	let access = await Promise.all(resources.map(async r => await aclClient.testPrivileges(req.lease.uuid, r.resourceUUID, [typeOfPrivilege(r.resourceType)])))
	if (access[access.findIndex(f => f.allowed === false)]) {
		res.status(403).json()
		return
	}

	let result = await tagService.removeRTagFromResources(tagUUID, resources)
	if (result) {
		res.status(200).json(result)
	}
	else {
		res.status(500).json()
	}


})

module.exports = router