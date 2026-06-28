import puppeteer from 'puppeteer-core';
import fs from 'fs';

const RESUME_BASE_URL =
  process.env.FRONTEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3001';

function findChrome(): string {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;

  const winPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    (process.env.LOCALAPPDATA ?? '') + '\\Google\\Chrome\\Application\\chrome.exe',
    (process.env.USERPROFILE ?? '') + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const p of winPaths) {
    if (p && fs.existsSync(p)) return p;
  }

  const macPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];
  for (const p of macPaths) {
    if (fs.existsSync(p)) return p;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { execSync } = require('child_process');
    const chromePath = execSync(
      'which chromium-browser || which chromium || which google-chrome',
      { encoding: 'utf-8' },
    ).trim();
    if (chromePath) return chromePath;
  } catch { /* not found */ }

  throw new Error(
    'Chrome/Chromium not found. Set the CHROME_EXECUTABLE_PATH environment variable.',
  );
}

export async function generateResumePDF(resumeData: Record<string, unknown>): Promise<Buffer> {
  const executablePath = findChrome();
  const printUrl = `${RESUME_BASE_URL}/resume-builder-v2/print`;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    devtools: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    await page.evaluate((data: any) => {
      (window as any).__RESUME_DATA__ = data;
    }, resumeData);

    await page.waitForSelector('#resume-ready', { timeout: 30000 });

    const pdf = await page.pdf({
      width: '794px',
      height: '1123px',
      printBackground: true,
      pageRanges: '1',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdf);

  } finally {
    await browser.close();
  }
}