const puppeteer = require('puppeteer');


face();

async function face() {
    console.log("prueba");
    (async () => {



        const pathToExtension = 'C:\\Aplicaciones\\Exte\\0.2.1_0';


        const browser = await puppeteer.launch({
            //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
            // Reemplaza con la ruta real a tu Google Chrome
            headless: false,
            args: ['--start-maximized',
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`
            ],
            devtools: false
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1368, height: 620 });
        await page.goto('https://www.facebook.com/');
        await page.waitForTimeout(6000);
        await page.type('#email', "Fernando.pala.99@gmail.com");
    })();
}