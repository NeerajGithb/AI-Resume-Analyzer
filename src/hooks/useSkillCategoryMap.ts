'use client';

import { useState, useEffect } from 'react';
import { getSkillCategoryMap, groupSkillsToRows } from '@/lib/skillsData';

/**
 * Returns skill rows grouped by category, ready for ModernResume.
 * Falls back to a single "Skills" row until the JSON is loaded.
 */
export function useSkillRows(selected: string[]): { label: string; value: string }[] {
  const [rows, setRows] = useState<{ label: string; value: string }[]>(() =>
    selected.length ? [{ label: 'Skills', value: selected.join(', ') }] : []
  );

  useEffect(() => {
    if (!selected.length) { setRows([]); return; }
    getSkillCategoryMap().then((map) => {
      setRows(groupSkillsToRows(selected, map));
    });
  }, [selected]);

  return rows;
}
