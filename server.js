#!/usr/bin/env nodejs
process.title = "senti_tag_manager"

const dotenv = require('dotenv').config()
if (dotenv.error) {
	console.warn(dotenv.error)
}
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()


const port = process.env.NODE_PORT || 3029

// App Defaults

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())


// const test = require('./services/api/test')


// ACL Client

const sentiAuthClient = require('senti-apicore').sentiAuthClient
const authClient = new sentiAuthClient(process.env.AUTHCLIENTURL, process.env.PASSWORDSALT)
module.exports.authClient = authClient

const sentiAclBackend = require('senti-apicore').sentiAclBackend
const sentiAclClient = require('senti-apicore').sentiAclClient

const aclBackend = new sentiAclBackend(process.env.ACLBACKENDTURL)
const aclClient = new sentiAclClient(aclBackend)
module.exports.aclClient = aclClient

// module.exports = {
// 	aclClient: aclClient,
// 	authClient: authClient
// }

// API endpoint imports
const auth = require('./services/api/auth')
//Tags
const createTag = require('./services/api/createTag')
const editTag = require('./services/api/editTag')
const getTags = require('./services/api/getTags')
const removeTags = require('./services/api/deleteTag')
// Resources
const getResources = require('./services/api/getResources')
// API inject into express
app.use([auth, createTag, editTag, getTags, removeTags, getResources])

//---Start the express server---------------------------------------------------

const startServer = () => {
	app.listen(port, () => {
		console.log('Senti Tag Manager Service started on port', port)
	}).on('error', (err) => {
		if (err.errno === 'EADDRINUSE') {
			console.log('Service not started, port ' + port + ' is busy')
		} else {
			console.log(err)
		}
	})
}

startServer()