#!/bin/bash

GITHUB_ACTIONS_URL="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"

echo "GitHub ссылка: $GITHUB_ACTIONS_URL"

# get tag list

TAG_LIST=$(git tag --sort=-taggerdate | grep -E "^v*" | head -2)

if [ -z "$RELEASE_VERSION" ]
then
	RELEASE_VERSION=$(echo $TAG_LIST | awk '{ print $1 }')
fi

echo "Релизная версия: ${RELEASE_VERSION}"

if [ -z "$PREV_VERSION" ]
then
	PREV_VERSION=$(echo $TAG_LIST | awk '{ print $2 }')
fi

echo "Предыдущая версия: ${PREV_VERSION}"

CHANGELOG=$(git log ${PREV_VERSION}..${RELEASE_VERSION} --pretty=format:"%h %s (%an, %ar)\n" | tr -s "\n" " ")

TAGGER="$(git for-each-ref --format '%(taggername)' refs/tags/${RELEASE_VERSION})"
TAG_DATE="$(git for-each-ref --format '%(taggerdate)' refs/tags/${RELEASE_VERSION})"

echo "$TAGGER"
echo "$TAG_DATE"
echo "Changelog"
echo "$CHANGELOG"

YANDEX_AUTH_TOKEN="AQAAAAA-9a7zAAd5KV4boMhCLkkVhRQuHR4UPmU"
YANDEX_ORG_ID="6461097"

export CURL_OAUTH="Authorization: OAuth ${YANDEX_AUTH_TOKEN}"
export CURL_ORG="X-Org-Id: ${YANDEX_ORG_ID}"
export CURL_HOST='https://api.tracker.yandex.net'

DESC_CHANGELOG=$(echo "$CHANGELOG" | awk '{printf "%s\\n", $0}' | sed 's/"/\\"/g')

RELEASE_DESCRIPTION="\
Release version: $RELEASE_VERSION\n\
Autor: $TAGGER\n\
Date: $TAG_DATE\n\
Builded on: $GITHUB_ACTIONS_URL\n\
Changelog:\n\
$DESC_CHANGELOG"

CURL_CREATE_PARAMS="{\
\"summary\":\"Release $RELEASE_VERSION (a-shilova)\", \
\"queue\": \"TMP\", \
\"unique\": \"shilova-$RELEASE_VERSION\", \
\"description\": \"$RELEASE_DESCRIPTION\" \
}"

echo 'Создаем новую задачу для релиза...'

NEW_TASK_RESPONSE="$(curl \
-s -w "\n%{http_code}" \
-X 'POST' \
-H "$CURL_OAUTH"  \
-H "$CURL_ORG"  \
-H 'Content-Type: application/json' \
--data "${CURL_CREATE_PARAMS}" \
"$CURL_HOST"/v2/issues/)"

echo $NEW_TASK_RESPONSE

mapfile -t NEW_TASK_ARR <<< "$NEW_TASK_RESPONSE"

NEW_TASK_CODE=${NEW_TASK_ARR[-1]} # get last element (last line)

NEW_TASK_BODY=${NEW_TASK_ARR[*]::${#NEW_TASK_ARR[*]}-1} # get all elements except last
TASK_ID=$(echo $NEW_TASK_BODY | jq '.id')
export TASK_ID

if [ "$NEW_TASK_CODE" = 201 ]
then
	echo "Задача успешно создана!"
elif [ "$NEW_TASK_CODE" = 404 ]
then
	echo "Произошла ошибка: Очередь не найдена"
elif [ "$NEW_TASK_CODE" = 409 ]
then
	echo "Задача для релиза ${RELEASE_VERSION} уже создана, начинаем поиск..."

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
	echo "$TASK_ID"

	if [ -n "$TASK_ID" ]
	then
		echo "Задача для обновления найдена! Начинаем обновлять..."
		CURL_TASK_ID=${TASK_ID/\"/}
		CURL_TASK_ID=${CURL_TASK_ID/\"/}

		UPDATE_TASK_CODE="$(curl \
		   -s -o /dev/null -w "%{http_code}" \
		   -X 'PATCH' \
		   -H "$CURL_OAUTH"  \
		   -H "$CURL_ORG"  \
		   -H 'Content-Type: application/json' \
		   --data "${CURL_CREATE_PARAMS}" \
		  "$CURL_HOST"/v2/issues/"$CURL_TASK_ID")"

		if [ "$UPDATE_TASK_CODE" != 200 ]
		then
			echo "Запрос на обновление выполнен с ошибкой: ${UPDATE_TASK_CODE}"
		else
			echo "Задача успешно обновлена!"
		fi
	else
		echo "Задача для обновления не найдена!"
		exit 1
	fi
else
	echo "Запрос на создание задачи выполнен с ошибкой ${NEW_TASK_CODE}"
	exit 1
fi
