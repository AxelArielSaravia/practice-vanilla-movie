import _utils from"./_utils.js";export const config={runtime:"edge"};export default async function(e){var t,n=new URL(e.url),s=n.searchParams.get("i"),i=n.searchParams.get("s");if(s===null)return new Response("Bad request",_utils.RES_BAD_OPT);t=`${process.env.API_URL}/movie/${s}`,i!==null&&(t+="/similar");const o=await fetch(t,_utils.FETCH_OPT);return o.ok?new Response(o.body,_utils.RES_OPT):new Response("Bad request",_utils.RES_BAD_OPT)}