// app/api/home/route.ts
import { NextResponse } from 'next/server';
// RUTA RELATIVA: Desde /app/api/home hasta /mocks
import homeData from '../../../mocks/home.mock.json'; 

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json(homeData);
}