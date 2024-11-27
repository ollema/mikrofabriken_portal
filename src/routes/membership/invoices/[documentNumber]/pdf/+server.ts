import { getUser } from '$lib/server/auth';
import { getMember, parseMemberList } from '$lib/server/members';
import { downloadInvoicePdf, getInvoice } from '$lib/server/fortnox';

export async function GET({ locals, params, url }) {
	const user = getUser(locals, url);
	const members = parseMemberList();
	const member = getMember(members, user.email);

	// get the invoice from Fortnox
	await getInvoice(params.documentNumber, member, user.role as 'admin' | 'user');

	// download the PDF
	const pdf = await downloadInvoicePdf(params.documentNumber);

	// return the PDF as a response
	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="invoice_${params.documentNumber}.pdf"`
		}
	});
}
