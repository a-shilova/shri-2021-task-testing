#!/bin/bash

npm run test 2> TESTS.txt
COMMENT=$(cat TESTS.txt | tr -s "[" " ")
rm -rf TESTS.txt
COMMENT=$(echo "$COMMENT" | awk '{printf "%s\\n", $0}' | sed 's/"/\\"/g')


echo "Добавляем комментарий о результатах тестов релиза в задачу..."

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
		--data "{\"text\": \"${COMMENT}\"}" \
		${CURL_HOST}/v2/issues/${CURL_TASK_ID}/comments)

	if [ "$COMMENT_TASK_CODE" = 201 ]
	then
		echo "Комментарий успешно добавлен!"
	else
		echo "Возникла ошибка при добавлении комментария с кодом ${COMMENT_TASK_CODE}"
	fi
else
	echo "Задача для добавления комментария не найдена!"
fi
