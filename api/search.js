
import _utils from "./_utils.js";

var SEARCH = "/search/keyword";
export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    var url = new URL(req.url);
    var qpage = url.searchParams.get("p");
    var qquery = url.searchParams.get("q");
    var p = `${process.env.API_URL}${SEARCH}`;
    var fquery = false;
    if (qpage !== null) {
        fquery = true;
        p = `${p}?page=${qpage}`;
    }
    if (qquery !== null) {
        if (fquery) {
            p = `${p}&query=${qquery}`;
        } else {
            p = `${p}?query=${qquery}`;
        }
    }
    const r = await fetch(p, _utils.FETCH_OPT);
    if (!r.ok) {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    return new Response(r.body, _utils.RES_OPT);
}
