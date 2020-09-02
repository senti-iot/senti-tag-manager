#!/bin/bash
# chmod 700 api-restart.sh

if [[ "$1" == "master" ]]; then
	npm install --prefix /srv/nodejs/senti/services/tagmanager/production
	systemctl restart senti-tag-manager.service
	# Senti Slack Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti Gateway MASTER updated and restarted!"}' $2
	echo
	exit 0
fi

if [[ "$1" == "dev" ]]; then
	npm install --prefix /srv/nodejs/senti/services/tagmanager/development
	systemctl restart senti-tag-manager-dev.service
	# Senti Slack Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti Gateway DEV updated and restarted!"}' $2
	echo
	exit 0
fi

exit 0


