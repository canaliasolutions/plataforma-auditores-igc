import { NextRequest, NextResponse } from 'next/server';
import { hallazgosQueries } from '@/lib/database';

// GET: Fetch all hallazgos for a specific audit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');

  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const hallazgosRaw = hallazgosQueries.getAll.all(auditoriaId);
    const hallazgos = hallazgosRaw.map(({ clausula_id, clausula_label, ...hallazgo }) => ({
      ...hallazgo,
      clausula: {
        value: clausula_id || '',
        label: clausula_label || ''
      }
    }));
    return NextResponse.json(hallazgos);
  } catch (error) {
    console.error('Error fetching hallazgos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add a new hallazgo
export async function POST(req: NextRequest) {
  try {
    const { auditoriaId, evidencia, descripcion, clausula, type, severidad, fechaEncontrado } = await req.json();

    if (!auditoriaId || !evidencia || !clausula || !type) {
      return NextResponse.json({
        error: 'auditoriaId, evidencia, clausula and type are required'
      }, { status: 400 });
    }

    const info = hallazgosQueries.create.run(
      auditoriaId,
      evidencia,
      descripcion || '',
      clausula.value,
      clausula.label,
      type,
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
    const { id, evidencia, descripcion, clausula, type, severidad, fechaResuelto } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const info = hallazgosQueries.update.run(
      evidencia,
      descripcion,
      clausula.value,
      clausula.label,
      type,
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
