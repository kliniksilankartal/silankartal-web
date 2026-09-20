import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/content';
import { commitContentToGitHub } from '@/lib/github';

export async function GET() {
  try {
    const data = getSiteContent();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'İçerik okunamadı' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = saveSiteContent(body);

    // If GitHub token is configured, commit to repo
    const commitMessage = `Admin panel: site-content.json güncellendi (${new Date().toLocaleString('tr-TR')})`;
    const githubResult = await commitContentToGitHub(
      'data/site-content.json',
      JSON.stringify(updated, null, 2),
      commitMessage
    );

    return NextResponse.json({
      success: true,
      data: updated,
      github: githubResult,
    });
  } catch (error) {
    console.error('Admin content save error:', error);
    return NextResponse.json({ error: 'İçerik kaydedilemedi' }, { status: 500 });
  }
}
