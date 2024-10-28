import _utils from "./_utils.js";

var SEARCH = "?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";
export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    var url = new URL(req.url);
    var qtype = url.searchParams.get("t");
    var qpage = url.searchParams.get("p");
    var qgenre = url.searchParams.get("g");
    var qcast = url.searchParams.get("ca");
    var qcrew = url.searchParams.get("cr");
    var qcompany = url.searchParams.get("co");
    if (qtype !== "movie" && qtype !== "tv") {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    var p = `${process.env.API_URL}/discover/${qtype}${SEARCH}`;
    if (qpage !== null) {
        p = `${p}&page=${qpage}`;
    }
    if (qgenre !== null) {
        p = `${p}&with_genres=${qgenre}`;
    } else if (qcast !== null) {
        p = `${p}&with_cast=${qcast}`;
    } else if (qcrew !== null) {
        p = `${p}&with_crew=${qcrew}`;
    } else if (qcompany !== null) {
        p = `${p}&with_companies=${qcompany}`;
    }
    const r = await fetch(p, _utils.FETCH_OPT);
    if (!r.ok) {
        return new Response("Bad request", _utils.RES_BAD_OPT);
    }
    return new Response(r.body, _utils.RES_OPT);
}
