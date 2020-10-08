const rfr = require('rfr')
const mysqlConn = rfr('services/mysqlConn')
const { v4: uuidv4 } = require('uuid')
const Tag = rfr('lib/tag/dataClasses/Tag')
const ResourceTag = rfr('lib/tag/dataClasses/ResourceTag')

class tagService {
	db = null
	constructor() {
		this.db = mysqlConn
	}
	async createTag(resourceTag = null, tag = null) {
		if (tag === null || resourceTag === null) {
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
			let ftag = await this.getTagById(insertQuery[0].insertId)
			console.log('Final Tag', ftag)
			if (ftag) {
				let rtag = {
					tagUUID: ftag.uuid,
					resourceUUID: resourceTag.resourceUUID,
					resourceType: resourceTag.resourceType
				}
				console.log(ftag.uuid)
				let frtag = await this.createResourceTag(rtag)
				if (frtag.tagUUID === ftag.uuid) {
					return ftag
				}
			}
			else {
				return false
			}
		}
		else {
			return false
		}
	}
	async createResourceTag(rtag = null) {
		if (rtag === null) {
			return false
		}
		let reqtag = new ResourceTag({

			tagUUID: rtag.tagUUID,
			resourceUUID: rtag.resourceUUID,
			resourceType: rtag.resourceType
		})
		reqtag.uuid = reqtag.uuid ? reqtag.uuid : uuidv4()
		let insertSQL = `INSERT INTO tagResource (uuid, tagUUID, resourceUUID, resourceType) VALUES(?, ?, ?, ?);`
		console.log('ResourceTag', reqtag)
		let sql = await this.db.format(insertSQL, [reqtag.uuid, reqtag.tagUUID, reqtag.resourceUUID, reqtag.resourceType])
		console.log(sql)
		let insertQuery = await this.db.query(insertSQL, [reqtag.uuid, reqtag.tagUUID, reqtag.resourceUUID, reqtag.resourceType])
		if (insertQuery[0].affectedRows === 1) {
			let frtag = await this.getResourceTagById(insertQuery[0].insertId)
			console.log(frtag)
			if (frtag) {
				return frtag
			}
			else {
				return false
			}
		}
		else {
			return false
		}
	 }
	async getTagById(id = null) {
		if (id === null) {
			return false
		}
		let selectSQL = 'SELECT id, uuid, name, description, color FROM tag where id=?'
		let selectQuery = await this.db.query(selectSQL, [id])
		return new Tag(selectQuery[0][0])
	}
	async getTagByUuid(uuid = null) {
		if (uuid === null) {
			return false
		}
		let selectSQL = 'SELECT id, uuid, name, description, color FROM tag where uuid=?'
		let selectQuery = await this.db.query(selectSQL, [uuid])
		return new Tag(selectQuery[0][0])
	 }
	async getResourceTagById(id = null) {
		if (id === null) {
			return false
		}
		let selectSQL = 'SELECT id, uuid, tagUUID, resourceUUID, resourceType FROM tagResource where id=?'
		let selectQuery = await this.db.query(selectSQL, [id])
		return new ResourceTag(selectQuery[0][0])
	 }
	async getResourceTagByUuid(uuid) {
		if (uuid === null) {
			return false
		}
		let selectSQL = 'SELECT id, uuid, tagUUID, resourceUUID, resourceType FROM tagResource where uuid=?'
		let selectQuery = await this.db.query(selectSQL, [uuid])
		return new ResourceTag(selectQuery[0][0])
	 }
}

module.exports = tagService