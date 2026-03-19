# Dash

A personal dashboard featuring a recipe calendar and real-time train departures.

## Features

### 📅 Recipe Calendar

This is a diary of recipes I have cooked, with description/image/recipe url/tags. It uses cloudflare KV for storage and R2 for images.  
Sometimes I make something really good and want to remember it, this is the place for that.


<img width="912" height="1368" alt="chrome_uMc0ub7FsC" src="https://github.com/user-attachments/assets/4785ff86-59ea-4782-bad4-badfeb334318" />


### 🚆 Train Departures

Uses the PTV API to show live departure times for Melbourne's public transport, optimized for Kindle e-ink displays.  
I want to know when the next train is coming without having to pull out my phone and open up an app, so I keep this dashboard open on my kindle.

<img width="912" height="1368" alt="imVj5UCvky" src="https://github.com/user-attachments/assets/f81c12c4-62b6-4935-a5f5-3326029da650" />


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
