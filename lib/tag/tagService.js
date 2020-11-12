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

	/**
	 * @param {Object} tag
	 * @param {String} tag.name
	 * @param {String} tag.description
	 * @param {String} tag.color
	 */
	async createTag(tag = null) {
		if (tag === null) {
			return false
		}
		let reqTag = new Tag(tag)
		console.log(tag)
		console.log(reqTag)
		reqTag.uuid = reqTag.uuid ? reqTag.uuid : uuidv4()
		let insertSQL = `INSERT INTO tag (uuid, name, description, color, orgId, appId) VALUES(?, ?, ?, ?, ?, ?);`
		let sql = this.db.format(insertSQL, [reqTag.uuid, reqTag.name, reqTag.description, reqTag.color, reqTag.orgId, reqTag.appId])
		console.log(sql)
		let insertQuery = await this.db.query(insertSQL, [reqTag.uuid, reqTag.name, reqTag.description, reqTag.color, reqTag.orgId, reqTag.appId])
		console.log(insertQuery)
		if (insertQuery[0].affectedRows === 1) {

			let ftag = await this.getTagById(insertQuery[0].insertId)
			console.log('Final Tag', ftag)
			return ftag
		}
		else {
			return false
		}
	}

	/**
	 * @param {uuidv4} uuid - Tag UUID to be deleted
	 */
	async deleteTag(uuid = null) {
		if (uuid === null) {
			return false
		}
		let tag = await this.getTagByUuid(uuid)
		if (!tag) {
			return false
		}
		let rtags = await this.getRTagsByTagUUID(tag.uuid)
		if (rtags && rtags.length > 0) {
			return { error: true }
		}
		let deleteSQL = `UPDATE tag SET deleted=1 WHERE id=?;`
		let sql = await this.db.format(deleteSQL, [tag.uuid])
		console.log(sql)
		let query = await this.db.query(deleteSQL, [tag.uuid])
		if (query[0].affectedRows === 1) {
			return true
		}
		else {
			return false
		}
	}

	/**
	 * @param {Object} rtag
	 * @param {uuidv4} rtag.tagUUID
	 * @param {uuidv4} rtag.resourceUUID
	 * @param {Number} rtag.resourceType
	 */
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
		/* Check first if there is a connection already*/
		let rtagExists = await this.getRTagByTagUUIDandResourceUUID(reqtag.tagUUID, reqtag.resourceUUID)
		if (rtagExists.uuid) {
			if (rtagExists.deleted) {
				let undeleteSQL = `UPDATE tagResource
				deleted = 0
				WHERE uuid = ?;`
				let sql = await this.db.format(undeleteSQL, [rtagExists.uuid])
				console.log('Restore tag', sql)
				let undeleteQuery = await this.db.query(undeleteSQL, [rtagExists.uuid])
				console.log('Restored', undeleteQuery[0].affectedRows)
			}
			return rtagExists
		}
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

	/**
	 * @param {uuidv4} tagUUID - Tag UUID
	 * @param {uuidv4} resourceUUID - Resource UUID
	 */
	async deleteRTag(tagUUID = null, resourceUUID = null) {
		if (tagUUID === null || resourceUUID === null) {
			return false
		}
		let deleteSQL = `UPDATE tagResource SET deleted=1 WHERE tagUUID=? and resourceUUID=?;`
		let sql = await this.db.format(deleteSQL, [tagUUID, resourceUUID])
		console.log(sql)
		let query = await this.db.query(deleteSQL, [tagUUID, resourceUUID])
		if (query[0].affectedRows === 1) {
			return true
		}
		else {
			return false
		}
	}

	/**
	 * @param {Number} id - Tag internal ID
	 */
	async getTagById(id = null) {
		if (id === null) {
			return false
		}
		let selectSQL = `SELECT id, uuid, name, description, color, appId, orgId FROM tag t where id=?`
		let selectQuery = await this.db.query(selectSQL, [id])
		return new Tag(selectQuery[0][0])
	}

	/**
	 * @param {uuidv4} uuid - Tag UUID
	 */
	async getTagByUuid(uuid = null) {
		if (uuid === null) {
			return false
		}
		let selectSQL = 'SELECT id, uuid, name, description, color FROM tag where uuid=?'
		let selectQuery = await this.db.query(selectSQL, [uuid])
		return new Tag(selectQuery[0][0])
	}

	/**
	 * @param {Number} id - Tag Resource internal id
	 */
	async getResourceTagById(id = null) {
		if (id === null) {
			return false
		}
		let selectSQL = 'SELECT id, uuid, tagUUID, resourceUUID, resourceType FROM tagResource where id=?'
		let selectQuery = await this.db.query(selectSQL, [id])
		return new ResourceTag(selectQuery[0][0])
	}

	/**
	 * @param {uuidv4} uuid - Tag Resource UUID
	 */
	async getResourceTagByUuid(uuid) {
		if (uuid === null) {
			return false
		}
		let selectSQL = 'SELECT id, uuid, tagUUID, resourceUUID, resourceType FROM tagResource where uuid=?'
		let selectQuery = await this.db.query(selectSQL, [uuid])
		return new ResourceTag(selectQuery[0][0])
	}

	/**
	 * @param {uuidv4} uuid - Tag UUID
	 */
	async getRTagsByTagUUID(tagUUID = null) {
		if (tagUUID === null) {
			return false
		}
		let selectSQL = `SELECT * from tagResource where tagUUID = ?`
		let selectQuery = await this.db.query(selectSQL, [tagUUID])
		return selectQuery[0].map(r => new ResourceTag(r))
	}

	/**
	 * @param {uuidv4} tagUUID
	 * @param {uuidv4} resourceUUID
	 */
	async getRTagByTagUUIDandResourceUUID(tagUUID = null, resourceUUID = null) {
		if (tagUUID === null || resourceUUID === null) {
			return false
		}
		let selectSQL = `SELECT * from tagResource where tagUUID = ? and resourceUUID = ?`
		let selectQuery = await this.db.query(selectSQL, [tagUUID, resourceUUID])
		return new ResourceTag(selectQuery[0][0])
	}

	/**
	 * @param {uuidv4} uuid
	 */
	async getTagsByResourceUuid(uuid = null) {
		if (uuid === null) {
			return false
		}
		let selectSQL = `SELECT * from tag t
						 INNER JOIN tagResource tr on t.uuid = tr.tagUUID
						 WHERE tr.resourceUUID = ? and tr.deleted = 0`
		let selectQuery = await this.db.query(selectSQL, [uuid])
		console.log('selectQuery', selectQuery)

		return selectQuery[0].map(t => (new Tag(t)))
	}

	/**
	 * @param {uuidv4} uuid - Tag UUID
	 * @param {Array.<{resourceUUID: uuidv4, resourceType: Number }>} resources - Resources
	 */
	async addRTagToResources(uuids, resources) {
		if (uuids === null) {
			return false
		}

		// let ftag = await this.getTagByUuid(uuid)
		let addRtags = [].concat.apply([], resources.map(r => {
			return uuids.map(u => ({
				tagUUID: u,
				resourceUUID: r.resourceUUID,
				resourceType: r.resourceType
			})
			)
		}))

		// let rtags = resources.map(r => ({
		// 	tagUUID: ftag.uuid,
		// 	resourceUUID: r.resourceUUID,
		// 	resourceType: r.resourceType
		// }))
		let frtags = await Promise.all(addRtags.map(async r => await this.createResourceTag(r)))
		// let frtag = await this.createResourceTag(rtag)
		console.log(frtags)
		return frtags
	}

	/**
	 * @desc Remove connection between tag and resource
	 * @param {uuidv4} uuid - Tag uuid
	 * @param {Array.<{resourceUUID: uuidv4, resourceType: Number}>} resources - Resources
	 */
	async removeRTagFromResources(uuid, resources) {
		if (uuid === null) {
			return false
		}

		let ftag = await this.getTagByUuid(uuid)
		if (!ftag) {
			return false
		}
		let rtags = await Promise.all(resources.map(async r => await this.getRTagByTagUUIDandResourceUUID(ftag.uuid, r.resourceUUID)))
		console.log(rtags)
		let deleted = await Promise.all(rtags.map(async rtag => await this.deleteRTag(rtag.tagUUID, rtag.resourceUUID)))
		console.log('Deleted Resource Tags', deleted)
		return deleted
	}
	async removeAllTagsFromResource(resourceUUID = null) {
		if (resourceUUID === null) {
			return false
		}
		let deleteSQL = `UPDATE tagResource SET deleted=1 WHERE resourceUUID=?;`
		let sql = await this.db.format(deleteSQL, [resourceUUID])
		console.log(sql)
		let query = await this.db.query(deleteSQL, [resourceUUID])
		if (query[0].affectedRows === 1) {
			return true
		}
		else {
			return false
		}
	}
	/**
	 * @desc Replace all tags with the tags
	 * @param {Array<uuidv4>} uuids - Tags to replace
	 * @param {Array.<{resourceUUID: uuidv4, resourceType: Number}>} resources - Resources
	 */
	async replaceTags(uuids, resources) {
		//Remove all tags from resources
		let removeAllTags = await Promise.all(await resources.map(async r => await this.removeAllTagsFromResource(r.resourceUUID)))
		console.log(removeAllTags)
		//Add new tags to resources

		let addRtags = [].concat.apply([], resources.map(r => {
			return uuids.map(u => ({
				tagUUID: u,
				resourceUUID: r.resourceUUID,
				resourceType: r.resourceType
			})
			)
		}))
		let createRTags = await Promise.all(addRtags.map(async rtag => await this.createResourceTag(rtag)))
		return createRTags
	}
	/**
	 * @desc Get tags by uuids
	 * @param {Array<uuidv4>} uuids
	 */
	async getTagsByUUIDs(uuids) {
		let tags = await Promise.all(uuids.map(async u => {
			return await this.getTagByUuid(u)
		}))
		console.log(tags)
		return tags
	}

	/**
	 * @desc Get tags by Org Id and appId
	 * @param {ing} appId
	 * @param {int} orgId
	 */
	async getTagsByAppIdOrgId(appId, orgId) {
		let sql = `SELECT * from tag where appId=? and orgId=?`
		let format = await this.db.format(sql, [appId, orgId])
		console.log(format)
		let query = await this.db.query(sql, [appId, orgId])
		let tags = []
		console.log(query)
		if (query[0].length > 0) {
			tags = query[0].map(t => new Tag(t))
		}
		return tags
	}
}

module.exports = tagService