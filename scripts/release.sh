#!/bin/bash

GITHUB_ACTIONS_URL="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"

echo "GitHub ссылка: $GITHUB_ACTIONS_URL"

# get tag list

TAG_LIST=$(git tag --sort=-taggerdate | tail -n 2)

if [ -z "$RELEASE_VERSION" ]
then
	"$RELEASE_VERSION" = "$(echo "$TAG_LIST" | awk '{ print $2 }')"
fi

echo "Релизная версия: ${RELEASE_VERSION}"

PREV_VERSION="$(echo "$TAG_LIST" | awk '{ print $1 }')"

if [ "$PREV_VERSION" ]
then
	echo "Предыдущая версия: ${PREV_VERSION}"
fi

CHANGELOG=$(git log "$RELEASE_VERSION".."$PREV_VERSION" --oneline)

TAGGER=$(git show "$RELEASE_VERSION" | grep "Tagger:")
TAG_DATE=$(git show "$RELEASE_VERSION" | grep "Date" | sort | tail -n 1)

echo "$TAGGER"
echo "$DATE"

CURL_DATA_CREATE_DESCRIPTION="\
Release version: $RELEASE_VERSION\n\
$TAGGER\n\
$TAG_DATE\n\
Builded on: $GITHUB_ACTIONS_URL\n\
Changelog:\n\
$CHANGELOG"

CURL_DATA_CREATE="{\
    \"summary\":\"Release $LATEST_TAG (a-shilova)\", \
    \"queue\": \"TMP\", \
    \"unique\": \"shilova-$LATEST_TAG\", \
    \"description\": \"$CURL_DATA_CREATE_DESCRIPTION\" \
}"

CURL_OAUTH="Authorization: OAuth ${YANDEX_AUTH_TOKEN}"
CURL_ORG="X-Org-Id: ${YANDEX_ORG_ID}"
CURL_HOST='https://api.tracker.yandex.net'

RESPONSE=$(curl \
   -s -o /dev/null -w "%{http_code}" \
   -X 'POST' \
   -H "$CURL_OAUTH"  \
   -H "$CURL_ORG"  \
   -H 'Content-Type: application/json' \
   --data "${CURL_DATA_CREATE}" \
  "$CURL_HOST"/v2/issues/)

echo "$RESPONSE"



