import { Slack } from 'arctic';
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } from '$env/static/private';

export const slack = new Slack(SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI);
