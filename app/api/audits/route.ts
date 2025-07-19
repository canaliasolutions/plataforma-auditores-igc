import { getAudits } from "../../../lib/filemaker"
import { validateMsalToken, UserInfo } from "../../../lib/auth-server";

export async function GET(req: Request) {
    // const authResult = await requireAuth(req);
    // if (authResult instanceof Response) {
    //     return authResult;
    // }
    const user = "jorge.achurra@certificacionglobal.com";
    let audits;
    try {
        audits = await getAudits(user);
        return new Response(JSON.stringify(audits), {status: 200});
    } catch (error) {
        return new Response(`Error fetching audits: ${error}`, {status: 500});
    }
}

export async function requireAuth(
    request: Request,
): Promise<{ user: UserInfo } | Response> {
    const validation = await validateMsalToken(request);

    if (!validation.isValid || !validation.user) {
        return new Response(
            JSON.stringify({ error: validation.error || "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
        );
    }

    return { user: validation.user };
}