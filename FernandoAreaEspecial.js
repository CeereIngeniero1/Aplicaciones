const puppeteer = require('puppeteer');


const user = '83955';
const pass = 'wX2*dQ3*cS';





(async () => {
    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        // executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
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
    await page.goto('https://annamineria.anm.gov.co/sigm/');
    await page.type('#username', user);
    await page.type('#password', pass);
    page.click("#loginButton");

    const solicitudes = await page.$x('//span[contains(.,"Solicitudes")]');
    await solicitudes[1].click();

    const lblRadicar = await page.$x('//a[contains(.,"Radicar solicitud de Área de Reserva Especial")]');
    await lblRadicar[0].click();


    const continPin = await page.$x('//span[contains(.,"Continuar")]');
    await continPin[1].click();
})










