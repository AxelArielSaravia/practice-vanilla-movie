if (!process.env.API_KEY || !process.env.API_URL) {
    throw Error("Missing env variables");
}

export default {
    FETCH_OPT: {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`
        }
    },
    RES_OPT: {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    },
    RES_BAD_OPT: {
        status: 404
    },
};
