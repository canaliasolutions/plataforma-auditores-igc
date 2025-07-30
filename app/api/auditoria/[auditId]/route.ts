import { getAuditById } from "@/lib/filemaker"
import { validateMsalToken } from "@/lib/auth-server";

interface RouteParams {
    auditId: string;
}

export async function GET(req: Request, context: { params: RouteParams }) {
    const { params } = context;
    const authResult = await validateMsalToken(req.headers.get("Authorization") || "");
    if (!authResult.isValid) {
        return new Response(JSON.stringify({ error: authResult.error }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    const user = authResult.claims?.preferred_username ?? 'unknown_user';
    let audit;
    try {
        audit = await getAuditById(user, params.auditId);
        return new Response(JSON.stringify(audit), {status: 200});
    } catch (error) {
        return new Response(`Error fetching audits: ${error}`, {status: 500});
    }
}