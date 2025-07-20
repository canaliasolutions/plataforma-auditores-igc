import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET: Fetch all non-conformities
export async function GET() {
  const stmt = db.prepare('SELECT * FROM hallazgos ORDER BY created_at DESC');
  const nonConformities = stmt.all();
  return NextResponse.json(nonConformities);
}

// POST: Add a new non-conformity
export async function POST(req: NextRequest) {
  const { title, description, status } = await req.json();
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  const stmt = db.prepare(
    'INSERT INTO non_conformities (title, description, status) VALUES (?, ?, ?)'
  );
  const info = stmt.run(title, description || '', status || 'open');
  const newItem = db.prepare('SELECT * FROM non_conformities WHERE id = ?').get(info.lastInsertRowid);
  return NextResponse.json(newItem, { status: 201 });
}

// PUT: Update a non-conformity by id
export async function PUT(req: NextRequest) {
  const { id, title, description, status } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  const stmt = db.prepare(
    'UPDATE non_conformities SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  const info = stmt.run(title, description, status, id);
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Non-conformity not found' }, { status: 404 });
  }
  const updatedItem = db.prepare('SELECT * FROM non_conformities WHERE id = ?').get(id);
  return NextResponse.json(updatedItem);
}

// DELETE: Delete a non-conformity by id
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  const stmt = db.prepare('DELETE FROM non_conformities WHERE id = ?');
  const info = stmt.run(id);
  if (info.changes === 0) {
    return NextResponse.json({ error: 'Non-conformity not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
