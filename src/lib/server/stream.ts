const TIME_TO_RESOLVE_MS = 200;

function _delay(ms: number) {
	return new Promise((res) => setTimeout(res, ms));
}

export async function streamSlow<T>(promise: Promise<T>, delay: number = TIME_TO_RESOLVE_MS) {
	return (await Promise.race([_delay(delay), promise])) as T | Promise<T>;
}
