#!/bin/bash

if [[ "$1" == "master" ]]; then
	echo
	echo Deploying Senti Tag Manager $1 ...
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/tagmanager/production
	echo
	echo Restarting Senti Tag Manager service: $1 ...
	ssh deploy@rey.webhouse.net "sudo /srv/nodejs/senti/services/tagmanager/production/scripts/service-restart.sh master $3"
	echo
	echo Deployment to Senti Tag Manager $1 and restart done!
	exit 0
fi

if [[ "$1" == "dev" ]]; then
	echo
	echo Deploying Senti Tag Manager $1 ...
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/tagmanager/development
	echo
	echo Restarting Senti Tag Manager service: $1 ...
	ssh deploy@rey.webhouse.net "sudo /srv/nodejs/senti/services/tagmanager/development/scripts/service-restart.sh dev $3"
	echo
	echo Deployment to Senti Tag Manager $1 and restart done!
	exit 0
fi