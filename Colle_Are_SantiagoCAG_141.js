const puppeteer = require('puppeteer');
const { keyboard, mouse, Key, clipboard } = require('@nut-tree-fork/nut-js');
const colors = require('colors');
const user = '76966';
const pass = 'CollectiveM_2024*';

var Agente = 0;

Pagina();
async function Pagina() {

    const pathToExtension = 'C:\\Aplicaciones\\Exte\\0.2.1_0';
    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        // Reemplaza con la ruta real a tu Google Chrome
        headless: false,
        args: ['--start-maximized',
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`
        ],
        devtools: false
    });

    AreaEspecial(browser);
}
async function AreaEspecial(browser) {
    const page = await browser.newPage();
    let Primerpaso = setTimeout(() => {
        console.log("ENTRO EN EL PRIMERPASO")
        page.close();
        AreaEspecial(browser);
    }, 20000);
    await page.setViewport({ width: 1368, height: 620 });
    await page.goto('https://annamineria.anm.gov.co/sigm/');


    try {

        console.log(user);
        console.log(pass);
        await page.type('#username', user);
        await page.type('#password', pass);

        page.click("#loginButton");

        page.setDefaultTimeout(0);

        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            timeout: 5000 // 5 segundos en milisegundos
        });
    } catch (ex) {
        console.log("Entro en el catch LOGIN");
    }
    let Segundopaso = setTimeout(() => {
        console.log("ENTRO EN EL Segundopaso")
        page.close();
        AreaEspecial(browser);
        clearTimeout(Segundopaso);
    }, 20000);
    clearTimeout(Primerpaso);

    await page.waitForTimeout(3000);

    try {
        const solicitudes = await page.$x('//span[contains(.,"Solicitudes")]');
        await solicitudes[1].click();

        const lblRadicar = await page.$x('//a[contains(.,"Radicar solicitud de Área de Reserva Especial")]');
        await lblRadicar[0].click();
        await page.waitForTimeout(2000);

        if (Agente == 1) {
            await page.waitForTimeout(2000);

            await page.evaluate(() => document.getElementById("submitterPersonOrganizationNameId").value = "");



            await page.type('#submitterPersonOrganizationNameId', '96232');

            await page.waitForTimeout(3000);

            await page.keyboard.press("Enter");

            await page.waitForTimeout(550);
        }


        const continPin = await page.$x('//span[contains(.,"Continuar")]');
        await continPin[1].click();

        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            timeout: 5000
        });

    } catch (error) {
        console.log("ERROR DONDE LE DA CONTINUAR");

    }



    await page.waitForSelector('button[ng-class="settings.buttonClasses"]');
    page.evaluate(() => {

        /* SELECCIONAR MINERALES POR NOMBRE */
        document.querySelector('[ng-class="settings.buttonClasses"]').click();

        var elementos = document.getElementsByClassName('ng-binding ng-scope');

        let Minerales = ['ARENAS', 'arenas'];
        let elementosConMinerales = [];

        for (let i = 0; i < elementos.length; i++) {
            let elemento = elementos[i];
            let agregarElemento = false;

            for (let c = 0; c < Minerales.length; c++) {

                if (elemento.textContent.includes(Minerales[c]) && elemento.textContent.split(/\s+/).includes(Minerales[c])) {
                    agregarElemento = true;
                    break;
                }
            }

            if (agregarElemento) {
                elementosConMinerales.push(elemento);
            }
        }


        for (let i = 0; i < elementosConMinerales.length; i++) {
            elementosConMinerales[i].click();
        }

        document.querySelector('[ng-class="settings.buttonClasses"]').click();
    });


    const selectArea = await page.$('select[name="areaOfConcessionSlct"]');
    await selectArea.type('Otro tipo de terreno');

    await page.waitForTimeout(1500);

    clearTimeout(Segundopaso);
    let Tercerpaso = setTimeout(() => {
        console.log("ENTRO EN EL Segundopaso")
        page.close();
        AreaEspecial(browser);
        clearTimeout(Segundopaso);
    }, 20000);
    console.log("LLegue hasta aca");


    await page.type('#selectedApplicantInputId', '96232');

    await page.waitForTimeout(3000);

    await page.keyboard.press("Enter");

    await page.waitForTimeout(550);

    const addProfesional = await page.$x('//span[contains(.,"Agregar")]');
    await addProfesional[0].click();

    await page.waitForTimeout(3000);

    let ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\Collective\\CertificadoAmbiental\\DocumentoRequerido.pdf`;

    await page.waitForSelector(`#p_PsraRsraMandatoryDocumentToAttachId0`);
    const RutaDelArchivoo = ArchivoAmbiental;
    for (let i = 0; i < 5; i++) {
        let id = `#p_PsraRsraMandatoryDocumentToAttachId${i}`
        let ElementoControladorDeCargaaa = await page.$(id);
        await ElementoControladorDeCargaaa.uploadFile(RutaDelArchivoo);

    }


    await page.waitForTimeout(2000);
    await page.type('#selectedCellInputMethodSlctId', '');
    console.log("prueba");

    const selectporCeldas = await page.$('select[id="selectedCellInputMethodSlctId"]');
    await selectporCeldas.type('U');



    const continPin2 = await page.$x('//span[contains(.,"Continuar")]');

    clearTimeout(Tercerpaso);
    var band = 1;
    while (true) {

        let ciclo = setTimeout(() => {
            console.log("ENTRO EN EL Tercerpaso")
            page.close();
            AreaEspecial(browser);
            return "error";
        }, 15000);
        await page.waitForTimeout(1000);



        function MonitorearAreas(IdArea, Area) {
            page.evaluate(({ Area }) => {
                document.querySelector('[id="cellIdsInptId"]').value = Area.join('');
                angular.element(document.getElementById('cellIdsInptId')).triggerHandler('change');
            }, { Area });

            DetallesCompletos = {
                IdArea: IdArea,

                Area: Area,

            }

            return DetallesCompletos;
        }
          if (band == 1) {
            // Establecer el valor directamente en el input
            await page.evaluate(() => {
                const eastingInput = document.getElementById('0applicantCoordinateEastingTxtId');
                eastingInput.value = '-75,5717'; // Usar el valor con punto decimal
                eastingInput.dispatchEvent(new Event('input', { bubbles: true })); // Disparar eventos necesarios

                const northingInput = document.getElementById('0applicantCoordinateNorthingTxtId');
                northingInput.value = '5,51955';
                northingInput.dispatchEvent(new Event('input', { bubbles: true }));
            });

            // Repetir para los otros inputs
            await page.evaluate(() => {
                const eastingInput2 = document.getElementById('1applicantCoordinateEastingTxtId');
                eastingInput2.value = '-75,5717';
                eastingInput2.dispatchEvent(new Event('input', { bubbles: true }));

                const northingInput2 = document.getElementById('1applicantCoordinateNorthingTxtId');
                northingInput2.value = '5,51955';
                northingInput2.dispatchEvent(new Event('input', { bubbles: true }));
            });
            MonitorearAreas("AreaDePrueba", ["18N05A25N06D"]);
        }  

        await page.waitForTimeout(500);

        await continPin2[1].click();

        await page.waitForTimeout(500);

        const Todoslosparametros = await page.$$eval("span", links =>
            links.map(link => link.textContent)
        );

        //console.log(Todoslosparametros);
        let cont = 1;
        for (let i = 0; i < Todoslosparametros.length; i++) {
            const elemento = Todoslosparametros[i];

            if (elemento == "Vea los errores a continuación:") {
                console.log(i);
                console.log(elemento);
                cont = 0;
            }

        }


        clearTimeout(ciclo);
        // console.log("Termiamos vlaida orfa");
        // await page.waitForTimeout(250000);
        if (cont == "0") {
            console.log("Limpio El campo del area");
            page.evaluate(() => {
                document.querySelector('[id="cellIdsTxtId"]').value = "";
            });
            band++;
            //Este es la cantidad de areas mas 1 
            if (band == 2) {
                band = 1;
            }

        } else {
            break;
        }

    }
    console.log("Sali !!!!!!!!!!!!!!!!!!");

    let ciclo2 = setTimeout(() => {
        console.log("ENTRO EN EL Tercerpaso")
        page.close();
        AreaEspecial(browser);
        return "error";
    }, 15000);
    var contador = 0;

    try {
        const HacerClicEnDiv = await page.$('div[id="p_PsraRsraDocumentTypeId5"]');
        await HacerClicEnDiv.click();
        if (HacerClicEnDiv) {
            console.log("CLICK!!!");
        } else {
            console.log("NDAAA");
        }



        const AparecioCaptcha = await page.waitForSelector('iframe[title="reCAPTCHA"]');
        if (AparecioCaptcha) {
            console.log("EL CAPTCHA YA ESTÁ DISPONIBLE");

        } else {
            console.log("EL CAPTCHA NO ESTÁ DISPONIBLE");
        }
        await keyboard.pressKey(Key.Tab);
        console.log(`PRESIONÉ LA TABULADORA`);
        await keyboard.pressKey(Key.Enter);
        console.log(`PRESIONÉ ENTER...`);

    } catch (error) {
        contador++;
        console.error("Falle dandole click", error);
        console.error("prueba", error)

    }

    while (true) {
        await page.waitForTimeout(700);
        console.log("Chequeando si el captcha está resuelto...");

        const isCaptchaResolved = await page.evaluate(() => {
            const responseField = document.querySelector('#g-recaptcha-response');
            return responseField && responseField.value.length > 0;
        });

        if (isCaptchaResolved) {
            console.log('El captcha ha sido resuelto.');

            break;
        } else {
            console.log('El captcha no ha sido resuelto aún.');
        }
    }
    const continuar = await page.$x('//span[contains(.,"Confirmar")]');
    try {
        await continuar[0].click();
    } catch (error) {

    }
    try {
        await continuar[1].click();
    } catch (error) {

    }
    clearTimeout(ciclo2);
    //console.log(continuar.length);
    await page.waitForTimeout(15000);
    AreaEspecial(browser);
    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
}







