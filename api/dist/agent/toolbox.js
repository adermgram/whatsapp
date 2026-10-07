var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { OrderError, OrdersService } from '../orders/orders.service.js';
import { koboToNaira, nairaToKobo } from '../common/money.js';
const allowNull = (prop) => {
    const p = prop;
    return { ...p, type: [p.type, 'null'], ...(p.enum ? { enum: [...p.enum, null] } : {}) };
};
const fn = (name, description, properties = {}, required = []) => ({
    type: 'function',
    function: {
        name,
        description,
        parameters: {
            type: 'object',
            properties: Object.fromEntries(Object.entries(properties).map(([k, v]) => [k, required.includes(k) ? v : allowNull(v)])),
            required,
        },
    },
});
const stripNulls = (v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== null))
    : v;
export const TOOL_DEFINITIONS = [
    fn('search_catalog', 'Find products in stock. Returns item refs, sizes, colours, naira prices and units available.', {
        query: { type: 'string', description: 'keywords e.g. "arsenal jersey", "nike air force"' },
        category: { type: 'string', enum: ['CLOTHES', 'SHOES', 'JERSEY', 'ACCESSORIES'] },
        size: { type: 'string' },
        max_price_naira: { type: 'number' },
    }),
    fn('negotiate_price', 'Call whenever the customer offers or asks for a lower price. Returns what the seller can do.', { ref: { type: 'string' }, offer_naira: { type: 'number' } }, ['ref', 'offer_naira']),
    fn('accept_price', 'Call when the customer agrees to the price you last quoted for an item. Locks that price in.', { ref: { type: 'string' } }, ['ref']),
    fn('set_cart_item', 'Add an item or change its quantity in the cart. Price is applied automatically.', { ref: { type: 'string' }, quantity: { type: 'integer' } }, ['ref', 'quantity']),
    fn('remove_cart_item', 'Remove an item from the cart.', { ref: { type: 'string' } }, ['ref']),
    fn('view_cart', 'Show the current cart and saved customer details.'),
    fn('save_customer_details', 'Save the name and/or delivery address the customer gave.', { name: { type: 'string' }, address: { type: 'string' } }),
    fn('create_payment_link', 'Create the order and payment link. Only after the customer confirmed the cart and gave name and address.'),
    fn('check_order_status', "Look up the customer's latest orders and whether payment was received."),
    fn('notify_owner', 'Tell the owner something WITHOUT stopping yourself: e.g. the customer says they paid by bank transfer or sent a payment screenshot you cannot verify. You keep chatting normally.', { reason: { type: 'string' } }, ['reason']),
    fn('handoff_to_owner', 'Stop answering and pass the chat to the human owner. ONLY for complaints, refund demands, anger, a request to speak to a person, or a custom order you cannot price. Not for payment questions.', { reason: { type: 'string' } }, ['reason']),
];
const searchArgs = z.object({
    query: z.string().optional(),
    category: z.enum(['CLOTHES', 'SHOES', 'JERSEY', 'ACCESSORIES']).optional(),
    size: z.string().optional(),
    max_price_naira: z.number().positive().optional(),
});
const negotiateArgs = z.object({ ref: z.string().min(4), offer_naira: z.number().positive() });
const cartArgs = z.object({ ref: z.string().min(4), quantity: z.number().int().min(1).max(20) });
const refArgs = z.object({ ref: z.string().min(4) });
const detailsArgs = z.object({ name: z.string().min(1).optional(), address: z.string().min(3).optional() });
const reasonArgs = z.object({ reason: z.string().min(1) });
export const shortRef = (id) => id.slice(0, 8);
let Toolbox = class Toolbox {
    prisma;
    catalog;
    negotiation;
    orders;
    constructor(prisma, catalog, negotiation, orders) {
        this.prisma = prisma;
        this.catalog = catalog;
        this.negotiation = negotiation;
        this.orders = orders;
    }
    async execute(name, rawArgs, ctx) {
        let args;
        try {
            args = stripNulls(rawArgs ? JSON.parse(rawArgs) : {});
        }
        catch {
            return { error: 'Arguments were not valid JSON. Try again.' };
        }
        try {
            switch (name) {
                case 'search_catalog':
                    return await this.search(searchArgs.parse(args), ctx);
                case 'negotiate_price':
                    return await this.negotiate(negotiateArgs.parse(args), ctx);
                case 'accept_price':
                    return await this.acceptPrice(refArgs.parse(args), ctx);
                case 'set_cart_item':
                    return await this.setCartItem(cartArgs.parse(args), ctx);
                case 'remove_cart_item':
                    return await this.removeCartItem(refArgs.parse(args), ctx);
                case 'view_cart':
                    return await this.viewCart(ctx);
                case 'save_customer_details':
                    return await this.saveDetails(detailsArgs.parse(args), ctx);
                case 'create_payment_link':
                    return await this.createPaymentLink(ctx);
                case 'check_order_status':
                    return await this.orderStatus(ctx);
                case 'notify_owner':
                    ctx.effects.notifyReason = reasonArgs.parse(args).reason;
                    return { ok: true, note: 'The owner has been told. Keep helping the customer yourself.' };
                case 'handoff_to_owner':
                    ctx.effects.handoffReason = reasonArgs.parse(args).reason;
                    return { ok: true, note: 'Owner has been alerted. Tell the customer the owner will reply shortly.' };
                default:
                    return { error: `Unknown tool ${name}` };
            }
        }
        catch (err) {
            if (err instanceof z.ZodError) {
                return { error: 'Invalid arguments: ' + err.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ') };
            }
            if (err instanceof OrderError)
                return { error: err.message, code: err.code };
            throw err;
        }
    }
    async resolveVariant(merchantId, ref) {
        const id = ref.toLowerCase().match(/[0-9a-f]{8}/)?.[0];
        if (!id)
            return null;
        const matches = await this.prisma.variant.findMany({
            where: { merchantId, id: { startsWith: id } },
            include: { product: true },
            take: 2,
        });
        return matches.length === 1 ? matches[0] : null;
    }
    async search(a, ctx) {
        const hits = await this.catalog.search({
            merchantId: ctx.merchantId,
            query: a.query,
            category: a.category,
            size: a.size,
            maxPriceKobo: a.max_price_naira ? nairaToKobo(a.max_price_naira) : undefined,
            limit: 4,
        });
        if (hits.length === 0)
            return { results: [], note: 'Nothing matching. Offer to check other items or hand off.' };
        ctx.effects.shown = [
            ...(ctx.effects.shown ?? []),
            ...hits.flatMap((h) => h.variants.slice(0, 8).map((v) => `${h.name} ${v.size ?? ''}=${shortRef(v.variantId)}`)),
        ];
        return {
            results: hits.map((h) => ({
                name: h.name,
                about: [h.description, ...Object.values(h.attributes).map(String)].filter(Boolean).join(', ').slice(0, 120),
                options: h.variants.slice(0, 8).map((v) => ({
                    ref: shortRef(v.variantId),
                    size: v.size,
                    color: v.color,
                    price_naira: koboToNaira(v.priceKobo),
                    left: Math.min(v.available, 5),
                })),
            })),
        };
    }
    async negotiate(a, ctx) {
        const variant = await this.resolveVariant(ctx.merchantId, a.ref);
        if (!variant)
            return { error: 'Unknown item ref. Search again.' };
        const out = await this.negotiation.submitOffer(ctx.merchantId, ctx.conversationId, variant.id, nairaToKobo(a.offer_naira));
        if (!out)
            return { error: 'Unknown item ref. Search again.' };
        if (out.suggestHandoff)
            ctx.effects.handoffReason = 'Customer keeps pushing on price for ' + variant.product.name;
        return {
            decision: out.decision,
            price_naira: koboToNaira(out.priceKobo),
            final_offer: out.final,
            instruction: out.decision === 'accept'
                ? 'Deal agreed at this price. Offer to add it to the cart.'
                : out.final
                    ? 'This is the lowest the seller can go. Do not offer lower.'
                    : 'Offer this price. If they accept, call negotiate_price again with that amount.',
        };
    }
    async acceptPrice(a, ctx) {
        const variant = await this.resolveVariant(ctx.merchantId, a.ref);
        if (!variant)
            return { error: 'Unknown item ref. Search again.' };
        const price = await this.negotiation.acceptQuoted(ctx.conversationId, variant.id);
        if (price === null)
            return { error: 'No price was quoted for this item yet. Use negotiate_price first.' };
        return { agreed_price_naira: koboToNaira(price), note: 'Locked in. Now add it to the cart.' };
    }
    async setCartItem(a, ctx) {
        const variant = await this.resolveVariant(ctx.merchantId, a.ref);
        if (!variant)
            return { error: 'Unknown item ref. Search again.' };
        const cart = await this.orders.setItem(ctx.merchantId, ctx.customerId, ctx.conversationId, variant.id, a.quantity);
        const pending = await this.negotiation.pendingQuote(ctx.conversationId, variant.id);
        return {
            ...this.cartForModel(cart),
            ...(pending !== null && {
                warning: `Cart uses the list price because the customer has NOT accepted your quote of ${koboToNaira(pending)}. If they agreed, call accept_price then set_cart_item again. Do not state a price other than the cart's.`,
            }),
        };
    }
    async removeCartItem(a, ctx) {
        const variant = await this.resolveVariant(ctx.merchantId, a.ref);
        if (!variant)
            return { error: 'Unknown item ref.' };
        return this.cartForModel(await this.orders.removeItem(ctx.merchantId, ctx.conversationId, variant.id));
    }
    async viewCart(ctx) {
        const draft = await this.orders.getOrCreateDraft(ctx.merchantId, ctx.customerId, ctx.conversationId);
        return this.cartForModel(await this.orders.summary(draft.id));
    }
    async saveDetails(a, ctx) {
        if (a.address && (a.address.trim().length < 12 || a.address.trim().split(/\s+/).length < 3)) {
            return {
                error: 'Address too vague. Ask for house number, street, area and city (e.g. "12 Allen Avenue, Ikeja, Lagos").',
            };
        }
        if (a.name && a.name.trim().length < 3)
            return { error: 'Ask for the customer full name.' };
        const c = await this.orders.saveCustomerDetails(ctx.customerId, a);
        return { saved: true, name: c.name, address: c.address };
    }
    async createPaymentLink(ctx) {
        const r = await this.orders.checkout(ctx.merchantId, ctx.conversationId);
        ctx.effects.paymentLink = r.checkoutUrl;
        return {
            order_number: r.order.orderNumber,
            total_naira: koboToNaira(r.order.totalKobo),
            payment_link: '[LINK]',
            valid_minutes: 30,
            ...(r.reused && { already_created: true }),
            note: 'Write [LINK] exactly where the payment link should go. Payment is confirmed automatically by the system; the customer does not need to send proof.',
        };
    }
    async orderStatus(ctx) {
        const orders = await this.prisma.order.findMany({
            where: { merchantId: ctx.merchantId, customerId: ctx.customerId, status: { not: 'DRAFT' } },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });
        return {
            orders: orders.map((o) => ({
                order_number: o.orderNumber,
                status: o.status,
                total_naira: koboToNaira(o.totalKobo),
                paid: o.status === 'PAID' || o.status === 'FULFILLED',
            })),
            note: 'If status is AWAITING_PAYMENT, payment has not been confirmed yet. Never confirm payment yourself.',
        };
    }
    cartForModel(cart) {
        if (!cart)
            return { items: [], total_naira: 0 };
        return {
            items: cart.items.map((i) => ({
                ref: shortRef(i.variantId),
                name: i.name,
                size: i.size,
                color: i.color,
                qty: i.quantity,
                unit_price_naira: koboToNaira(i.unitPriceKobo),
            })),
            total_naira: koboToNaira(cart.totalKobo),
            customer_name: cart.customerName,
            delivery_address: cart.deliveryAddress,
        };
    }
};
Toolbox = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        CatalogService,
        NegotiationService,
        OrdersService])
], Toolbox);
export { Toolbox };
//# sourceMappingURL=toolbox.js.map