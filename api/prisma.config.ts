import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Migrations use the Supabase *direct* connection (port 5432).
// The running app uses the pooled DATABASE_URL via the pg driver adapter.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'],
  },
});
