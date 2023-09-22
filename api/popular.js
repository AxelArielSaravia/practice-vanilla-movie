import _utils from "./_utils.js";

export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    var url = new URL(req.url);
    var qtype = url.searchParams.get("type");
    var qpage = url.searchParams.get("page");
    if (qtype !== "movie" && qtype !== "tv") {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    var p = `${process.env.API_URL}/${qtype}/popular?include_adult=false&sort_by=popularity.asc`;
    if (qpage) {
        p = `${p}&page=${qpage}`;
    }
    const r = await fetch(p, _utils.FETCH_OPT);
    if (!r.ok) {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    return new Response(r.body, _utils.RES_OPT);
}
