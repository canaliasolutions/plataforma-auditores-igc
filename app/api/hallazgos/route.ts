import { NextRequest, NextResponse } from 'next/server';
import {getAll, update} from '@/lib/database';
import {Hallazgo, HallazgoSchema} from "@/schemas/types";
import {create} from '@/lib/database';
import {z, ZodError} from 'zod';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');
  console.info('Atendiendo peticion: ', req);

  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const hallazgos = getAll<Hallazgo>('informe_hallazgos', 'id', auditoriaId)
    return NextResponse.json(hallazgos);
  } catch (error) {
    console.error('Error fetching hallazgos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.info('Atendiendo peticion: ', req);
    const hallazgo = HallazgoSchema.parse(data);
    const info = create('informe_hallazgos', hallazgo as Hallazgo);

    return NextResponse.json(info, { status: 201 });
  } catch (error) {
    console.error('Error creando hallazgo:', error);
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
    console.info('Atendiendo peticion: ', req);
    const hallazgo = HallazgoSchema.parse(data);

    if (!hallazgo.id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const info = update('informe_hallazgos', hallazgo.id, hallazgo as Hallazgo);

    if (info.changes === 0) {
      return NextResponse.json({ error: 'Hallazgo not found' }, { status: 404 });
    }

    const updatedHallazgo = hallazgosQueries.getById.get(id);
    return NextResponse.json(updatedHallazgo);
  } catch (error) {
    console.error('Error updating hallazgo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a hallazgo by id
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const info = hallazgosQueries.delete.run(id);

    if (info.changes === 0) {
      return NextResponse.json({ error: 'Hallazgo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hallazgo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
