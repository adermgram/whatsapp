# Shop: AI Sales Assistant for WhatsApp

An AI shop assistant that answers customer questions, negotiates prices within limits set by the seller, and closes sales on WhatsApp. Sellers manage products and orders from a web dashboard.

**Live dashboard:** https://shop.baselinesystemsafrica.com
**Try the bot on WhatsApp:** +91 79810 78840

## What it does

- **Answers questions:** Replies about products, prices, stock and delivery from the seller's catalogue.
- **Bargains:** Negotiates with customers inside a floor price the seller sets, so it never sells below it.
- **Sells end to end:** Guides the customer from enquiry to confirmed order and generate payments link
- **Seller dashboard:** Manage products and orders, and control the WhatsApp sales assistant.

## How it works

1. A customer messages the WhatsApp number.
2. The WhatsApp webhook sends the message to the API.
3. The API loads the conversation history and the seller's product data.
4. An LLM decides how to reply, using product data and pricing rules as context.
5. The reply is sent back on WhatsApp, and orders are saved for the seller to see in the dashboard.

## Stack

- **API:** Node.js
- **Dashboard:** Next.js
- **AI:** openAI GPT 4 mini
- **Messaging:** Bailey WhatsApp API
- **Database:** Postgres via Supabase

## Project structure

- `api/`: webhook, conversation logic, LLM calls
- `dashboard/`: seller web app for products and orders

## Running locally

Add your steps here: install dependencies, copy `.env.example` to `.env`, set keys (LLM, WhatsApp, database), then start the API and dashboard.

## Design notes

- Price limits are enforced in code, not left to the model, so the bot can't be talked below the seller's floor price.
- AI contacts and report to the owner when it’s unsure about a situation 
