const sentiData = require('senti-apicore').sentiData

/**
 * UI sending to Backend
 */
class ResourceTag extends sentiData {
	uuid = null
	tagUUID = null
	resourceUUID = null
	resourceType = 0

	/* Resource Types IDs
	aclorg	1
	org	2
	groups	3
	group	4
	deviceType	10
	users	5
	device	11
	subscription	13
	cloudFunction	12
	dashboards	14
	dashboard	15
	user	6
	appui	7
	registry	9
	devices	8
	*/

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}
module.exports = ResourceTag
