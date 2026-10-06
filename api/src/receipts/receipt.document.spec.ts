import { describe, expect, it } from 'vitest';
import { buildReceiptDefinition, renderReceiptPdf, type ReceiptData } from './receipt.document.js';

const sample: ReceiptData = {
  businessName: 'Hafiz & Kits',
  receiptNumber: 'RCP-000012',
  orderNumber: 'ORD-000034',
  paidAt: new Date('2026-10-06T12:30:00Z'),
  customerName: 'Tunde Bakare',
  customerPhone: '2348011112222',
  deliveryAddress: '12 Allen Avenue, Ikeja, Lagos',
  paymentReference: 'ordabc123',
  items: [{ name: 'Arsenal Home Jersey 24/25', size: 'M', color: null, quantity: 1, unitPriceKobo: 1630000 }],
  subtotalKobo: 1630000,
  deliveryFeeKobo: 0,
  totalKobo: 1630000,
};

/** Every string pdfmake will print, so we can assert on content without parsing a compressed PDF. */
function allText(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(allText);
  if (node && typeof node === 'object') return Object.values(node).flatMap(allText);
  return [];
}

describe('receipt document', () => {
  it('contains the business name, receipt number, order number, items and total', () => {
    const text = allText(buildReceiptDefinition(sample).content).join(' ');
    expect(text).toContain('Hafiz & Kits');
    expect(text).toContain('RCP-000012');
    expect(text).toContain('ORD-000034');
    expect(text).toContain('Arsenal Home Jersey 24/25');
    expect(text).toContain('₦16,300');
    expect(text).toContain('PAID');
    expect(text).not.toContain('Delivery'); // no delivery line when the fee is zero
  });

  it('shows the delivery line only when there is a fee', () => {
    const text = allText(buildReceiptDefinition({ ...sample, deliveryFeeKobo: 250000, totalKobo: 1880000 }).content).join(' ');
    expect(text).toContain('Delivery');
    expect(text).toContain('₦2,500');
  });

  it('renders a real PDF', async () => {
    const pdf = await renderReceiptPdf(sample);
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pdf.length).toBeGreaterThan(5000);
  });
});
