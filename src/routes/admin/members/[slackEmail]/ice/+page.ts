import { redirect } from '@sveltejs/kit';

export const load = ({ params }) => {
	redirect(302, `/admin/members/${params.slackEmail}`);
};
