#!/bin/bash
set -e

# colored output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "Running script 'entrypoint.sh':\n"

# ensure that environment variables are set
echo "Checking if environment variables are set..."
if [ -z "$GITLAB_HOST" ]; then
  echo -e "${RED}GITLAB_HOST is not set${NC}\n"
  exit 1
fi
if [ -z "$UFPERSONSLIST_REPO_PATH" ]; then
  echo -e "${RED}UFPERSONSLIST_REPO_PATH is not set${NC}\n"
  exit 1
fi
if [ -z "$UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN" ]; then
  echo -e "${RED}UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN is not set${NC}\n"
  exit 1
fi
if [ -z "$UFPERSONSLIST_GITLAB_PROJECT_ID" ]; then
  echo -e "${RED}UFPERSONSLIST_GITLAB_PROJECT_ID is not set${NC}\n"
  exit 1
fi
echo -e "${GREEN}Environment variables are set!${NC}\n"

# ensure that GITLAB_HOST can be reached
echo -e "Checking if GitLab is reachable at GITLAB_HOST: ${GITLAB_HOST}..."
RESPONSE=$(curl -L --write-out "%{http_code}\n" --silent --output /dev/null "$GITLAB_HOST")
if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}GitLab is reachable at $GITLAB_HOST!${NC}\n"
else
    echo -e "${RED}GitLab is not reachable at $GITLAB_HOST${NC}\n"
    exit 1
fi

# function to clear a directory
clear_directory() {
  local dir_path=$1
  if [ -d "$dir_path" ]; then
    echo -e "Removing directory: ${dir_path}..."
    rm -rf "${dir_path}"
  fi
  echo -e "Creating directory: ${dir_path}..."
  mkdir -p "$dir_path"
}

# clone ufpersonslist repo into UFPERSONSLIST_REPO_PATH
echo -e "Cloning ufpersonslist repo into UFPERSONSLIST_REPO_PATH: ${UFPERSONSLIST_REPO_PATH}..."
clear_directory "${UFPERSONSLIST_REPO_PATH}"
if git clone \
  "http://gitlab-bot-user:${UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN}@${GITLAB_HOST}/mikrofabriken/ufpersonslist.git" \
  "${UFPERSONSLIST_REPO_PATH}"
then
    echo -e "${GREEN}Clone successful!${NC}\n"
else
    echo -e "${RED}Clone failed${NC}\n"
    exit 1
fi

# ensure that ufpersonslist repo is cloned by checking for the existence of the members.json file
echo -e "Checking if ${UFPERSONSLIST_REPO_PATH}/members.json exists..."
if [ -f "${UFPERSONSLIST_REPO_PATH}/members.json" ]; then
    echo -e "${GREEN}${UFPERSONSLIST_REPO_PATH}/member.json exists!${NC}\n"
else
    echo -e "${RED}${UFPERSONSLIST_REPO_PATH}/members.json does not exist${NC}\n"
    exit 1
fi

# configure git for ufpersonslist repo
echo "Configuring git..."
pushd "${UFPERSONSLIST_REPO_PATH}" > /dev/null
git config user.email "no-reply+portal@mikrofabriken.se"
git config user.name "Portal"
popd > /dev/null
echo -e "${GREEN}Git configured!${NC}\n"

# start node server
echo -e "${GREEN}Starting node server...${NC}"
node build
