import { NextRequest, NextResponse } from 'next/server';
import { hallazgosQueries } from '@/lib/database';
import {Hallazgo} from "@/types/tipos";

// GET: Fetch all hallazgos for a specific audit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');

  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const hallazgosRaw = hallazgosQueries.getAll.all(auditoriaId);
    const hallazgos: Hallazgo[] = hallazgosRaw.map(
        (row: { clausula_id: string; clausula_label: string; [key: string]: unknown }) => {
          const { clausula_id, clausula_label, ...hallazgo } = row;
          return {
            ...hallazgo,
            clausula: {
              value: clausula_id || '',
              label: clausula_label || ''
            }
          };
        }
    );
    return NextResponse.json(hallazgos);
  } catch (error) {
    console.error('Error fetching hallazgos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add a new hallazgo
export async function POST(req: NextRequest) {
  try {
    const { auditoriaId, evidencia, descripcion, norma, clausula, tipo, severidad, fechaEncontrado } = await req.json();

    if (!auditoriaId || !evidencia || !clausula || !tipo || !norma) {
      return NextResponse.json({
        error: 'auditoriaId, evidencia, clausula and tipo are required'
      }, { status: 400 });
    }

    const info = hallazgosQueries.create.run(
      auditoriaId,
      evidencia,
      descripcion || '',
      norma,
      clausula.value,
      clausula.label,
      tipo,
      severidad,
      fechaEncontrado || new Date().toISOString().split('T')[0]
    );

    const newHallazgo = hallazgosQueries.getById.get(info.lastInsertRowid);
    return NextResponse.json(newHallazgo, { status: 201 });
  } catch (error) {
    console.error('Error creating hallazgo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a hallazgo by id
export async function PUT(req: NextRequest) {
  try {
    const { id, evidencia, descripcion, norma, clausula, tipo, severidad, fechaResuelto } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const info = hallazgosQueries.update.run(
      evidencia,
      descripcion,
      norma,
      clausula.value,
      clausula.label,
      tipo,
      severidad,
      fechaResuelto,
      id
    );

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
