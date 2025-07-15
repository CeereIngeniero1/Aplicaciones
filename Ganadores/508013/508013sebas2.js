const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require('console');
const { keyboard, mouse, Key, clipboard } = require('@nut-tree-fork/nut-js');
const colors = require('colors');

const os = require('os');
const NombreEquipo = os.hostname();
const EquiposGenerales = {
    'HPGRIS': "EQUIPO CREADOR",
    'DESKTOP-6JICI9S': "ASUS OLD",
    'DESKTOP-SNSPTLM': "DELLC3",
    'LAPTOP-2VU2EBUO': "EQUIPO VALEN",
    'HPRED240': "FER EQUIPO",
    'LAPTOP-JL0BL28F': "JORGE EQUIPO",
    'MERCADEO': "MERCADEO",
    'DESKTOP-RF3NUO3': "PIXEL",
    'HPRED241':"FERCHO ingeniero en sistemas best"
}


const EquipoActual = EquiposGenerales[NombreEquipo];
// Actualizado
var Empresa = 'Collective';
var user1 = '76966';
var pass1 = 'Collectivemining.2025.';
var user2 = '98908';
var pass2 = 'Sebas2025?';
var Agente = 1;

var ContadorVueltas = 0;

Pagina();
async function Pagina() {
    
    var Pines = fs.readFileSync('Pin.txt', 'utf-8', prueba = (error, datos) => {
        if (error) {
            throw error;
        } else {
            console.log(datos);
        }
    });
    for (let i = 0; i < Pines.length; i++) {
        if (Pines.substring(i + 1, i + 4) == 'C1:') {
            console.log(Pines.substring(i + 1, i + 4));
            Pin = Pines.substring(i + 4, i + 31);
            break
        }
    }



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

        Mineria(browser, Pin);

}




