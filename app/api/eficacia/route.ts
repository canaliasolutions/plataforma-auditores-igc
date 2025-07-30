import { NextRequest, NextResponse } from 'next/server';
import { eficaciaQueries } from '@/lib/database';

// GET: Fetch eficacia data for a specific audit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');
  
  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const eficacia = eficaciaQueries.getByAuditId.get(auditoriaId);
    
    // If no eficacia data exists, return default values
    if (!eficacia) {
      return NextResponse.json({
        auditoria_id: auditoriaId,
        tipo_auditoria: 'in_situ',
        medio_utilizado: '',
        otro_medio: '',
        medio_efectivo: '',
        inconvenientes_presentados: '',
        tipos_inconvenientes: '',
        otros_inconvenientes: '',
        tecnicas_utilizadas: '',
        otras_tecnicas: ''
      });
    }
    
    return NextResponse.json(eficacia);
  } catch (error) {
    console.error('Error fetching eficacia data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST/PUT: Save or update eficacia data
export async function POST(req: NextRequest) {
  try {
    const {
      eficacia
    } = await req.json();
    
    if (!eficacia) {
      return NextResponse.json({ 
        error: 'Falta el campo eficacia'
      }, { status: 400 });
    }

    // Use upsert to either insert or update
    eficaciaQueries.upsert.run(
        eficacia.auditoria_id,
        eficacia.tipo_auditoria || 'in_situ',
        eficacia.medio_utilizado || '',
        eficacia.otro_medio || '',
        eficacia.medio_efectivo || '',
        eficacia.inconvenientes_presentados || '',
        eficacia.tipos_inconvenientes || '',
        eficacia.otros_inconvenientes || '',
        eficacia.tecnicas_utilizadas || '',
        eficacia.tecnicas_insitu_utilizadas || '',
        eficacia.otras_tecnicas || '',
        eficacia.otras_tecnicas_insitu || ''
    );

    // Fetch the updated record
    const eficacias = eficaciaQueries.getByAuditId.get(eficacia.auditoria_id);
    return NextResponse.json(eficacias, { status: 200 });
  } catch (error) {
    console.error('Error saving eficacia data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update eficacia data (alias for POST since we use upsert)
export async function PUT(req: NextRequest) {
  return POST(req);
}
