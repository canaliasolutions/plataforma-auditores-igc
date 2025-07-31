/* hooks/useHallazgos.ts */
import { useCallback, useEffect, useState } from 'react';
import { Hallazgo } from '@/types/tipos';
import {
  addHallazgo,
  updateHallazgo,
  deleteHallazgo,
} from '@/api/hallazgos';

/* ---- tipo para crear ---- */
export type NuevoHallazgo = Omit<
  Hallazgo,
  'id' | 'fecha_encontrado' | 'fecha_resuelto'
> & {
  auditoriaId: number;
  fechaEncontrado?: string;
};

export function useHallazgos(auditoriaId: string | number) {
  const [data, setData] = useState<Hallazgo[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------- GET todos -------- */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/hallazgos?auditoriaId=${encodeURIComponent(auditoriaId)}`
      );
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [auditoriaId]);

  useEffect(() => { load(); }, [load]);

  /* -------- helpers -------- */
  async function check(res: Response) {
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Error en la petición');
    }
  }

  const create = async (payload: NuevoHallazgo) => {
    await check(await addHallazgo(payload));
    await load();
  };

  const update = async (payload: Partial<Hallazgo>) => {
    await check(await updateHallazgo(payload));
    await load();
  };

  const remove = async (id: number) => {
    await check(await deleteHallazgo(id));
    await load();
  };

  return { data, loading, create, update, remove };
}