function Mineria(browser,  Pin) {
    (async () => {

        console.log("Esta es la vuelta " + ContadorVueltas);
        const page = await browser.newPage();

        let Primerpaso = setTimeout(() => {
            console.log("ENTRO EN EL PRIMERPASO")

            page.close();
            Mineria(browser,  Pin);

        }, 20000);





        await page.setViewport({ width: 1368, height: 620 });
        await page.goto('https://annamineria.anm.gov.co/sigm/');

        let user = (Agente == 0) ? user1 : user2;
        let pass = (Agente == 0) ? pass1 : pass2;

            try {

                console.log(user);
                console.log(pass);
                await page.type('#username', user);
                await page.type('#password', pass);

                page.click("#loginButton");


            } catch (ex) {
                console.log("Entro en el catch");
            }

        page.setDefaultTimeout(0);
        try {
            await page.waitForNavigation({
                waitUntil: 'networkidle0',
                timeout: 5000 // 5 segundos en milisegundos
            });
        } catch (error) {
            if (error instanceof puppeteer.errors.TimeoutError) {
                console.log('La navegación tardó más de 5 segundos.');
                // Aquí puedes manejar la situación cuando se supera el tiempo de espera
            } else {
                throw error; // Lanzar el error si no es un TimeoutError
            }
        }
        validador = 0;
        clearTimeout(Primerpaso);
        let Segundopaso = setTimeout(() => {
            console.log("ENTRO EN EL Segundopaso")
            page.close();
            Mineria(browser,  Pin);
        }, 35000);





        const solicitudes = await page.$x('//span[contains(.,"Solicitudes")]');
        await solicitudes[1].click();

        const lblRadicar = await page.$x('//a[contains(.,"Radicar solicitud de propuesta de contrato de concesión")]');
        await lblRadicar[0].click();
        if (Agente == 1) {
            await page.waitForTimeout(2000);


            //await page.evaluate(() => document.getElementById("submitterPersonOrganizationNameId").value = "")
            await page.evaluate(() => document.getElementById("submitterPersonOrganizationNameId").value = "");

            //await page.waitForSelector('select[id="submitterPersonOrganizationNameId"]');
            //const Agente = await page.$('select[id=" submitterPersonOrganizationNameId"]');

            await page.type('#submitterPersonOrganizationNameId', '76966');
            //await page.type('#submitterPersonOrganizationNameId', '');

            await page.waitForTimeout(3000);

            await page.keyboard.press("Enter");

            await page.waitForTimeout(550);
        }



        await page.waitForTimeout(2500)
        page.setDefaultTimeout(0);
        await page.waitForSelector('select[id="pinSlctId"]');
        const selectPin = await page.$('select[id="pinSlctId"]');
        await selectPin.type(Pin);
        console.log(Pin);

        /* VALIDAR SI EL PIN ESTÁ PRÓXIMO A VENCERSE */
            // Capturar todas las opciones de un select
            const allOptions = await page.evaluate(select => {
                const options = Array.from(select.options); // Convierte las opciones a un array
                return options.map(option => option.textContent); // Retorna un array con el texto de cada opción
            }, selectPin);

            console.log('Todas las opciones:', allOptions);

            const closestDateOption = await page.evaluate(() => {
                const select = document.querySelector('select');

                const monthMap = {
                    "ENE": "01",
                    "FEB": "02",
                    "MAR": "03",
                    "ABR": "04",
                    "MAY": "05",
                    "JUN": "06",
                    "JUL": "07",
                    "AGO": "08",
                    "SEP": "09",
                    "OCT": "10",
                    "NOV": "11",
                    "DIC": "12"
                };

                const options = Array.from(select.options).map(option => {
                    const text = option.textContent; // Ejemplo: "20241108074024, 08/DIC/2024"
                    const dateText = text.split(', ')[1]; // Extraer la fecha: "08/DIC/2024"

                    const [day, monthName, year] = dateText.split('/');
                    const month = monthMap[monthName];
                    const formattedDate = new Date(`${year}-${month}-${day}`);

                    return { text, date: formattedDate };
                });

                const now = new Date();

                const differences = options.map(option => {
                    const diff = Math.abs(option.date - now);
                    return { text: option.text, diff }; // Retornar la diferencia y el texto
                });

                console.log('Diferencias calculadas:', differences);

                // Reducir para encontrar la fecha más cercana
                const closest = options.reduce((prev, curr) => {
                    return (Math.abs(curr.date - now) < Math.abs(prev.date - now)) ? curr : prev;
                });

                return closest.text;
            });

            console.log('Opción más cercana a la fecha actual:', closestDateOption);
            const input = closestDateOption;
        /* FIN => VALIDACIÓN SI EL PIN ESTÁ PRÓXIMO A VENCERSE */

        await page.waitForXPath('//span[contains(.,"Continuar")]');
        const continPin = await page.$x('//span[contains(.,"Continuar")]');
        await continPin[1].click();
        await page.waitForTimeout(1000);

        const Fallopin = await page.$$eval("span", links =>

            links.map(link => link.textContent)
        );
        console.log(Fallopin[44]);
        var cont = 1;
        for (let i = 0; i < Fallopin.length; i++) {
            const elemento = Fallopin[i];
            //console.log("Este es el " + i + " " + Fallopin[i]);
            if (elemento == "Vea los errores a continuación:") {
                cont = 0;
            }

        }
        console.log(cont);
        if (cont == "0") {
            page.setDefaultTimeout(0);
            await page.waitForSelector('select[id="pinSlctId"]');
            const selectPin = await page.$('select[id="pinSlctId"]');
            await selectPin.type(Pin);

            await page.waitForXPath('//span[contains(.,"Continuar")]');
            const continPin = await page.$x('//span[contains(.,"Continuar")]');
            await continPin[1].click();
            /*
                        //await page.waitForTimeout(1000)
                        Primero();

                        browser.close();*/

        }

        /*await page.waitForNavigation({
           waitUntil: 'networkidle0',
       });*/

        if (await page.$x('//span[contains(.,"Vea los errores a continuación:")]').lenght > 0) {
            console.log('no pasó el pin');
            await page.waitForSelector('select[id="pinSlctId"]');
            const selectPin = await page.$('select[id="pinSlctId"]');
            await selectPin.type(Pin);

            const continPin = await page.$x('//span[contains(.,"Continuar")]');
            await continPin[1].click();
        }
        else if (await page.$x('//span[contains(.,"Vea los errores a continuación:")]').lenght == 0) {
            console.log('pasó el pin, hurra!');
        }






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
        });

        clearTimeout(Segundopaso);



        //console.log(Area10);
        var Aviso = 0;
        var contador = 0;
        var Band = 1;
        var IdArea = '';
        var SoloAviso = 0;
        ContadorVueltas++;
        var Comas = 0;
        var Texto = "";
        var liberadas = 0;
        var Celda = 0;

        let ComasTotalesPorArea = {};
      
        while (Band != 99) {

          
         

            console.log("Inicia el timer");
            let TimeArea = setTimeout(() => {
                console.log("ENTRO EN EL TimeArea");
                page.close();
                Mineria(browser,  Pin);
            }, 25000);

            const selectArea = await page.$('select[name="areaOfConcessionSlct"]');
            await selectArea.type('Otro tipo de terreno');


            const continDetallesdelArea = await page.$x('//a[contains(.,"área")]');
            await continDetallesdelArea[4].click();

            const selectporCeldas = await page.$('select[id="selectedCellInputMethodSlctId"]');
            await selectporCeldas.type('Usando el mapa de selección para dibujar un polígono o ingresar celdas');
            contador++;


            console.log(contador);

            console.log("y este es la bandera = " + Band);
            let DetallesCompletos;
            function MonitorearAreas(IdArea, Aviso, Celda, Area, Comas) {
                //console.log(IdArea, Aviso, Celda, Comas);

                page.evaluate(({ Area }) => {
                    document.querySelector('[id="cellIdsTxtId"]').value = Area.join('');
                    angular.element(document.getElementById('cellIdsTxtId')).triggerHandler('change');
                }, { Area });


                DetallesCompletos = {
                    IdArea: IdArea,
                    Aviso: Aviso,
                    Celda: Celda,
                    Area: Area,
                    Comas: Comas
                }

                return DetallesCompletos;
            }

            // if (Band == 1000) {
            //     MonitorearAreas(
            //         "AreaDePrueba",
            //         1,
            //         "Esto es una celda de prueba",
            //         ["18N05N14M12R"],
            //         0
            //     );
            // }


             if (Band == 1) {
                MonitorearAreas(
                    "508013",
                    1,
                    "18N08E20K08C",
                    ['18N08E25D05I, 18N08E20Q15N, 18N08E20Q10Y, 18N08E25D10Z, 18N08E25D05E, 18N08E20Q20Z, 18N08E20Q15P, 18N08E20Q10Z, 18N08E20Q05U, 18N08E20Q05P, 18N08E20Q05E, 18N08F21A06F, 18N08F21A01V, 18N08F21A01B, 18N08F16M06V, 18N08F16M06K, 18N08F16M06G, 18N08F16M06B, 18N08F16M01Q, 18N08F16M01F, 18N08F16I21L, 18N08F16M21X, 18N08F16M16M, 18N08F16M11X, 18N08F16M11H, 18N08F16M01M, 18N08F16M01H, 18N08F16I21X, 18N08F16M21T, 18N08F16M11Y, 18N08F16M11I, 18N08F16M01T, 18N08F16M01N, 18N08F16I21I, 18N08F16M21U, 18N08F16M16Z, 18N08F16M16E, 18N08F16M11U, 18N08F16I21P, 18N08F16M22A, 18N08F16M07Q, 18N08F16M07F, 18N08F16M02F, 18N08F16M02A, 18N08F16I22K, 18N08F16M07L, 18N08F16M02B, 18N08F16M17M, 18N08F16M07X, 18N08F16M07M, 18N08F16M02M, 18N08F16M22I, 18N08F16M22D, 18N08F16M02N, 18N08F16M22J, 18N08F16M17J, 18N08F16M17E, 18N08F16M12E, 18N08F16M07J, 18N08F16M18K, 18N08F16M18A, 18N08F16M13V, 18N08F16M03Q, 18N08F16M13R, 18N08F16M08W, 18N08F16M08S, 18N08F16M08L, 18N08F16M08H, 18N08F16M08C, 18N08F16I23R, 18N08F21A03D, 18N08F16M23T, 18N08F16M23D, 18N08F16M03N, 18N08F16I23N, 18N08F16M23Z, 18N08F16M13E, 18N08F16I23U, 18N08F16M24Q, 18N08F16M19V, 18N08F16M19K, 18N08F16M14Q, 18N08F16M14L, 18N08E25D15D, 18N08E25D10Y, 18N08E25D10N, 18N08E20Q20Y, 18N08E25D15E, 18N08E25D05Z, 18N08E20Q25Z, 18N08E20Q20J, 18N08E20Q10U, 18N08F16M21Q, 18N08F16M21F, 18N08F16M21A, 18N08F16M16R, 18N08F16M06A, 18N08F21A01C, 18N08F16M06C, 18N08F16I21M, 18N08F16I21H, 18N08F16M16I, 18N08F16M11T, 18N08F16M01Y, 18N08F21A01J, 18N08F21A01E, 18N08F16M11P, 18N08F16M06E, 18N08F16M01P, 18N08F16M01E, 18N08F16M12K, 18N08F16M07A, 18N08F16M02Q, 18N08F16I22V, 18N08F16I22Q, 18N08F16M22W, 18N08F16M12W, 18N08F16M07G, 18N08F16M02R, 18N08F16M22X, 18N08F16M17X, 18N08F16M17S, 18N08F16M22Y, 18N08F16M22T, 18N08F16M17Y, 18N08F16M12I, 18N08F16M22U, 18N08F16M22P, 18N08F16M02J, 18N08F16I22J, 18N08F21A03F, 18N08F16M23V, 18N08F16M18Q, 18N08F16M13Q, 18N08F16M03K, 18N08F16M23G, 18N08F16M18R, 18N08F16M18S, 18N08F16M18B, 18N08F16M08R, 18N08F16M03X, 18N08F16I23X, 18N08F16M08N, 18N08F16I23I, 18N08F21A03E, 18N08F16M23P, 18N08F16M18Z, 18N08F16M13P, 18N08F16M13J, 18N08F16M08U, 18N08F16M19Q, 18N08F16M19F, 18N08F16M19A, 18N08F16M24W, 18N08F16M19W, 18N08F16M09W, 18N08E25D05N, 18N08E20Q20D, 18N08E20Q10N, 18N08E20Q10I, 18N08E20Q10D, 18N08E20Q05N, 18N08E20Q20E, 18N08E20Q10E, 18N08F21A11A, 18N08F21A06V, 18N08F21A01G, 18N08F16M21K, 18N08F16M21G, 18N08F16M16G, 18N08F16M11L, 18N08F16M11G, 18N08F16M06W, 18N08F16I21V, 18N08F16M21H, 18N08F16M21C, 18N08F16M16C, 18N08F16M06M, 18N08F21A01I, 18N08F16M16T, 18N08F16M16D, 18N08F16M11D, 18N08F16M16J, 18N08F16M17F, 18N08F16M12V, 18N08F16M12F, 18N08F16M17W, 18N08F16M17B, 18N08F16M12L, 18N08F16I22W, 18N08F16M22S, 18N08F16M12S, 18N08F16M12M, 18N08F16M02C, 18N08F16M02T, 18N08F16M12P, 18N08F16M07P, 18N08F16M02E, 18N08F16I22P, 18N08F16M23K, 18N08F16M13F, 18N08F16M08V, 18N08F16M03F, 18N08F16I23K, 18N08F16I23F, 18N08F16M23M, 18N08F16M18X, 18N08F16M18L, 18N08F16M13L, 18N08F16M13M, 18N08F16M13G, 18N08F16I23L, 18N08F16I23M, 18N08F16I23G, 18N08F16M03Y, 18N08F16M03D, 18N08F16I23T, 18N08F16M23J, 18N08F16M18J, 18N08F16M13U, 18N08F16M24F, 18N08F16M14K, 18N08F16M14F, 18N08F16I24Q, 18N08F16I24F, 18N08F16M19R, 18N08F16M19B, 18N08F16M14W, 18N08F16M14R, 18N08F16I24W, 18N08F16I24G, 18N08E20Q25T, 18N08E20Q25I, 18N08E20Q15I, 18N08E20Q05I, 18N08E20L25Y, 18N08E25D10J, 18N08E25D05U, 18N08E20Q25U, 18N08E20Q15E, 18N08E20Q05J, 18N08E20L25J, 18N08F21A06Q, 18N08F21A01Q, 18N08F21A01A, 18N08F16M16V, 18N08F16M16W, 18N08F16M16K, 18N08F16M16F, 18N08F16M16B, 18N08F16M11R, 18N08F16M11K, 18N08F16M11B, 18N08F16M06L, 18N08F16M01V, 18N08F16M01W, 18N08F16M01G, 18N08F16M06X, 18N08F16M01X, 18N08F16I21S, 18N08F21A01D, 18N08F16M16N, 18N08F16M06I, 18N08F16M06D, 18N08F16M01I, 18N08F16M21Z, 18N08F16M11Z, 18N08F16M11E, 18N08F16M01U, 18N08F16I21U, 18N08F16I21J, 18N08F16M22Q, 18N08F16M12Q, 18N08F16M02K, 18N08F21A02G, 18N08F16M17R, 18N08F16M02W, 18N08F16I22R, 18N08F16I22G, 18N08F21A02C, 18N08F16M22M, 18N08F16M17H, 18N08F16M07H, 18N08F16M02X, 18N08F16M02H, 18N08F16I22S, 18N08F16M17T, 18N08F16M12N, 18N08F16M02Y, 18N08F16M02I, 18N08F16M17P, 18N08F16M12U, 18N08F16I22U, 18N08F21A03A, 18N08F16M13K, 18N08F21A03B, 18N08F16M23W, 18N08F16M23X, 18N08F16M23R, 18N08F16M18M, 18N08F16M18G, 18N08F16M13H, 18N08F16M08B, 18N08F16M03S, 18N08F16M03M, 18N08F16I23W, 18N08F16I23S, 18N08F16M18N, 18N08F16M13D, 18N08F16I23Y, 18N08F16M23E, 18N08F16M18U, 18N08F16M08P, 18N08F16M03P, 18N08F16I23Z, 18N08F16M09V, 18N08F16M04V, 18N08F16M04Q, 18N08F16M04K, 18N08F16M04F, 18N08F16M04A, 18N08F16M24G, 18N08F16M19G, 18N08F16M09L, 18N08F16M04L, 18N08F16M04B, 18N08E25D05T, 18N08E20Q25N, 18N08E20Q10T, 18N08E20Q05T, 18N08E25D10P, 18N08E25D05P, 18N08E25D05J, 18N08E20Q25E, 18N08E20Q15J, 18N08E20Q10J, 18N08E20L25Z, 18N08F21A06A, 18N08F21A01R, 18N08F21A01K, 18N08F16M21V, 18N08F16M21W, 18N08F16M21R, 18N08F16M11V, 18N08F16M11F, 18N08F16M11A, 18N08F16I21Q, 18N08F16M16H, 18N08F16M11M, 18N08F16M06H, 18N08F16M01S, 18N08F16M21N, 18N08F16I21Y, 18N08F16M16P, 18N08F16M01Z, 18N08F16M01J, 18N08F16I21Z, 18N08F21A02A, 18N08F16M07K, 18N08F16I22F, 18N08F16M22L, 18N08F16M22G, 18N08F16M12G, 18N08F16M12B, 18N08F21A02H, 18N08F16M17C, 18N08F16M12H, 18N08F16M07C, 18N08F16I22X, 18N08F16I22H, 18N08F21A02D, 18N08F16M17N, 18N08F16M17D, 18N08F16M07T, 18N08F16M22Z, 18N08F16M17Z, 18N08F16M07Z, 18N08F16M07U, 18N08F16M02Z, 18N08F16M23F, 18N08F16M18V, 18N08F16M08F, 18N08F16I23V, 18N08F16I23Q, 18N08F16M18W, 18N08F16M13W, 18N08F16M08M, 18N08F16M03B, 18N08F16M23Y, 18N08F16M08Y, 18N08F16M03T, 18N08F16M18E, 18N08F16M08J, 18N08F16M03Z, 18N08F16M09K, 18N08F16M14B, 18N08F16M09G, 18N08F16M04R, 18N08F16M04G, 18N08E25D10T, 18N08E25D05D, 18N08E20Q25D, 18N08E20Q20I, 18N08E20Q15D, 18N08E20Q05Y, 18N08E20L25T, 18N08E20L25I, 18N08E20Q25J, 18N08E20Q20U, 18N08E20Q10P, 18N08E20L25U, 18N08F21A01F, 18N08F16M21L, 18N08F16M16A, 18N08F16M06R, 18N08F16M01K, 18N08F16I21W, 18N08F16I21R, 18N08F16M21S, 18N08F16M01C, 18N08F16M21Y, 18N08F16I21T, 18N08F16M21J, 18N08F16M21E, 18N08F16M06U, 18N08F16M06P, 18N08F16M06J, 18N08F21A02F, 18N08F16M22K, 18N08F16M17K, 18N08F21A02B, 18N08F16M17L, 18N08F16M17G, 18N08F16M12R, 18N08F16M02L, 18N08F16M22H, 18N08F16M12C, 18N08F16I22M, 18N08F16M22N, 18N08F16M02D, 18N08F16I22Y, 18N08F16I22N, 18N08F21A02E, 18N08F16M22E, 18N08F16M23Q, 18N08F16M08Q, 18N08F16M03A, 18N08F21A03C, 18N08F16M23S, 18N08F16M23H, 18N08F16M18H, 18N08F16M18C, 18N08F16M13S, 18N08F16M03R, 18N08F16M03L, 18N08F16M03C, 18N08F16I23H, 18N08F16M18Y, 18N08F16M18I, 18N08F16M18D, 18N08F16M13N, 18N08F16M08T, 18N08F16M08I, 18N08F16M18P, 18N08F16M08E, 18N08F16M03J, 18N08F16M03E, 18N08F16M14V, 18N08F16M09Q, 18N08F21A04B, 18N08F16M24B, 18N08F16M09R, 18N08F16I24L, 18N08E25D10D, 18N08E20Q20T, 18N08E20Q15T, 18N08E20L25N, 18N08E25D10U, 18N08E20Q20P, 18N08E20Q15U, 18N08F21A01L, 18N08F16M11W, 18N08F16M06F, 18N08F16M01R, 18N08F16M01A, 18N08F16I21F, 18N08F21A01H, 18N08F16M21M, 18N08F16M16S, 18N08F16M06S, 18N08F16M21I, 18N08F16M21D, 18N08F16M06Y, 18N08F16M06T, 18N08F16M01D, 18N08F16M11J, 18N08F16M06Z, 18N08F16M17V, 18N08F16M17A, 18N08F16M12A, 18N08F16M22R, 18N08F16M22B, 18N08F16M07R, 18N08F16I22L, 18N08F16M02S, 18N08F16M12T, 18N08F16M07I, 18N08F16M07D, 18N08F16I22T, 18N08F16M12Z, 18N08F16M12J, 18N08F16M02P, 18N08F16M23A, 18N08F16M18F, 18N08F16M13A, 18N08F16M08A, 18N08F16M03V, 18N08F16M23C, 18N08F16M13C, 18N08F16M03W, 18N08F16M03G, 18N08F16M23N, 18N08F16M23I, 18N08F16M18T, 18N08F16M13T, 18N08F16M08D, 18N08F16M08Z, 18N08F16I23P, 18N08F16I23J, 18N08F16M24V, 18N08F16M14A, 18N08F16I24V, 18N08F16M24R, 18N08F16M19L, 18N08F16M14G, 18N08F16M09B, 18N08F16M04W, 18N08E25D10I, 18N08E25D05Y, 18N08E20Q25Y, 18N08E20Q20N, 18N08E20Q15Y, 18N08E20Q05D, 18N08E25D10E, 18N08E20Q25P, 18N08E20Q15Z, 18N08E20Q05Z, 18N08E20L25P, 18N08F21A06K, 18N08F16M21B, 18N08F16M16Q, 18N08F16M16L, 18N08F16M11Q, 18N08F16M06Q, 18N08F16M01L, 18N08F16M01B, 18N08F16I21K, 18N08F16I21G, 18N08F16M16X, 18N08F16M11S, 18N08F16M11C, 18N08F16M16Y, 18N08F16M11N, 18N08F16M06N, 18N08F16I21N, 18N08F16M21P, 18N08F16M16U, 18N08F16M22V, 18N08F16M22F, 18N08F16M17Q, 18N08F16M07V, 18N08F16M02V, 18N08F16M07W, 18N08F16M07B, 18N08F16M02G, 18N08F16M22C, 18N08F16M12X, 18N08F16M07S, 18N08F21A02I, 18N08F16M17I, 18N08F16M12Y, 18N08F16M12D, 18N08F16M07Y, 18N08F16M07N, 18N08F16I22I, 18N08F21A02J, 18N08F16M17U, 18N08F16M07E, 18N08F16M02U, 18N08F16I22Z, 18N08F16M08K, 18N08F16M23L, 18N08F16M23B, 18N08F16M13X, 18N08F16M13B, 18N08F16M08X, 18N08F16M08G, 18N08F16M03H, 18N08F16M13Y, 18N08F16M13I, 18N08F16M03I, 18N08F16M23U, 18N08F16M13Z, 18N08F16M03U, 18N08F21A04A, 18N08F16M24K, 18N08F16M24A, 18N08F16M09F, 18N08F16M09A, 18N08F16I24K, 18N08F16M24L, 18N08F16I24R'],
                    77
                );
            }
          




            // SE ACCEDE A CADA UNA DE LA INFORMACIÓN RETORNADA EN LA FUNCIÓN MonitorearAreas PARA UTILIZARLA MÁS ADELANTE EN OTROS PROCEOS
            IdArea = DetallesCompletos.IdArea;
            Aviso = DetallesCompletos.Aviso;
            Celda = DetallesCompletos.Celda;
            Area = DetallesCompletos.Area;
            Comas = DetallesCompletos.Comas;

            const continCeldas = await page.$x('//span[contains(.,"Continuar")]');
            await page.waitForTimeout(500);
            await continCeldas[1].click();
            console.log(IdArea);
            await page.waitForTimeout(1000);

            const Todoslosparametros = await page.$$eval("span", links =>
                links.map(link => link.textContent)
            );
            var cont = 1;
            for (let i = 0; i < Todoslosparametros.length; i++) {
                const elemento = Todoslosparametros[i];
                if (elemento == "Vea los errores a continuación (dentro de las pestañas):") {
                    cont = 0;
                }

            }
         




            if (cont == "0") {
                console.log("Limpio El campo del area");
                page.evaluate(() => {
                    document.querySelector('[id="cellIdsTxtId"]').value = "";
                });
                Band++;
                //Este es la cantidad de areas mas 1
                if (Band == 2) {
                    Band = 1;
                }

            } else {
                Band = 99;
            }
            console.log("limpia el timer");
            clearTimeout(TimeArea);
        }



        console.log("ahhh se salio Y_Y ");
        var bandera = 0;

        let TimeNOpaso = setTimeout(() => {
            bandera = 99;
            console.log("ENTRO EN EL TimeNOpaso");
            page.close();
            Mineria(browser,  Pin);
        }, 20000);

        console.log(page.url());

        while (bandera != 99) {



            await page.waitForTimeout(500);
            console.log(page.url());
            if (page.url() == 'https://annamineria.anm.gov.co/sigm/index.html#/p_CaaIataInputTechnicalEconomicalDetails') {
                bandera = 99;

                console.log("Si cargo la pagina  ");
                clearTimeout(TimeNOpaso);
            } else {

                console.log("Nada no la carga ");
            }



        }



        clearTimeout(TimeNOpaso);









        const continDetallesdelArea2 = await page.$x('//a[contains(.,"área")]');
        await continDetallesdelArea2[4].click();

        const grupoEtnicoYN = await page.$('input[value="N"]');
        await grupoEtnicoYN.click();


        const btnInfoTecnica = await page.$x('//a[contains(.,"Información t")]');
        await btnInfoTecnica[0].click();

        


        let RadiPrimero = setTimeout(() => {

            // console.log("ENTRO EN EL RadiPrimero");
            // page.close();
            // Mineria(browser,  Pin);


        }, 30000);

        await page.evaluate(() => {

            document.querySelector('[id="yearOfExecutionId0"]').value = 'number:1'

            angular.element(document.getElementById('yearOfExecutionId0')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId0"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId0')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId0"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId0')).triggerHandler('change');

            //Contactos con la comunidad y enfoque social

            document.querySelector('[id="yearOfExecutionId1"]').value = 'number:1'

            angular.element(document.getElementById('yearOfExecutionId1')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId1"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId1')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId1"]').value = 'TSCA'

            angular.element(document.getElementById('laborSuitabilityId1')).triggerHandler('change');

            //Base topográfica del área

            document.querySelector('[id="yearOfExecutionId2"]').value = 'number:1'

            angular.element(document.getElementById('yearOfExecutionId2')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId2"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId2')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId2"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId2')).triggerHandler('change');

            //Cartografía geológica

            document.querySelector('[id="yearOfExecutionId3"]').value = 'number:1'

            angular.element(document.getElementById('yearOfExecutionId3')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId3"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId3')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId3"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId3')).triggerHandler('change');

            //Excavación de trincheras y apiques

            document.querySelector('[id="yearOfExecutionId4"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId4')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId4"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId4')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId4"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId4')).triggerHandler('change');

            //Geoquímica y otros análisis

            document.querySelector('[id="yearOfExecutionId5"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId5')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId5"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId5')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId5"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId5')).triggerHandler('change');

            //Geofísica

            document.querySelector('[id="yearOfExecutionId6"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId6')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId6"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId6')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId6"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId6')).triggerHandler('change');

            //Estudio de dinámica fluvial del cauce

            document.querySelector('[id="yearOfExecutionId7"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId7')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId7"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId7')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId7"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId7')).triggerHandler('change');

            // Características hidrológicas y sedimentológicas del cauce

            document.querySelector('[id="yearOfExecutionId8"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId8')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId8"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId8')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId8"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId8')).triggerHandler('change');

            //Pozos y Galerías Exploratorias

            document.querySelector('[id="yearOfExecutionId9"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId9')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId9"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId9')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId9"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId9')).triggerHandler('change');

            //Perforaciones profundas

            document.querySelector('[id="yearOfExecutionId10"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId10')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId10"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId10')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId10"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId10')).triggerHandler('change');

            //Muestreo y análisis de calidad

            document.querySelector('[id="yearOfExecutionId11"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId11')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId11"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId11')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId11"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId11')).triggerHandler('change');

            //Estudio geotécnico

            document.querySelector('[id="yearOfExecutionId12"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId12')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId12"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId12')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId12"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId12')).triggerHandler('change');

            //Estudio Hidrológico

            document.querySelector('[id="yearOfExecutionId13"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId13')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId13"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId13')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId13"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId13')).triggerHandler('change');

            //Estudio Hidrogeológico

            document.querySelector('[id="yearOfExecutionId14"]').value = 'number:2'

            angular.element(document.getElementById('yearOfExecutionId14')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId14"]').value = 'number:2'

            angular.element(document.getElementById('yearOfDeliveryId14')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId14"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId14')).triggerHandler('change');

            //Evaluación del modelo geológico

            document.querySelector('[id="yearOfExecutionId15"]').value = 'number:3'

            angular.element(document.getElementById('yearOfExecutionId15')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId15"]').value = 'number:3'

            angular.element(document.getElementById('yearOfDeliveryId15')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId15"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId15')).triggerHandler('change');

            //Actividades exploratorias adicionales (Se describe en el anexo Tecnico que se allegue)

            document.querySelector('[id="yearOfExecutionId16"]').value = 'number:3'

            angular.element(document.getElementById('yearOfExecutionId16')).triggerHandler('change');

            document.querySelector('[id="yearOfDeliveryId16"]').value = 'number:3'

            angular.element(document.getElementById('yearOfDeliveryId16')).triggerHandler('change');

            document.querySelector('[id="laborSuitabilityId16"]').value = 'IIG'

            angular.element(document.getElementById('laborSuitabilityId16')).triggerHandler('change');



            // Actividades Ambientales etapa de exploración


            //Selección optima de Sitios de Campamentos y Helipuertos

            angular.element(document.getElementById('envYearOfDeliveryId0')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId0"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId0')).triggerHandler('change');

            //Manejo de Aguas Lluvias


            angular.element(document.getElementById('envYearOfDeliveryId1')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId1"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId1')).triggerHandler('change');

            //Manejo de Aguas Residuales Domesticas


            angular.element(document.getElementById('envYearOfDeliveryId2')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId2"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId2')).triggerHandler('change');

            //Manejo de Cuerpos de Agua

            angular.element(document.getElementById('envYearOfDeliveryId3')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId3"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId3')).triggerHandler('change');

            //Manejo de Material Particulado y Gases


            angular.element(document.getElementById('envYearOfDeliveryId4')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId4"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId4')).triggerHandler('change');

            //Manejo del Ruido


            angular.element(document.getElementById('envYearOfDeliveryId5')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId5"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId5')).triggerHandler('change');

            // Manejo de Combustibles

            angular.element(document.getElementById('envYearOfDeliveryId6')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId6"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId6')).triggerHandler('change');

            //Manejo de Taludes


            angular.element(document.getElementById('envYearOfDeliveryId7')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId7"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId7')).triggerHandler('change');

            //Manejo de Accesos


            angular.element(document.getElementById('envYearOfDeliveryId8')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId8"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId8')).triggerHandler('change');

            // Manejo de Residuos Solidos

            angular.element(document.getElementById('envYearOfDeliveryId9')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId9"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId9')).triggerHandler('change');

            //Adecuación y Recuperación de Sitios de Uso Temporal


            angular.element(document.getElementById('envYearOfDeliveryId10')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId10"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId10')).triggerHandler('change');

            //Manejo de Fauna y Flora


            angular.element(document.getElementById('envYearOfDeliveryId11')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId11"]').value = 'IFEB'

            angular.element(document.getElementById('envLaborSuitabilityId11')).triggerHandler('change');

            //Plan de Gestión Social


            angular.element(document.getElementById('envYearOfDeliveryId12')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId12"]').value = 'TSCA'

            angular.element(document.getElementById('envLaborSuitabilityId12')).triggerHandler('change');

            //capacitación de Personal


            angular.element(document.getElementById('envYearOfDeliveryId13')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId13"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId13')).triggerHandler('change');

            //Contratación de Mano de Obra no Calificada


            angular.element(document.getElementById('envYearOfDeliveryId14')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId14"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId14')).triggerHandler('change');

            //Rescate Arqueológico


            angular.element(document.getElementById('envYearOfDeliveryId15')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId15"]').value = 'ARQ'

            angular.element(document.getElementById('envLaborSuitabilityId15')).triggerHandler('change');

            //Manejo de Hundimientos


            angular.element(document.getElementById('envYearOfDeliveryId16')).triggerHandler('change');

            document.querySelector('[id="envLaborSuitabilityId16"]').value = 'MULT'

            angular.element(document.getElementById('envLaborSuitabilityId16')).triggerHandler('change');


        });

        // SELECCIÓN DE PROFESIONALES => CONTADOR(ES), GEÓLOGO(S), INGENIERO(S) GEÓLOGO(S), INGENIERO(S) DE MINAS
        // ==============================================================================
        console.log("INICIA LA SELECCIÓN DE LOS PROFESIONALES");
        console.log('================================================================');
        let profesionales = [
            { tipo: "Geólogo", nombres: ["Oscar Javier Pinilla Reyes (73619)"] },
            //  { tipo: "Ingeniero Geólogo", nombres: [""]},
            //  { tipo: "Ingeniero de Minas", nombres: [""]}
        ];

        await seleccionar_Profesional(profesionales, page, 1);

        // Hacer clic en el botón "Agregar"
        const addProfesional = await page.$x('//span[contains(.,"Agregar")]');
        await addProfesional[0].click();


        console.log('================================================================');
        console.log("FIN DE LA SELECCIÓN DE LOS PROFESIONALES");
        // =============================================================================

        // Acepta terminos y da clic en continuar
        await page.click('#technicalCheckboxId');
        const btnInfoEconomica = await page.$x('//a[contains(.,"Información eco")]');
        await btnInfoEconomica[0].click();

        // SELECCIÓN DEL CONTADOR
        // ==============================================================================
        console.log("INICIA LA SELECCIÓN DE CONTADOR(ES)");
        console.log('================================================================');
        let Contador_es = [
            { tipo: "Contador", nombres: ["PABLO ESTEBAN MONTOYA MONTOYA (91124)"] },
        ];

        await seleccionar_Profesional(Contador_es, page, 2);

        console.log('================================================================');
        console.log("FIN DE LA SELECCIÓN DE CONTADOR(ES)");
        // ==============================================================================

        // SELECCIÓN DE LOS VALORES
        // ==============================================================================
        await page.waitForSelector('#personClassificationId0');
        await page.select('#personClassificationId0', 'PJ');
        await page.evaluate(() => {


            // Check
            // document.querySelector('Input[id="declareIndId0"]').click();

            //Valores
            // document.getElementById('currentAssetId0').value = '42539369275' // OLD
            document.getElementById('activoCorrienteId0').value = '31049615000';

            angular.element(document.getElementById('activoCorrienteId0')).triggerHandler('change');

            // document.getElementById('currentLiabilitiesId0').value = '15184416062' // OLD
            document.getElementById('pasivoCorrienteId0').value = '7024772000';

            angular.element(document.getElementById('pasivoCorrienteId0')).triggerHandler('change');

            // document.getElementById('totalAssetId0').value = '48322540755' // OLD
            document.getElementById('activoTotalId0').value = '193966804000';

            angular.element(document.getElementById('activoTotalId0')).triggerHandler('change');

            // document.getElementById('totalLiabilitiesId0').value = '15401226207' // OLD
            document.getElementById('pasivoTotalId0').value = '7345458000';

            angular.element(document.getElementById('pasivoTotalId0')).triggerHandler('change');
        });
        // ==============================================================================





        const continPag4 = await page.$x('//span[contains(.,"Continuar")]');
        await continPag4[1].click();
        // Esperar la navegación
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            // timeout: 2000 // Ajusta el timeout según tus necesidades
        });
        clearTimeout(RadiPrimero);
        let Radisegundo = setTimeout(() => {

            console.log("ENTRO EN EL Radisegundo");
            //page.close();
            Mineria(browser,  Pin);


        }, 30000);




        console.timeEnd('Deteccion a adjuntar');
        const btncenti = await page.$x('//a[contains(.,"Certificac")]');
        await btncenti[0].click();

        // await page.waitForTimeout(200);
        console.log("Vamos aca");

        // await page.waitForTimeout(200);


        await page.waitForSelector(`#p_CaaCataEnvMandatoryDocumentToAttachId0`);
        const RutaDelArchivoo = `C:\\Aplicaciones\\Documentos\\${Empresa}\\Sheips\\${IdArea}.zip`;
        const ElementoControladorDeCargaaa = await page.$(`#p_CaaCataEnvMandatoryDocumentToAttachId0`);
        await ElementoControladorDeCargaaa.uploadFile(RutaDelArchivoo);


        console.log("YA ESCRIBIO a");

        // await page.waitForTimeout(1000);

        try {

            
            let ArchivoAmbiental ;
            ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508013.pdf`;
           
            
            
            await page.waitForSelector(`#p_CaaCataEnvMandatoryDocumentToAttachId1`);
            const RutaDelArchivoo = ArchivoAmbiental;
            const ElementoControladorDeCargaaa = await page.$(`#p_CaaCataEnvMandatoryDocumentToAttachId1`);
            await ElementoControladorDeCargaaa.uploadFile(RutaDelArchivoo);



            // await page.waitForTimeout(300);
            await page.click('#acceptanceOfTermsId');
            console.log("Ahora Vamos aca 3333333");
            // await page.waitForTimeout(300);

            const btnDocuSopor = await page.$x('//a[contains(.,"Documentac")]');
            await btnDocuSopor[0].click();
            console.log("si llego");
            await page.waitForTimeout(300);


            console.log("INICIA PROCESO DE ADJUNTAR DOCUMENTOS REGLAMENTARIOS");
            console.log('================================================================');

            let Documentos = [
                "1. Aceptacion Del Profesional Para Refrendar Documentos Tecnicos.pdf",//1
                "2. Fotocopia Tarjeta Profesional.pdf",//2
                "4. Declaracion De Renta Proponente 1 Anio 1.pdf",//3
                "5. Declaracion De Renta Proponente 1 Anio 2.pdf",//4
                "6. Estados Financieros Propios Certificados Y O Dictaminados Proponente 1 Anio 1.pdf",//5
                "7. Estados Financieros Propios Certificados Y O Dictaminados Proponente 1 Anio 2.pdf",//6
                "8. Extractos Bancarios Proponente 1.pdf",//7
                "9. RUT.pdf",//8
                "10. Fotocopia Documento De Identificacion.pdf",//9
                "11. Certificado De Composicion Accionaria De La Sociedad.pdf",//10
                "12. Certificado De Existencia Y Representacion Legal.pdf",//11
                "13. Certificado Vigente De Antecedentes Disciplinarios.pdf",//12
                "14. Fotocopia Tarjeta Profesional Del Contador Revisor Fiscal.pdf",//13

            ];

            let ElementosFile = [
                "p_CaaCataMandatoryDocumentToAttachId0",//1
                "p_CaaCataMandatoryDocumentToAttachId1",//2
                "p_CaaCataMandatoryDocumentToAttachId3",//3
                "p_CaaCataMandatoryDocumentToAttachId4",//4
                "p_CaaCataMandatoryDocumentToAttachId5",//5
                "p_CaaCataMandatoryDocumentToAttachId6",//6
                "p_CaaCataMandatoryDocumentToAttachId7",//7
                "p_CaaCataMandatoryDocumentToAttachId8",//8
                "p_CaaCataMandatoryDocumentToAttachId9",//9
                "p_CaaCataMandatoryDocumentToAttachId10",//10
                  "p_CaaCataMandatoryDocumentToAttachId11",//11
                 "p_CaaCataMandatoryDocumentToAttachId12",//12
                "p_CaaCataMandatoryDocumentToAttachId13",//13
                // "p_CaaCataMandatoryDocumentToAttachId14"//14
            ];
                console.log(ElementosFile.length);
            try {
                for (let i = 0; i < ElementosFile.length; i++) {
                    try {
                        await page.waitForSelector(`#${ElementosFile[i]}`);
                        const RutaDelArchivo = `C:\\Aplicaciones\\Documentos\\${Empresa}\\DocumentosReglamentarios\\${Documentos[i]}`;
                        const ElementoControladorDeCarga = await page.$(`#${ElementosFile[i]}`);
                        await ElementoControladorDeCarga.uploadFile(RutaDelArchivo);

                        // Verificar si el archivo se cargó correctamente
                        console.log(`Archivo ${Documentos[i]} adjuntado correctamente.`);

                    } catch (error) {
                        console.log(`Error al cargar el archivo ${Documentos[i]}:`, error);

                        // Detener el bucle o manejar el error como sea necesario
                        throw new Error(`Error al cargar el archivo ${Documentos[i]}`);
                    }
                }
                console.log("sadas");
            } catch (error) {
                console.error('Error general al adjuntar archivos:', error);
            }

            console.log('================================================================');
            console.log('FINALIZA PROCESO DE ADJUNTAR DOCUMENTOS REGLAMENTARIOS');

            // await page.waitForTimeout(2000);

        } catch (error) {
            console.log('BOTO ERROR');
        }


        const continPag = await page.$x('//span[contains(.,"Continuar")]');
        await continPag[1].click();
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });
        console.log(" si navego ");



        //CAPTURA DE PANTALLA
        clearTimeout(Radisegundo);

        let RadiTercero = setTimeout(() => {

            console.log("ENTRO EN EL Radisegundo");
            //page.close();
            Mineria(browser,  Pin);
        }, 60000);



        const HacerClicEnSpanDocumentacionDeSoporte = await page.$x('//a[contains(.,"Documentac")]');
        await HacerClicEnSpanDocumentacionDeSoporte[0].click();
        const AparecioCaptcha = await page.waitForSelector('iframe[title="reCAPTCHA"]');
        if (AparecioCaptcha) {
            console.log("EL CAPTCHA YA ESTÁ DISPONIBLE");
            await page.waitForTimeout(500);
        } else {
            console.log("EL CAPTCHA NO ESTÁ DISPONIBLE");
        }

        for (let i = 0; i < 1; i+=1) {
            // await page.keyboard.press('Tab');
            await keyboard.pressKey(Key.Tab);
            console.log(`PRESIONÉ LA TABULADORA EN ITERACIÓN ${i}`);
        }

        await keyboard.pressKey(Key.Enter);

        // await page.waitForTimeout(1000000);


        while (true) {
            await page.waitForTimeout(1000);
            console.log("Chequeando si el captcha está resuelto...");

            const isCaptchaResolved = await page.evaluate(() => {
                const responseField = document.querySelector('#g-recaptcha-response');
                return responseField && responseField.value.length > 0;
            });

            if (isCaptchaResolved) {
                console.log('El captcha ha sido resuelto.');
                clearTimeout(RadiTercero);
                break;
            } else {
                console.log('El captcha no ha sido resuelto aún.');
            }
        }



        console.log('51. Bóton Radicar');

        const btnRadicar1 = await page.$x('//span[contains(.,"Radicar")]');
        console.log("Este es el boton radicar : " + btnRadicar1);

        //await page.waitForTimeout(4000);
        console.log("Le di click");

        try {
            await btnRadicar1[0].click();
        } catch (exepcion) {
            console.log("La pos 0 No fue ")
        }
        try {

            await btnRadicar1[1].click();
        } catch (exepcion) {
            console.log("La 1 tampoco Y_Y")
        }

     
        clearTimeout(Radisegundo);
        await page.waitForTimeout(180000);
        Mineria(browser,  Pin);







    })();
}







async function seleccionar_Profesional(profesionales, page, Tipo) {
    for (const profesional of profesionales) {
        const tipoProfesional = profesional.tipo;
        const nombres = profesional.nombres;
        let selectTipoProfesion;
        let addProfesional;
        // Seleccionar el tipo de profesional en el primer select
        if (Tipo == 1) {
            selectTipoProfesion = await page.$('select[id="techProfessionalDesignationId"]');
        } else {
            selectTipoProfesion = await page.$('select[id="ecoProfessionalDesignationId"]');
        }

        await selectTipoProfesion.type(tipoProfesional);

        // Iterar sobre los nombres y seleccionar cada uno en el segundo select
        for (const nombre of nombres) {
            console.log("Tipo Profesional: " + tipoProfesional + " - " + "Nombres: " + "(" + nombre + ")");
            let selectProfesional;
            if (Tipo == 1) {
                selectProfesional = await page.$('select[id="techApplicantNameId"]');
            } else {
                selectProfesional = await page.$('select[id="ecoApplicantNameId"]');
            }

            await page.waitForTimeout(300);
            await selectProfesional.type(nombre);
            // Hacer clic en el botón "Agregar"

            await page.waitForTimeout(100); // Esperar 100 milisegundos

            addProfesional = await page.$x('//span[contains(.,"Agregar")]');
            if (Tipo == 1) {
                await addProfesional[0].click();

            } else {
                try {
                    await addProfesional[0].click();
                } catch (error) {
                    console.log("ERR 0");
                    console.log (`Bro manito sabe que  pilke -> ${error}`)
                }
                try {
                    await addProfesional[1].click();
                } catch (error) {
                    console.log("ERR 1");
                    console.log (`Bro manito sabe que  pilke -> ${error}`)
                }
                try {
                    await addProfesional[2].click();

                } catch (error) {
                    console.log("ERR 2");
                    console.log (`Bro manito sabe que  pilke -> ${error}`)
                }
                try {

                    await addProfesional[3].click();
                } catch (error) {
                    console.log("ERR 3");
                    console.log (`Bro manito sabe que  pilke -> ${error}`)
                }
                try {

                    await addProfesional[4].click();
                } catch (error) {
                    console.log("ERR 4");
                    console.log (`Bro manito sabe que  pilke -> ${error}`)
                }
            }

        }
    }
}
