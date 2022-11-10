function waitFor(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function retry(call, onRetry = () => {}, maxRetries = 10, interval = 500) {
    async function _retry(retries) {
        try {
            if (retries > 0) {
                await waitFor(interval);
            }

            return await call();
        } catch (e) {
            if (retries < maxRetries) {
                onRetry();
                return _retry(retries + 1);
            }

            console.warn('Max retries reached.');
            throw e;
        }
    }

    return _retry(0);
}
