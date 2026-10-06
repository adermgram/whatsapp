import { createRequire } from 'node:module';
import { dirname, join, sep } from 'node:path';
import type { TableCell, TDocumentDefinitions } from 'pdfmake/interfaces.js';
import { formatNaira } from '../common/money.js';

// pdfmake is CommonJS and exports an instance, so named ESM imports do not work: load it with require.
const require = createRequire(import.meta.url);
const pdfmake = require('pdfmake') as typeof import('pdfmake');

const fontDir = join(dirname(require.resolve('pdfmake/package.json')), 'fonts', 'Roboto');
pdfmake.addFonts({
  Roboto: {
    normal: join(fontDir, 'Roboto-Regular.ttf'),
    bold: join(fontDir, 'Roboto-Medium.ttf'),
    italics: join(fontDir, 'Roboto-Italic.ttf'),
    bolditalics: join(fontDir, 'Roboto-MediumItalic.ttf'),
  },
});
// A receipt never needs remote images or arbitrary local files.
pdfmake.setUrlAccessPolicy(() => false);
pdfmake.setLocalAccessPolicy((p: string) => p.includes(`pdfmake${sep}fonts`));

export interface ReceiptData {
  businessName: string;
  receiptNumber: string;
  orderNumber: string;
  paidAt: Date;
  customerName: string | null;
  customerPhone: string;
  deliveryAddress: string | null;
  paymentReference: string;
  items: { name: string; size: string | null; color: string | null; quantity: number; unitPriceKobo: number }[];
  subtotalKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
}

const GREEN = '#15803d';
const MUTED = '#6b7280';

const dateFormat = new Intl.DateTimeFormat('en-NG', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Lagos',
});

export function buildReceiptDefinition(d: ReceiptData): TDocumentDefinitions {
  const itemRows: TableCell[][] = d.items.map((i) => [
    { text: [i.name, ...(i.size || i.color ? [{ text: `\n${[i.size && `Size ${i.size}`, i.color].filter(Boolean).join(' · ')}`, color: MUTED, fontSize: 9 }] : [])] },
    { text: String(i.quantity), alignment: 'center' as const },
    { text: formatNaira(i.unitPriceKobo), alignment: 'right' as const },
    { text: formatNaira(i.unitPriceKobo * i.quantity), alignment: 'right' as const },
  ]);

  const noBorder: [boolean, boolean, boolean, boolean] = [false, false, false, false];
  const totalRow = (label: string, value: string, bold = false): TableCell[] => [
    { text: '', border: noBorder },
    { text: '', border: noBorder },
    { text: label, alignment: 'right', bold, border: noBorder },
    { text: value, alignment: 'right', bold, border: noBorder },
  ];

  const body: TableCell[][] = [
    [
      { text: 'Item', bold: true },
      { text: 'Qty', bold: true, alignment: 'center' },
      { text: 'Price', bold: true, alignment: 'right' },
      { text: 'Total', bold: true, alignment: 'right' },
    ],
    ...itemRows,
    totalRow('Subtotal', formatNaira(d.subtotalKobo)),
    ...(d.deliveryFeeKobo > 0 ? [totalRow('Delivery', formatNaira(d.deliveryFeeKobo))] : []),
    totalRow('Total paid', formatNaira(d.totalKobo), true),
  ];

  return {
    info: { title: `Receipt ${d.receiptNumber}`, author: d.businessName, subject: `Order ${d.orderNumber}` },
    pageSize: 'A5',
    pageMargins: [32, 36, 32, 40],
    defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.2 },
    content: [
      { text: d.businessName, fontSize: 18, bold: true },
      { text: 'PAYMENT RECEIPT', fontSize: 10, color: MUTED, characterSpacing: 1.5, margin: [0, 2, 0, 10] },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'Receipt no.', color: MUTED, fontSize: 8 },
              { text: d.receiptNumber, bold: true, margin: [0, 0, 0, 6] },
              { text: 'Order no.', color: MUTED, fontSize: 8 },
              { text: d.orderNumber, bold: true },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'Date paid', color: MUTED, fontSize: 8 },
              { text: dateFormat.format(d.paidAt), margin: [0, 0, 0, 6] },
              { text: 'Status', color: MUTED, fontSize: 8 },
              { text: 'PAID', bold: true, color: GREEN },
            ],
          },
        ],
        margin: [0, 0, 0, 12],
      },
      { text: 'Customer', color: MUTED, fontSize: 8 },
      { text: d.customerName ?? 'Customer', bold: true },
      { text: `+${d.customerPhone}` },
      ...(d.deliveryAddress ? [{ text: d.deliveryAddress, margin: [0, 2, 0, 0] as [number, number, number, number] }] : []),
      {
        margin: [0, 14, 0, 0],
        table: {
          headerRows: 1,
          widths: ['*', 30, 62, 66],
          body,
        },
        layout: {
          hLineWidth: (i: number, node: { table: { body: unknown[] } }) =>
            i === 0 || i === 1 || i === node.table.body.length ? 0.8 : 0.3,
          vLineWidth: () => 0,
          hLineColor: () => '#d1d5db',
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
      },
      { text: `Payment reference: ${d.paymentReference}`, color: MUTED, fontSize: 8, margin: [0, 14, 0, 0] },
      { text: `Thank you for shopping with ${d.businessName}!`, italics: true, alignment: 'center', margin: [0, 18, 0, 0] },
    ],
  };
}

export async function renderReceiptPdf(d: ReceiptData): Promise<Buffer> {
  return pdfmake.createPdf(buildReceiptDefinition(d)).getBuffer();
}
