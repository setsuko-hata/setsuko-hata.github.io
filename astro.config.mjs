import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://setsukohata.com',
  server: { port: Number(process.env.PORT) || 4321 },
});
