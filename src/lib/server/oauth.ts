import { Slack } from 'arctic';
import { env } from '$env/dynamic/private';

export const slack = new Slack(
	env.SLACK_CLIENT_ID,
	env.SLACK_CLIENT_SECRET,
	env.SLACK_REDIRECT_URI
);
