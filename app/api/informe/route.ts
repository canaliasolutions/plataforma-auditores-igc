import {NextRequest, NextResponse} from "next/server";
import {subirInforme} from "@/lib/filemaker"

export async function POST(req: NextRequest) {
    const {
        auditoria
    } = await req.json();
    try {

        if (!auditoria) {
            return NextResponse.json({
                error: 'Falta el campo auditoria'
            }, { status: 400 });
        }
        await subirInforme(auditoria)
        return NextResponse.json({ success: `Informe subido exitosamente` }, { status: 200 });
    } catch (error) {
        console.error('Error subiendo informe para auditoria:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
