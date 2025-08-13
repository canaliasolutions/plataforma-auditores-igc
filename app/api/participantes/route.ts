import { NextRequest, NextResponse } from 'next/server';
import { getAll, create, update, remove } from '@/lib/database';
import { Participante, ParticipanteSchema } from "@/schemas/types";
import { ZodError } from 'zod';

// GET: Obtener todos los participantes de una auditoría
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');

  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }
  try {
    const participantes: Participante[] = await getAll<Participante>('informe_participantes', 'id_auditoria', auditoriaId);
    return NextResponse.json(participantes);
  } catch (error) {
    console.error('Error fetching participantes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Agregar un nuevo participante
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const participante = ParticipanteSchema.parse(data);
    const info = create('informe_participantes', participante as Participante);

    return NextResponse.json(info, { status: 201 });
  } catch (error) {
    console.error('Error creando participante:', error);
    if (error instanceof ZodError) {
      return NextResponse.json({
        message: 'Cuerpo de la solicitud inválido',
        errors: error.issues,
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Actualizar un participante existente
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const participante = ParticipanteSchema.parse(data);

    if (!participante.id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const info = update('informe_participantes', participante.id, participante as Participante);

    return NextResponse.json(info);
  } catch (error) {
    console.error('Error updating participante:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Borrar un participante
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const info = remove('informe_participantes', id);
    if (!info) {
      return NextResponse.json({ error: 'Participante not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error borrando participante:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
