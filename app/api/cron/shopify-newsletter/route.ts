import { handleReconciliation } from '@/lib/newsletter-sync';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;
export async function GET(request: Request) { return handleReconciliation(request); }
