const sentiData = require('senti-apicore').sentiData

/**
 * UI sending to Backend
 */
class Tag extends sentiData {
	uuid = null // DB
	name = false // DB
	color = null
	description = null// DB

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}
module.exports = Tag
