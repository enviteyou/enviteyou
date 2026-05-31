export async function getRecaptchaToken(action) {
	const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

	if (!siteKey) {
		throw new Error("reCAPTCHA site key is not configured.");
	}

	if (typeof window === "undefined" || !window.grecaptcha) {
		throw new Error("reCAPTCHA is not ready yet.");
	}

	return new Promise((resolve, reject) => {
		window.grecaptcha.ready(async () => {
			try {
				const token = await window.grecaptcha.execute(siteKey, { action });
				resolve(token);
			} catch (error) {
				reject(error);
			}
		});
	});
}