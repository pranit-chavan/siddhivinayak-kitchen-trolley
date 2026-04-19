import { summarizeDesignItems } from './design-summary';

describe('summarizeDesignItems', () => {
  it('creates structured quotation and cutlist data from saved design items', () => {
    const summary = summarizeDesignItems([
      {
        uid: 'item-1',
        pieceId: 'lower-600',
        piece: {
          name: 'Base Cabinet 600mm',
          category: 'lower',
          width: 0.6,
          height: 0.85,
          depth: 0.55,
          hasCounter: true,
        },
      },
      {
        uid: 'item-2',
        pieceId: 'upper-600',
        piece: {
          name: 'Wall Cabinet 600mm',
          category: 'upper',
          width: 0.6,
          height: 0.7,
          depth: 0.35,
          hasCounter: false,
        },
      },
    ]);

    expect(summary.totalItems).toBe(2);
    expect(summary.furnitureBreakdown).toEqual([
      { category: 'lower', label: 'Base Units', count: 1 },
      { category: 'upper', label: 'Wall Units', count: 1 },
    ]);
    expect(summary.quotationSuggestions).toEqual([
      {
        name: 'Base Units Fabrication',
        category: 'Plywood',
        qty: 1,
        unit: 'nos',
        rate: 6800,
      },
      {
        name: 'Countertop Fabrication',
        category: 'Other',
        qty: 1.97,
        unit: 'rft',
        rate: 1800,
      },
      {
        name: 'Wall Units Fabrication',
        category: 'Plywood',
        qty: 1,
        unit: 'nos',
        rate: 5200,
      },
    ]);
    expect(summary.cutlistSummary.totalPanels).toBe(10);
    expect(summary.cutlistSummary.totalSheetAreaSqM).toBe(3.44);
  });
});
