import { getAuditById } from "@/lib/filemaker"
import { validateMsalToken } from "@/lib/auth-server";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const auditoriaId = searchParams.get('auditoriaId') || '';
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
        audit = await getAuditById(user, auditoriaId);
        return new Response(JSON.stringify(audit), {status: 200});
    } catch (error) {
        return new Response(`Error obteniendo auditorias: ${error}`, {status: 500});
    }
}