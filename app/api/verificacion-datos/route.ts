import { NextRequest, NextResponse } from 'next/server';
import { getAll, create, update } from '@/lib/database';
import { VerificacionDatosSchema, VerificacionDatos } from "@/schemas/types";
import { ZodError } from 'zod';

// GET: Fetch data verification for a specific audit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');

  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const verificacion: VerificacionDatos[] = await getAll<VerificacionDatos>('informe_verificacion_datos', 'id_auditoria', auditoriaId);

    if (!verificacion || verificacion.length === 0) {
      return NextResponse.json({
        auditoria_id: auditoriaId,
        datos_contacto: 'correcto',
        datos_alcance: 'correcto',
        datos_facturacion: 'correcto',
        comentarios_verificacion: ''
      });
    }

    return NextResponse.json(verificacion[0]);
  } catch (error) {
    console.error('Error fetching data verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Save or update data verification
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const verificacion = VerificacionDatosSchema.parse(data);

    const info = create('verificacion_datos', verificacion as VerificacionDatos);

    return NextResponse.json(info, { status: 201 });
  } catch (error) {
    console.error('Error saving data verification:', error);
    if (error instanceof ZodError) {
      return NextResponse.json({
        message: 'Cuerpo de la solicitud inválido',
        errors: error.issues,
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update data verification
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const verificacion = VerificacionDatosSchema.parse(data);

    if (!verificacion.id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const info = update('verificacion_datos', verificacion.id, verificacion as VerificacionDatos);

    return NextResponse.json(info);
  } catch (error) {
    console.error('Error updating data verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
