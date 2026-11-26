import { handleConsentWebhook } from '@/lib/newsletter-sync';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) { return handleConsentWebhook(request); }
