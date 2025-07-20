import { getAuditById } from "@/lib/filemaker"
import { validateMsalToken } from "@/lib/auth-server";

export async function GET(req: Request, { params }: { params: { auditId: string } }) {
    const authResult = await validateMsalToken(req.headers.get("Authorization") || "");
    if (!authResult.isValid) {
        return new Response(JSON.stringify({ error: authResult.error }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    const user = authResult.email!;
    let audit;
    try {
        audit = await getAuditById(user, params.auditId);
        return new Response(JSON.stringify(audit), {status: 200});
    } catch (error) {
        return new Response(`Error fetching audits: ${error}`, {status: 500});
    }
}