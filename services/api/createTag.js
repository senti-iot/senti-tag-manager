const express = require('express')
const router = express.Router()
const rfr = require('rfr')
const { sentiAclPriviledge, /* sentiAclResourceType */ } = require('senti-apicore')
const { aclClient, authClient } = require('../../server')

const sentiTagService = rfr('lib/tag/tagService')
console.log(sentiTagService)
const tagService = new sentiTagService()

router.all('*', async (req, res, next) => {

	let lease = await authClient.getLease(req)
	if (lease === false) {
		res.status(401).json()
		return
	}
	req.lease = lease
	next()
})

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
			break;
	}

}

router.post('/create', async (req, res) => {
	try {
		console.log('Entered')
		let tag = req.body.tag
		let resourceTag = {
			resourceUUID: req.body.resourceUUID,
			resourceType: req.body.resourceType
		}

		let access = await aclClient.testPrivileges(req.lease.uuid, resourceTag.resourceUUID, [typeOfPrivilege(resourceTag.resourceType)])
		if (access.allowed === false) {
			res.status(403).json()
			return
		}
		let result = await tagService.createTag(resourceTag, tag)
		if (result) {
			res.status(200).json(result)
		}
		else {
			res.status(500).json()
		}
	}
	catch (e) {
		console.log(e)
		res.status(500).json(e)
	}
})

module.exports = router