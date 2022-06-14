const baseUrl = process.env.API_URL;

export const fetchSpeakers = async (customerId, language, params = {}) => {
    if (!language) {
        console.error('Speechki Widget: book_language is undefined');
        return;
    }

    if (!customerId) {
        console.error('Speechki Widget: customer_id is undefined');
        return;
    }

    params = {
        page_size: 1000,
        book_language: language,
        ...params,
    };

    const url = new URL(baseUrl + `/speech_settings/speakers_by_customer/${customerId}/`);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Speakers request unseccessful');
    }

    const speakers = await response.json();
    return speakers;
};
