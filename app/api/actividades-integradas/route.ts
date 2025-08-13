import { NextRequest, NextResponse } from 'next/server';
import { getAll, upsert, update } from '@/lib/database';
import { ActividadesIntegradasSchema, ActividadesIntegradasType } from "@/schemas/types";
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const auditoriaId = searchParams.get('auditoriaId');

    if (!auditoriaId) {
        return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
    }

    try {
        const actividadesIntegradas: ActividadesIntegradasType[] = await getAll<ActividadesIntegradasType>('informe_actividades_integradas', 'id_auditoria', auditoriaId);
        return NextResponse.json(actividadesIntegradas);
    } catch (error) {
        console.error('Error obteniendo actividades integradas:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const actividadesIntegradas = ActividadesIntegradasSchema.parse(data);

        const info = upsert('informe_actividades_integradas', actividadesIntegradas as ActividadesIntegradasType, 'id_auditoria');

        return NextResponse.json(info, { status: 201 });
    } catch (error) {
        console.error('Error guardando actividades integradas:', error);
        if (error instanceof ZodError) {
            return NextResponse.json({
                message: 'Cuerpo de la solicitud inválido',
                errors: error.issues,
            }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const actividadesIntegradas = ActividadesIntegradasSchema.parse(data);

        if (!actividadesIntegradas.id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        const info = update('informe_actividades_integradas', actividadesIntegradas.id, actividadesIntegradas as ActividadesIntegradasType);

        return NextResponse.json(info);
    } catch (error) {
        console.error('Error actualizando actividades integradas:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
