export async function POST(req: Request) {
	const { phoneNumber, code } = await req.json();
	console.log(`Received code ${code} for phone number ${phoneNumber}`);
	return new Response();
}
