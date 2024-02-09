const fetchWithRetry = async (
    input: URL | RequestInfo,
    init?: RequestInit | undefined,
    retries?: number
): ReturnType<typeof fetch> => {
    const response = await fetch(input, init)

    if (response.status === 429 && retries && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        return fetchWithRetry(input, init, retries - 1)
    }

    return response
}

export default fetchWithRetry
