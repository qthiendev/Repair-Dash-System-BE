require('dotenv').config();

const zalopay = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY_1,
    key2: process.env.ZALOPAY_KEY_2,
    endpoint: process.env.ZALOPAY_CREATE_ENDPOINT,
    endpoint_query: process.env.ZALOPAY_QUERY_ENDPOINT,
    callback: process.env.ZALOPAY_REDIRECT_URL,
}

module.exports = zalopay;
