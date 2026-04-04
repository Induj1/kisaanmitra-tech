/** Kisaan national helpline (toll-free). */
export const KISAAN_HELPLINE = "18001801551";

export function formatKisaanHelpline(): string {
  const n = KISAAN_HELPLINE;
  return `${n.slice(0, 4)}-${n.slice(4, 7)}-${n.slice(7)}`;
}

export const kisaanHelplineTelHref = `tel:${KISAAN_HELPLINE}`;
