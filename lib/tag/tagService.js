const rfr = require('rfr')
const mysqlConn = rfr('services/mysqlConn')
const { v4: uuidv4 } = require('uuid')
const Tag = rfr('lib/tag/dataClasses/Tag')

class tagService {
	db = null
	constructor() {
		this.db = mysqlConn
	}
	async createTag(tag = null) {
		if (tag === null) {
			return false
		}
		let reqTag = new Tag(tag)
		reqTag.uuid = reqTag.uuid ? reqTag.uuid : uuidv4()
		let insertSQL = `INSERT INTO tag (uuid, name, description, color) VALUES(?, ?, ?, ?);`
		let sql = this.db.format(insertSQL, [reqTag.uuid, reqTag.name, reqTag.description, reqTag.color])
		console.log(sql)
		let insertQuery = await this.db.query(insertSQL, [reqTag.uuid, reqTag.name, reqTag.description, reqTag.color])
		console.log(insertQuery)
		if (insertQuery[0].affectedRows === 1) {
			let tag = this.getTagById(insertQuery[0].insertId)
			console.log(tag)
		}
	}
	async createResourceTag(rtag = null) {
		if (rtag === null) {
			return false
		}
	 }
	async getTagById(id = null) {
		if (id === null) {
			return false
		}
	}
	async getTagByUuid(uuid = null) {
		if (uuid === null) {
			return false
		}
	 }
	async getResourceTagById(id = null) {
		if (id === null) {
			return false
		}
	 }
	async getResourceTagByUuid(uuid) {
		if (uuid === null) {
			return false
		}
	 }
}

module.exports = tagService