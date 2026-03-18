# Dash

A personal dashboard featuring a recipe calendar and real-time train departures.

## Features

### 📅 Recipe Calendar

This is a diary of recipes I have cooked, with description/image/recipe url/tags. It uses cloudflare KV for storage and R2 for images.  
Sometimes I make something really good and want to remember it, this is the place for that.

<img width="776" height="1303" alt="Screenshot 2026-03-18 220527" src="https://github.com/user-attachments/assets/4882139e-f2a8-401c-8778-bbbeb2071fcc" />


### 🚆 Train Departures

Uses the PTV API to show live departure times for Melbourne's public transport, optimized for Kindle e-ink displays.  
I want to know when the next train is coming without having to pull out my phone and open up an app, so I keep this dashboard open on my kindle.

<img width="775" height="1023" alt="Screenshot 2026-03-18 220508" src="https://github.com/user-attachments/assets/a1b3f74d-1f2c-4a39-b3c3-7801b711a8d5" />


## Project Structure

This is a monorepo managed with `pnpm`:

- `packages/frontend`: The main SolidJS dashboard application.
- `packages/ui`: A shared UI library using UnoCSS for styling.

## Development

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run the development server:
   ```bash
   pnpm dev
   ```
