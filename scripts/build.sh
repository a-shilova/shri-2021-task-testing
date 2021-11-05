#!/bin/bash

#docker build -t anshilova/shri-2021-task-testing:${RELEASE_VERSION} .

IS_ERROR=0

#if [ $? != 0 ]
#then
#	IS_ERROR=1
#fi
#
#DOCKER_IMAGE_ID=$(docker images | grep shri-2021-task-testing | awk '{ print $3 }')
#
#if [ -z $DOCKER_IMAGE_ID ]
#then
#	IS_ERROR=1
#fi
#
#docker push anshilova/shri-2021-task-testing:${RELEASE_VERSION}
#
#if [ $? != 0 ]
#then
#	IS_ERROR=1
#fi

if [ IS_ERROR = 0 ]
then
	COMMENT='Релиз успешно собран и опубликован\nhttps://hub.docker.com/r/anshilova/shri-2021-task-testing/tags'
else
	COMMENT='Произошла ошибка при создании или публикации релиза'
fi

docker image rm "${DOCKER_IMAGE_ID}"

echo "$COMMENT"

echo "Добавляем комментарий о сборке релиза в задачу..."

echo CURL_HOST
echo TASK_ID

#COMMENT_TASK_CODE=$(curl \
#    -sS \
#    -X 'POST' \
#    -H "$CURL_OAUTH"  \
#    -H "$CURL_ORG"  \
#    -H 'Content-Type: application/json' \
#    --data "{\"text\": \"$COMMENT\"}" \
#    ${CURL_HOST}/v2/issues/${TASK_ID}/comments)

