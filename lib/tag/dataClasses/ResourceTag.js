const sentiData = require('senti-apicore').sentiData

/**
 * UI sending to Backend
 */
class ResourceTag extends sentiData {
	uuid = null
	tagUUID = null
	resourceUUID = null
	resourceType = 0
	deleted = 0

	/* Resource Types IDs
	aclorg			1
	org				2
	groups			3
	group			4
	users			5
	user			6
	appui			7
	devices			8
	registry		9
	deviceType		10
	device			11
	cloudFunction	12
	subscription	13
	dashboards		14
	dashboard		15
	*/

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}
module.exports = ResourceTag
