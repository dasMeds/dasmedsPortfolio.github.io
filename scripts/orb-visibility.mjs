import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { PNG } from 'pngjs';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4173';
const thresholdRatio = 0.0002;
const server = spawn('php', ['-S', '127.0.0.1:4173', '-t', 'public'], {
    stdio: 'ignore',
    windowsHide: true
});

let browser;

try {
    let serverReady = false;
    for (let attempt = 0; attempt < 50; attempt += 1) {
        try {
            const response = await fetch(origin);
            serverReady = response.ok;
            if (serverReady) break;
        } catch {
            await delay(100);
        }
    }
    if (!serverReady) throw new Error('Local PHP server did not start on port 4173.');

    browser = await chromium.launch({ headless: true });
    const results = [];

    for (const theme of ['light', 'dark']) {
        for (const width of [375, 1440]) {
            const context = await browser.newContext({
                viewport: { width, height: 900 },
                deviceScaleFactor: 1
            });
            await context.addInitScript(savedTheme => {
                sessionStorage.setItem('dasmeds-portfolio-loader-seen', 'true');
                localStorage.setItem('dasmeds-theme', savedTheme);
            }, theme);
            const page = await context.newPage();
            await page.goto(origin, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.story-canvas');
            await page.waitForTimeout(900);

            const sectionIds = await page.locator('main section[id]').evaluateAll(sections =>
                sections.map(section => section.id)
            );

            for (const id of sectionIds) {
                const section = page.locator(`#${id}`);
                await section.scrollIntoViewIfNeeded();
                await page.waitForTimeout(600);
                await page.locator('video').evaluateAll(videos => videos.forEach(video => video.pause()));
                await page.waitForTimeout(100);

                const canvas = page.locator('.story-canvas');
                const visibleScreenshot = PNG.sync.read(await page.screenshot());
                await canvas.evaluate(element => { element.style.display = 'none'; });
                const hiddenScreenshot = PNG.sync.read(await page.screenshot());
                await canvas.evaluate(element => { element.style.display = ''; });

                let changedPixels = 0;
                for (let pixel = 0; pixel < visibleScreenshot.data.length; pixel += 4) {
                    const differs = [0, 1, 2].some(channel =>
                        Math.abs(visibleScreenshot.data[pixel + channel] - hiddenScreenshot.data[pixel + channel]) > 12
                    );
                    if (differs) changedPixels += 1;
                }

                const totalPixels = visibleScreenshot.width * visibleScreenshot.height;
                const ratio = changedPixels / totalPixels;
                const result = { theme, width, section: id, changedPixels, ratio: Number(ratio.toFixed(5)) };
                results.push(result);
                console.log(`${theme} ${width}px #${id}: ${(ratio * 100).toFixed(3)}% changed`);
                if (ratio < thresholdRatio) {
                    throw new Error(
                        `Orb visibility failed at ${theme}, ${width}px, #${id}: ` +
                        `${(ratio * 100).toFixed(3)}% changed (minimum ${(thresholdRatio * 100).toFixed(3)}%).`
                    );
                }
            }

            await context.close();
        }
    }

    console.log(`Orb visibility check passed for ${results.length} theme/viewport/section combinations.`);
} finally {
    await browser?.close();
    server.kill();
}
