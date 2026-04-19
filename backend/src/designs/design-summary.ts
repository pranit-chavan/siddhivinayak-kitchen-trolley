type RawDesignPiece = {
  name?: unknown;
  category?: unknown;
  width?: unknown;
  height?: unknown;
  depth?: unknown;
  hasCounter?: unknown;
};

type RawDesignItem = {
  pieceId?: unknown;
  piece?: RawDesignPiece;
};

type FurnitureBreakdown = {
  category: string;
  label: string;
  count: number;
};

type QuotationSuggestion = {
  name: string;
  category: string;
  qty: number;
  unit: string;
  rate: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  lower: 'Base Units',
  upper: 'Wall Units',
  tall: 'Tall Units',
  corner: 'Corner Units',
  appliance: 'Appliances',
  window_door: 'Windows & Doors',
  table_stool: 'Tables & Seating',
  structural: 'Structural',
  accessory: 'Accessories',
};

const CATEGORY_RATES: Record<string, number> = {
  lower: 6800,
  upper: 5200,
  tall: 12500,
  corner: 8200,
  table_stool: 9500,
  accessory: 1400,
};

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown) {
  return value === true;
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function toItem(rawItem: unknown) {
  const item = rawItem as RawDesignItem;
  const piece = (item?.piece ?? {}) as RawDesignPiece;
  const category = asString(piece.category, 'other');

  return {
    name: asString(piece.name, asString(item?.pieceId, 'Design Item')),
    category,
    width: asNumber(piece.width),
    height: asNumber(piece.height),
    depth: asNumber(piece.depth),
    hasCounter: asBoolean(piece.hasCounter),
  };
}

export function summarizeDesignItems(items: unknown) {
  const normalizedItems = Array.isArray(items) ? items.map(toItem) : [];
  const breakdownMap = new Map<string, FurnitureBreakdown>();
  const suggestionMap = new Map<string, QuotationSuggestion>();

  let totalCounterWidthMeters = 0;
  let totalPanels = 0;
  let totalSheetAreaSqM = 0;

  for (const item of normalizedItems) {
    const label = CATEGORY_LABELS[item.category] ?? 'Other Items';
    const breakdown = breakdownMap.get(item.category);

    if (breakdown) {
      breakdown.count += 1;
    } else {
      breakdownMap.set(item.category, {
        category: item.category,
        label,
        count: 1,
      });
    }

    const standardRate = CATEGORY_RATES[item.category];

    if (standardRate) {
      const suggestion = suggestionMap.get(item.category);

      if (suggestion) {
        suggestion.qty += 1;
      } else {
        suggestionMap.set(item.category, {
          name: `${label} Fabrication`,
          category: 'Plywood',
          qty: 1,
          unit: 'nos',
          rate: standardRate,
        });
      }
    }

    if (item.hasCounter && item.width > 0) {
      totalCounterWidthMeters += item.width;
    }

    const widthMm = Math.round((item.width || 0.6) * 1000);
    const depthMm = Math.round((item.depth || 0.55) * 1000);
    const sideHeightMm = Math.round((item.height || 0.85) * 1000);

    const panelAreaSqM =
      ((sideHeightMm * depthMm * 2) +
        (widthMm * depthMm * 2) +
        widthMm * sideHeightMm) /
      1_000_000;

    totalPanels += 5;
    totalSheetAreaSqM += panelAreaSqM;
  }

  if (totalCounterWidthMeters > 0) {
    suggestionMap.set('countertop', {
      name: 'Countertop Fabrication',
      category: 'Other',
      qty: Number((totalCounterWidthMeters * 3.28084).toFixed(2)),
      unit: 'rft',
      rate: 1800,
    });
  }

  return {
    totalItems: normalizedItems.length,
    furnitureBreakdown: Array.from(breakdownMap.values()).sort((left, right) =>
      left.label.localeCompare(right.label),
    ),
    quotationSuggestions: Array.from(suggestionMap.values()).sort(
      (left, right) => left.name.localeCompare(right.name),
    ),
    cutlistSummary: {
      totalPanels,
      totalSheetAreaSqM: Number(totalSheetAreaSqM.toFixed(2)),
      totalCountertopRft: Number(
        (totalCounterWidthMeters * 3.28084).toFixed(2),
      ),
    },
  };
}
