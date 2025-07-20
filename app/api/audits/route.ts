import { validateMsalToken } from "@/lib/auth-server";
import { getAudits } from "@/lib/filemaker";

export async function GET(req: Request) {
    const authResult = await validateMsalToken(req.headers.get("Authorization") || "");
    if (!authResult.isValid) {
        return new Response(JSON.stringify({ error: authResult.error }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    const user = authResult.claims?.preferred_username ?? 'unknown_user';
    let audits;
    try {
        audits = await getAudits(user);
        return new Response(JSON.stringify(audits), {status: 200});
    } catch (error) {
        return new Response(`Error fetching audits: ${error}`, {status: 500});
    }
}