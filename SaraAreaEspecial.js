const puppeteer = require('puppeteer');


const user = '96458';
const pass = 'Sarita2024*';

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

    try {
        const solicitudes = await page.$x('//span[contains(.,"Solicitudes")]');
        await solicitudes[1].click();

        const lblRadicar = await page.$x('//a[contains(.,"Radicar solicitud de Área de Reserva Especial")]');
        await lblRadicar[0].click();
        await page.waitForTimeout(2000);

        const continPin = await page.$x('//span[contains(.,"Continuar")]');
        await continPin[1].click();

        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            timeout: 5000
        });

    } catch (error) {
        console.log("ERROR DONDE LE DA CONTINUAR");
        page.close();
        AreaEspecial(browser);
        clearTimeout(Segundopaso);
    }

    

    await page.waitForSelector('button[ng-class="settings.buttonClasses"]');
    page.evaluate(() => {

        /* SELECCIONAR MINERALES POR NOMBRE */
        document.querySelector('[ng-class="settings.buttonClasses"]').click();

        var elementos = document.getElementsByClassName('ng-binding ng-scope');

        let Minerales = ['COBRE', 'cobre', 'MOLIBDENO', 'molibdeno', 'NIQUEL', 'niquel', 'ORO', 'oro', 'PLATA', 'plata', 'PLATINO', 'platino', 'WOLFRAMIO', 'wolframio', 'ZINC', 'zinc'];
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

    await page.waitForTimeout(3000);

    //clearTimeout(Segundopaso);
    console.log("LLegue hasta aca");

}

async function AreaEspecial2(browser) {




    const page = await browser.newPage();
    await page.setViewport({ width: 1368, height: 620 });
    await page.goto('https://annamineria.anm.gov.co/sigm/');



    let Primerpaso = setTimeout(() => {
        console.log("ENTRO EN EL PRIMERPASO")


        page.close();

        AreaEspecial(browser);
        return "error";
    }, 10000);
    try {
        await page.type('#username', user);
        await page.type('#password', pass);
        page.click("#loginButton");
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            timeout: 5000 // 5 segundos en milisegundos
        });
    } catch (error) {
        console.log("Entro en el catch LOGIN");
    }

    clearTimeout(Primerpaso);

    let Segundopaso = setTimeout(() => {
        console.log("ENTRO EN EL Segundopaso")
        page.close();
        AreaEspecial(browser);
        return "error";
    }, 10000);

    try {
        const solicitudes = await page.$x('//span[contains(.,"Solicitudes")]');
        await solicitudes[1].click();

        const lblRadicar = await page.$x('//a[contains(.,"Radicar solicitud de Área de Reserva Especial")]');
        await lblRadicar[0].click();
        await page.waitForTimeout(2000);

        const continPin = await page.$x('//span[contains(.,"Continuar")]');
        await continPin[1].click();

        

    } catch (error) {
        console.log("ERROR DONDE LE DA CONTINUAR");
    }

    try {
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            timeout: 5000
        });
    } catch (error) {
        if (error instanceof puppeteer.errors.TimeoutError) {
            console.log('La navegación tardó más de 5 segundos.');

        } else {
            throw error;
        }
    }
    clearTimeout(Segundopaso);
    let Tercerpaso = setTimeout(() => {
        console.log("ENTRO EN EL Tercerpaso")
        page.close();
        AreaEspecial(browser);
        return "error";
    }, 20000);


    await page.waitForSelector('button[ng-class="settings.buttonClasses"]');
    page.evaluate(() => {

        /* SELECCIONAR MINERALES POR NOMBRE */
        document.querySelector('[ng-class="settings.buttonClasses"]').click();

        // SE OBTIENEN LOS ELEMENTOS QUE TIENEN LA CLASE 'ng-binding ng-scope'
        var elementos = document.getElementsByClassName('ng-binding ng-scope');

        let Minerales = ['COBRE', 'cobre', 'MOLIBDENO', 'molibdeno', 'NIQUEL', 'niquel', 'ORO', 'oro', 'PLATA', 'plata', 'PLATINO', 'platino', 'WOLFRAMIO', 'wolframio', 'ZINC', 'zinc'];
        let elementosConMinerales = [];

        // ITERA SOBRE TODOS LOS ELEMENTOS CON CLASE (ng-binding ng-scope)
        for (let i = 0; i < elementos.length; i++) {
            let elemento = elementos[i];
            let agregarElemento = false;

            // ITERA SOBRE TODOS LOS VALORES DE LA LISTA MINERALES
            for (let c = 0; c < Minerales.length; c++) {

                // VERIFICA SI EL TEXTO DEL ELEMENTO CONTIENE EXACTAMENTE EL MINERAL EN PROCESO DE LA LISTA DE MINERALES
                if (elemento.textContent.includes(Minerales[c]) && elemento.textContent.split(/\s+/).includes(Minerales[c])) {
                    agregarElemento = true;
                    break;
                }
            }

            // SI SE CUMPLE AGREGARELEMENTO === TRUE, SE AGREGA EL ELEMENTO A LA LISTA ELEMENTOSCONMINERALES
            if (agregarElemento) {
                elementosConMinerales.push(elemento);
            }
        }

        // SE HACE CLIC SOBRE TODOS LOS VALORES CONTENIEDOS EN LA LISTA ELEMENTOSCONMINERALES
        for (let i = 0; i < elementosConMinerales.length; i++) {
            elementosConMinerales[i].click();
        }
        /* FIN FIN FIN */
        document.querySelector('[ng-class="settings.buttonClasses"]').click();
    });


    const selectArea = await page.$('select[name="areaOfConcessionSlct"]');
    await selectArea.type('Otro tipo de terreno');

    await page.waitForTimeout(3000);

    // await page.evaluate(() => document.getElementById("submitterPersonOrganizationNameId").value = "");

    // await page.type('#selectedApplicantInputId', '83949');
    await page.type('#selectedApplicantInputId', '76966');

    await page.waitForTimeout(4000);

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
    var band = 0;
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
                eastingInput.value = '-73,64974'; // Usar el valor con punto decimal
                eastingInput.dispatchEvent(new Event('input', { bubbles: true })); // Disparar eventos necesarios

                const northingInput = document.getElementById('0applicantCoordinateNorthingTxtId');
                northingInput.value = '7,22473';
                northingInput.dispatchEvent(new Event('input', { bubbles: true }));
            });

            // Repetir para los otros inputs
            await page.evaluate(() => {
                const eastingInput2 = document.getElementById('1applicantCoordinateEastingTxtId');
                eastingInput2.value = '-73,64974';
                eastingInput2.dispatchEvent(new Event('input', { bubbles: true }));

                const northingInput2 = document.getElementById('1applicantCoordinateNorthingTxtId');
                northingInput2.value = '7,22473';
                northingInput2.dispatchEvent(new Event('input', { bubbles: true }));
            });
            MonitorearAreas("AreaDePrueba", ["18N03E14P01A"]);

        }


        await page.waitForTimeout(1000);

        await continPin2[1].click();

        await page.waitForTimeout(3000);

        const Todoslosparametros = await page.$$eval("span", links =>
            links.map(link => link.textContent)
        );
        let cont = 1;
        for (let i = 0; i < Todoslosparametros.length; i++) {
            const elemento = Todoslosparametros[i];
            console.log(elemento);
            if (elemento == "Vea los errores a continuación (dentro de las pestañas):") {
                cont = 0;
            }

        }


        clearTimeout(ciclo);
        await page.waitForTimeout(250000);
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
    await page.waitForTimeout(250000);


}











