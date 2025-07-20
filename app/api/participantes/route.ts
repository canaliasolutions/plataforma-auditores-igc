import { NextRequest, NextResponse } from 'next/server';
import { participantesQueries } from '@/lib/database';

// GET: Fetch all participants for a specific audit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');
  
  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const participantes = participantesQueries.getAll.all(auditoriaId);
    return NextResponse.json(participantes);
  } catch (error) {
    console.error('Error fetching participantes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add a new participant
export async function POST(req: NextRequest) {
  try {
    const { 
      auditoriaId, 
      nombreCompleto, 
      cargoRol, 
      correoElectronico, 
      asistioReunionInicial, 
      asistioReunionCierre,
      fechaAgregado 
    } = await req.json();
    
    if (!auditoriaId || !nombreCompleto || !cargoRol || !correoElectronico) {
      return NextResponse.json({ 
        error: 'auditoriaId, nombreCompleto, cargoRol and correoElectronico are required' 
      }, { status: 400 });
    }

    const info = participantesQueries.create.run(
      auditoriaId, 
      nombreCompleto, 
      cargoRol, 
      correoElectronico, 
      asistioReunionInicial ? 1 : 0, 
      asistioReunionCierre ? 1 : 0,
      fechaAgregado || new Date().toISOString().split('T')[0]
    );

    const newParticipant = participantesQueries.getById.get(info.lastInsertRowid);
    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a participant by id
export async function PUT(req: NextRequest) {
  try {
    const { 
      id, 
      nombreCompleto, 
      cargoRol, 
      correoElectronico, 
      asistioReunionInicial, 
      asistioReunionCierre 
    } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const info = participantesQueries.update.run(
      nombreCompleto, 
      cargoRol, 
      correoElectronico, 
      asistioReunionInicial ? 1 : 0, 
      asistioReunionCierre ? 1 : 0, 
      id
    );

    if (info.changes === 0) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    const updatedParticipant = participantesQueries.getById.get(id);
    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a participant by id
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const info = participantesQueries.delete.run(id);
    
    if (info.changes === 0) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
