import { NextRequest, NextResponse } from 'next/server';
import { getAll, upsert, update } from '@/lib/database';
import { ConclusionSchema, Conclusion } from "@/schemas/types";
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');

  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const conclusiones: Conclusion[] = await getAll<Conclusion>('informe_conclusiones', 'id_auditoria', auditoriaId);
    return NextResponse.json(conclusiones);
  } catch (error) {
    console.error('Error obteniendo conclusiones:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const conclusiones = ConclusionSchema.parse(data);

    const info = upsert('informe_conclusiones', conclusiones as Conclusion, 'id_auditoria');

    return NextResponse.json(info, { status: 201 });
  } catch (error) {
    console.error('Error guardando conclusiones:', error);
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
    const conclusiones = ConclusionSchema.parse(data);

    if (!conclusiones.id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const info = update('informe_conclusiones', conclusiones.id, conclusiones as Conclusion);

    return NextResponse.json(info);
  } catch (error) {
    console.error('Error actualizando conclusiones:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
