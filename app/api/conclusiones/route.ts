import { NextRequest, NextResponse } from 'next/server';
import { conclusionesQueries } from '@/lib/database';

// GET: Fetch conclusions for a specific audit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');
  
  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const conclusions = conclusionesQueries.getByAuditId.get(auditoriaId);
    
    // If no conclusions exist, return default values
    if (!conclusions) {
      return NextResponse.json({
        auditoria_id: auditoriaId,
        objetivos_cumplidos: 'si',
        desviacion_plan: '',
        sistema_cumple_norma: 'si'
      });
    }
    
    return NextResponse.json(conclusions);
  } catch (error) {
    console.error('Error fetching conclusions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST/PUT: Save or update conclusions
export async function POST(req: NextRequest) {
  try {
    const { 
      auditoriaId, 
      objetivosCumplidos, 
      desviacionPlan, 
      sistemaCumpleNorma 
    } = await req.json();
    
    if (!auditoriaId) {
      return NextResponse.json({ 
        error: 'auditoriaId is required' 
      }, { status: 400 });
    }

    // Use upsert to either insert or update
    const info = conclusionesQueries.upsert.run(
      auditoriaId,
      objetivosCumplidos || 'si',
      desviacionPlan || '', 
      sistemaCumpleNorma || 'si'
    );

    // Fetch the updated record
    const conclusions = conclusionesQueries.getByAuditId.get(auditoriaId);
    return NextResponse.json(conclusions, { status: 200 });
  } catch (error) {
    console.error('Error saving conclusions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update conclusions (alias for POST since we use upsert)
export async function PUT(req: NextRequest) {
  return POST(req);
}
