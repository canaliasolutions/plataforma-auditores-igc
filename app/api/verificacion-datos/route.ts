import { NextRequest, NextResponse } from 'next/server';
import { verificacionDatosQueries } from '@/lib/database';

// GET: Fetch data verification for a specific audit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auditoriaId = searchParams.get('auditoriaId');
  
  if (!auditoriaId) {
    return NextResponse.json({ error: 'auditoriaId is required' }, { status: 400 });
  }

  try {
    const verification = verificacionDatosQueries.getByAuditId.get(auditoriaId);
    
    // If no verification exists, return default values
    if (!verification) {
      return NextResponse.json({
        auditoria_id: auditoriaId,
        datos_contacto: 'correcto',
        datos_alcance: 'correcto',
        datos_facturacion: 'correcto',
        comentarios_verificacion: ''
      });
    }
    
    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error fetching data verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST/PUT: Save or update data verification
export async function POST(req: NextRequest) {
  try {
    const { 
      auditoriaId, 
      datosContacto, 
      datosAlcance, 
      datosFacturacion, 
      comentariosVerificacion 
    } = await req.json();
    
    if (!auditoriaId) {
      return NextResponse.json({ 
        error: 'auditoriaId is required' 
      }, { status: 400 });
    }

    // Use upsert to either insert or update
    verificacionDatosQueries.upsert.run(
      auditoriaId,
      datosContacto || 'correcto',
      datosAlcance || 'correcto', 
      datosFacturacion || 'correcto',
      comentariosVerificacion || ''
    );

    // Fetch the updated record
    const verification = verificacionDatosQueries.getByAuditId.get(auditoriaId);
    return NextResponse.json(verification, { status: 200 });
  } catch (error) {
    console.error('Error saving data verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update data verification (alias for POST since we use upsert)
export async function PUT(req: NextRequest) {
  return POST(req);
}
