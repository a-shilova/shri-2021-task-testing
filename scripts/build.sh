#!/bin/bash

docker build -t anshilova/shri-2021-task-testing:${RELEASE_VERSION} .

IS_ERROR="0"

if [ $? != 0 ]
then
	IS_ERROR="1"
fi

DOCKER_IMAGE_ID=$(docker images | grep $RELEASE_VERSION )

if [ -z $DOCKER_IMAGE_ID ]
then
	IS_ERROR="1"
fi

docker push anshilova/shri-2021-task-testing:${RELEASE_VERSION}

if [ $? != 0 ]
then
	IS_ERROR="1"
fi

if [ "$IS_ERROR" = "0" ]
then
	COMMENT='Релиз успешно собран и опубликован\nhttps://hub.docker.com/r/anshilova/shri-2021-task-testing/tags'
else
	COMMENT='Произошла ошибка при создании или публикации релиза'
fi

docker image rm "${DOCKER_IMAGE_ID}"

echo "$COMMENT"

echo "Добавляем комментарий о сборке релиза в задачу..."
YANDEX_AUTH_TOKEN="AQAAAAA-9a7zAAd5KV4boMhCLkkVhRQuHR4UPmU"
YANDEX_ORG_ID="6461097"
CURL_OAUTH="Authorization: OAuth ${YANDEX_AUTH_TOKEN}"
CURL_ORG="X-Org-Id: ${YANDEX_ORG_ID}"
CURL_HOST='https://api.tracker.yandex.net'

CURL_FIND_PARAMS="{\
\"filter\":{\
\"queue\": \"TMP\", \
\"unique\": \"shilova-$RELEASE_VERSION\"}}"

TASK_ID=$(curl \
   -s \
   -X 'POST' \
   -H "$CURL_OAUTH"  \
   -H "$CURL_ORG"  \
   -H 'Content-Type: application/json' \
   --data "${CURL_FIND_PARAMS}" \
  "$CURL_HOST"/v2/issues/_search | jq ".[].id")

if [ -n "$TASK_ID" ]
then
	echo "Задача для добавления комментария найдена! Начинаем обновлять..."
	CURL_TASK_ID=${TASK_ID/\"/}
	CURL_TASK_ID=${CURL_TASK_ID/\"/}

	COMMENT_TASK_CODE=$(curl \
		-s -o /dev/null -w "%{http_code}" \
		-X 'POST' \
		-H "$CURL_OAUTH"  \
		-H "$CURL_ORG"  \
		-H 'Content-Type: application/json' \
		--data "{\"text\": \"$COMMENT\"}" \
		${CURL_HOST}/v2/issues/${CURL_TASK_ID}/comments)

	if [ "$COMMENT_TASK_CODE" = 201 ]
	then
		echo "Комментарий успешно добавлен!"
	else
		echo "Возникла ошибка при добавлении комментария"
	fi
else
	echo "Задача для добавления комментария не найдена!"
fi
