#!/bin/bash
set -e

# colored output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "Running script 'entrypoint.sh':\n"

check_env_var() {
    local var_name=$1
    if [ -z "${!var_name}" ]; then
        echo -e "${RED}${var_name} is not set${NC}"
        return 1
    fi
    return 0
}

echo "Checking if all environment variables are set..."

# ------------------------------------------------------------------------------
# auth configuration
# ------------------------------------------------------------------------------
check_env_var "SLACK_CLIENT_ID" || exit 1
check_env_var "SLACK_CLIENT_SECRET" || exit 1
check_env_var "SLACK_REDIRECT_URI" || exit 1
check_env_var "SLACK_TEAM_ID" || exit 1

# ------------------------------------------------------------------------------
# admins (should match slackEmail entries in members.json)
# ------------------------------------------------------------------------------
check_env_var "ADMINS" || exit 1

# ------------------------------------------------------------------------------
# fortnox
# ------------------------------------------------------------------------------
check_env_var "FORTNOX_ACCESS_TOKEN" || exit 1
check_env_var "FORTNOX_CLIENT_SECRET" || exit 1

# ------------------------------------------------------------------------------
# gitlab
# ------------------------------------------------------------------------------
check_env_var "GITLAB_HOST" || exit 1

# ufpersonslist repo
check_env_var "UFPERSONSLIST_REPO_PATH" || exit 1
check_env_var "UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN" || exit 1
check_env_var "UFPERSONSLIST_GITLAB_PROJECT_ID" || exit 1

# ------------------------------------------------------------------------------
# sqlite3 database
# ------------------------------------------------------------------------------
check_env_var "DB_PATH" || exit 1

# ------------------------------------------------------------------------------
# uf cog API
# ------------------------------------------------------------------------------
check_env_var "UF_COG_BASE_URL" || exit 1

# ------------------------------------------------------------------------------
# new member form secret key
# ------------------------------------------------------------------------------
check_env_var "UF_NEW_MEMBER_KEY" || exit 1

# ------------------------------------------------------------------------------
# links
# ------------------------------------------------------------------------------
check_env_var "LOOTMOBIL_LINK" || exit 1
check_env_var "LOOTSLAP_LINK" || exit 1
check_env_var "DRIVE_LINK" || exit 1

echo -e "${GREEN}All environment variables are set!${NC}\n"

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
