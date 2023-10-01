import _utils from "./_utils.js";

export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    var url = new URL(req.url);
    var qid = url.searchParams.get("id");
    var qsimilar = url.searchParams.get("similar");
    if (qid === null) {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    var p = `${process.env.API_URL}/tv/${qid}`;
    if (qsimilar !== null) {
        p += "/similar"
    }
    const r = await fetch(p, _utils.FETCH_OPT);
    if (!r.ok) {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    return new Response(r.body, _utils.RES_OPT);
}
