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
var pass1 = 'CML2025_Supia';
var user2 = '84928';
var pass2 = 'C1000191991*';
var Agente = 1;
var EnviarCorreosParaPestanas = 0;
var contreapertura = 0;
var ContadorVueltas = 0;
var contComasceldas = 0;
var Cag = false;
var Caggrande = false;
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
        var Comas = 0;
        var Texto = "";
        var liberadas = 0;
        var Celda = 0;
        var ComparacionCeldas = "";
        var areaFiltrado;
        var Filtrado;
        let ComasTotalesPorArea = {};
        while (Band != 99) {

            if (Band == 81) {
                console.log("Aviso")
                Filtrado = `${areaFiltrado.join(', ')}`;
                //console.log(  `["${areaFiltrado.join(', ')}"],` ) 
                console.log("FILTRADO " + Filtrado);
                // await page.waitForTimeout(2000000);
            }

            console.log("Inicia el timer");
            let TimeArea = setTimeout(() => {
                console.log("ENTRO EN EL TimeArea");
                page.close();
                Mineria(browser, Pin);
                clearTimeout(TimeArea);

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
            var DetallesCompletos;
            function MonitorearAreas(IdArea, Aviso, Celda, Area, Comas) {
                //console.log(IdArea, Aviso, Celda, Comas);

                // Asegúrate de que Area es un array de celdas sin espacios innecesarios
                const AreaCeldas = Area[0].split(',').map(celda => celda.trim());
                console.log(Area);
                page.evaluate(({ Area }) => {
                    document.querySelector('[id="cellIdsTxtId"]').value = Area.join('');
                    angular.element(document.getElementById('cellIdsTxtId')).triggerHandler('change');
                }, { Area });


                DetallesCompletos = {
                    IdArea: IdArea,
                    Aviso: Aviso,
                    Celda: Celda,
                    Area: Area,
                    Comas: Comas,
                    ComparacionCeldas: AreaCeldas, // Usa el array de celdas limpio
                }

                return DetallesCompletos;
            }

            // CELDA DE PRUEBA, DISPONIBLE
            // if (Band == 1) {
            //     MonitorearAreas(
            //         "007-85M",
            //         1,
            //         "Esto es una celda de prueba",
            //         ["18N05N14M12R"],
            //         0
            //     );
            // }


            if (Band == 1) {
                MonitorearAreas(
                    "508353Inferior",
                    1,
                    "18N05E05D06D",
                    ["18N05E05D06U, 18N05E05D06D, 18N05E05D01P, 18N05E05D07G, 18N05E05D12X, 18N05E05D07X, 18N05E05D07U, 18N05E05D07J, 18N05E05D02J, 18N05E05D13V, 18N05E05D08V, 18N05E05D13S, 18N05E05D13H, 18N05E05D13T, 18N05E05D19A, 18N05E05D14B, 18N05E05D09S, 18N05E05D04X, 18N05E05D09Z, 18N05E05D05Q, 18N05E05D15G, 18N05E05D10W, 18N05E05D05W, 18N05E05D05R, 18N05E05D15M, 18N05E05D10Y, 18N05E05D15U, 18N05E05D15J, 18N05E05D05Z, 18N05F01A16L, 18N05F01A11L, 18N05F01A01F, 18N05F01A01G, 18N05F01A06M, 18N05F01A06J, 18N05B21M21J, 18N05F01A02F, 18N05B21M22F, 18N05F01A12B, 18N05B21M22B, 18N05F01A12D, 18N05F01A07Y, 18N05F01A07D, 18N05F01A02N, 18N05F01A02I, 18N05F01A02D, 18N05F01A17P, 18N05F01A17E, 18N05F01A12J, 18N05F01A07P, 18N05F01A02J, 18N05B21M17Z, 18N05F01A13V, 18N05F01A08A, 18N05F01A03V, 18N05B21M23F, 18N05F01A18G, 18N05F01A18C, 18N05F01A13R, 18N05F01A08B, 18N05B21M23W, 18N05B21M18W, 18N05F01A18T, 18N05F01A03D, 18N05B21M23Y, 18N05B21M23N, 18N05B21M23I, 18N05F01A18U, 18N05F01A13U, 18N05F01A13J, 18N05F01A08J, 18N05B21M23Z, 18N05B21M23U, 18N05F01A04K, 18N05B21M24A, 18N05F01A14G, 18N05F01A04R, 18N05B21M24B, 18N05F01A19H, 18N05F01A14M, 18N05F01A09C, 18N05F01A04H, 18N05B21M24C, 18N05F01A14J, 18N05F01A09P, 18N05B21M24P, 18N05F01A10F, 18N05F01A15B, 18N05F01A20C, 18N05F01A15H, 18N05F01A15I, 18N05F01A10Y, 18N05F01A10H, 18N05F01A05X, 18N05F01A05T, 18N05B21M25M, 18N05B21M25I, 18N05B21M25D, 18N05F01A10J, 18N05B21M25Z, 18N05F01B11F, 18N05F01B06V, 18N05F01B11B, 18N05F01B06L, 18N05F01B01R, 18N05F01B01L, 18N05B21N21W, 18N05B21N21R, 18N05F01B06H, 18N05F01B01S, 18N05F01B01C, 18N05B21N21I, 18N05F01B06U, 18N05F01B01E, 18N05B21N21Z, 18N05B21N21U, 18N05E05D06N, 18N05E05D06P, 18N05E05D01Z, 18N05E05D12A, 18N05E05D02K, 18N05E05D17G, 18N05E05D07L, 18N05E05D02L, 18N05E05D12M, 18N05E05D07S, 18N05E05D12J, 18N05E05D07E, 18N05E05D13Q, 18N05E05D13A, 18N05E05D08K, 18N05E05D03Q, 18N05E05D18G, 18N05E05D03X, 18N05E05D03S, 18N05E05D03M, 18N05E05D08T, 18N05E05D03I, 18N05E05D18P, 18N05E05D18J, 18N05E05D19K, 18N05E05D13Z, 18N05E05D08Z, 18N05E05D14S, 18N05E05D14C, 18N05E05D14Y, 18N05E05D14I, 18N05E05D14D, 18N05E05D09I, 18N05E05D04Y, 18N05E05D04N, 18N05E05D04I, 18N05E05D19P, 18N05E05D19E, 18N05E05D10V, 18N05E05D10A, 18N05E05D05K, 18N05E05D10G, 18N05E05D20C, 18N05E05D15S, 18N05E05D20N, 18N05E05D15I, 18N05E05D10J, 18N05F01A16K, 18N05F01A06V, 18N05F01A01V, 18N05F01A16M, 18N05F01A11X, 18N05F01A11S, 18N05F01A01S, 18N05B21M21S, 18N05B21M21H, 18N05B21M16X, 18N05F01A16D, 18N05F01A11I, 18N05F01A06N, 18N05F01A01D, 18N05F01A06P, 18N05F01A01U, 18N05B21M21Z, 18N05F01A07K, 18N05F01A07F, 18N05F01A02Q, 18N05F01A12G, 18N05F01A07B, 18N05B21M17W, 18N05B21M22I, 18N05F01A12U, 18N05F01A02U, 18N05B21M22P, 18N05F01A18A, 18N05F01A13F, 18N05F01A08F, 18N05F01A03A, 18N05F01A18L, 18N05F01A08M, 18N05F01A08C, 18N05F01A03S, 18N05B21M23C, 18N05F01A18I, 18N05F01A08N, 18N05F01A03I, 18N05F01A18P, 18N05F01A13Z, 18N05F01A08Z, 18N05F01A03U, 18N05F01A14F, 18N05F01A09Q, 18N05B21M24Q, 18N05F01A09W, 18N05B21M24G, 18N05F01A04C, 18N05B21M24X, 18N05F01A09D, 18N05B21M24I, 18N05B21M19Y, 18N05F01A19U, 18N05B21M24Z, 18N05F01A20K, 18N05F01A20A, 18N05B21M25Q, 18N05B21M25A, 18N05F01A20R, 18N05F01A10L, 18N05F01A05G, 18N05B21M25G, 18N05F01A15S, 18N05F01A10N, 18N05F01A05D, 18N05F01A05P, 18N05B21N21F, 18N05B21N21A, 18N05F01B06R, 18N05F01B06B, 18N05B21N21M, 18N05F01B06N, 18N05F01B06I, 18N05F01B01T, 18N05B21N21Y, 18N05B21N21T, 18N05B21N21J, 18N05E05D11Z, 18N05E05D06Y, 18N05E05D06E, 18N05E05D01T, 18N05E05D07K, 18N05E05D07F, 18N05E05D12C, 18N05E05D07C, 18N05E05D02M, 18N05E05D12D, 18N05E05D12U, 18N05E05D08F, 18N05E05D03F, 18N05E05D13L, 18N05E05D13G, 18N05E05D03L, 18N05E05D18M, 18N05E05D18H, 18N05E05D18C, 18N05E05D08Y, 18N05E05D08I, 18N05E05D19F, 18N05E05D13U, 18N05E05D14Q, 18N05E05D13J, 18N05E05D14A, 18N05E05D08U, 18N05E05D08E, 18N05E05D04Q, 18N05E05D19L, 18N05E05D14W, 18N05E05D14R, 18N05E05D04R, 18N05E05D04M, 18N05E05D04H, 18N05E05D09N, 18N05E05D09E, 18N05E05D04P, 18N05E05D20K, 18N05E05D20L, 18N05E05D15R, 18N05E05D05X, 18N05E05D20D, 18N05E05D15N, 18N05E05D15D, 18N05E05D10I, 18N05E05D20P, 18N05E05D10P, 18N05E05D05J, 18N05F01A11R, 18N05F01A06A, 18N05F01A06G, 18N05F01A06B, 18N05B21M21B, 18N05F01A06H, 18N05F01A01H, 18N05B21M21M, 18N05F01A16P, 18N05F01A11U, 18N05F01A11J, 18N05B21M21E, 18N05F01A17F, 18N05F01A12A, 18N05B21M22K, 18N05F01A12W, 18N05F01A07R, 18N05F01A07L, 18N05F01A07G, 18N05F01A02R, 18N05F01A02G, 18N05B21M22W, 18N05F01A17H, 18N05F01A02X, 18N05F01A02M, 18N05B21M17X, 18N05F01A02T, 18N05B21M22T, 18N05F01A12P, 18N05F01A12E, 18N05F01A07J, 18N05B21M22Z, 18N05B21M22U, 18N05F01A13Q, 18N05F01A08W, 18N05F01A08H, 18N05F01A03L, 18N05F01A03B, 18N05F01A03C, 18N05B21M23S, 18N05B21M23H, 18N05F01A13I, 18N05F01A08I, 18N05F01A03N, 18N05F01A18J, 18N05B21M23E, 18N05F01A19A, 18N05F01A09V, 18N05F01A04V, 18N05F01A19R, 18N05F01A19L, 18N05F01A09R, 18N05B21M19X, 18N05F01A14Y, 18N05F01A14N, 18N05B21M24T, 18N05B21M24N, 18N05F01A19P, 18N05F01A19J, 18N05F01A19E, 18N05F01A14U, 18N05F01A14E, 18N05F01A09J, 18N05F01A09E, 18N05F01A04U, 18N05F01A15F, 18N05B21M25V, 18N05B21M25F, 18N05F01A20G, 18N05B21M25L, 18N05F01A20S, 18N05F01A15X, 18N05F01A10S, 18N05F01A10C, 18N05F01A05Y, 18N05F01A05M, 18N05F01A05H, 18N05B21M25X, 18N05B21M25Y, 18N05B21M25H, 18N05F01A05U, 18N05F01B11A, 18N05B21N21V, 18N05F01B06S, 18N05B21N21S, 18N05F01B01U, 18N05E05D16P, 18N05E05D16J, 18N05E05D17F, 18N05E05D17A, 18N05E05D12F, 18N05E05D07Q, 18N05E05D07A, 18N05E05D02V, 18N05E05D02Q, 18N05E05D17B, 18N05E05D07R, 18N05E05D02W, 18N05E05D17H, 18N05E05D17C, 18N05E05D07M, 18N05E05D12T, 18N05E05D12I, 18N05E05D02T, 18N05E05D17J, 18N05E05D12Z, 18N05E05D12P, 18N05E05D07Z, 18N05E05D02P, 18N05E05D13K, 18N05E05D03K, 18N05E05D03W, 18N05E05D03R, 18N05E05D13C, 18N05E05D08S, 18N05E05D03H, 18N05E05D13I, 18N05E05D08N, 18N05E05D08D, 18N05E05D18E, 18N05E05D13P, 18N05E05D09A, 18N05E05D03U, 18N05E05D19G, 18N05E05D09B, 18N05E05D04L, 18N05E05D19H, 18N05E05D14X, 18N05E05D14M, 18N05E05D09H, 18N05E05D14N, 18N05E05D14Z, 18N05E05D09U, 18N05E05D15K, 18N05E05D20B, 18N05E05D10R, 18N05E05D10B, 18N05E05D15X, 18N05E05D10X, 18N05E05D10H, 18N05E05D05H, 18N05E05D15T, 18N05E05D10T, 18N05E05D05N, 18N05E05D20J, 18N05E05D10U, 18N05F01A16A, 18N05F01A16B, 18N05F01A06K, 18N05F01A06F, 18N05F01A01R, 18N05F01A01L, 18N05F01A01B, 18N05B21M21G, 18N05F01A06X, 18N05F01A06I, 18N05F01A01T, 18N05F01A01N, 18N05B21M21N, 18N05F01A11Z, 18N05F01A11P, 18N05F01A06U, 18N05B21M21U, 18N05B21M21P, 18N05F01A17A, 18N05F01A02A, 18N05F01A17B, 18N05B21M22R, 18N05F01A17C, 18N05F01A12M, 18N05F01A07C, 18N05F01A02H, 18N05B21M22X, 18N05B21M22H, 18N05F01A12N, 18N05F01A07I, 18N05F01A02Y, 18N05F01A02E, 18N05F01A18F, 18N05F01A13A, 18N05F01A03F, 18N05B21M23V, 18N05F01A18H, 18N05F01A08S, 18N05F01A08G, 18N05B21M23X, 18N05F01A18D, 18N05F01A13D, 18N05F01A08D, 18N05F01A08E, 18N05F01A09F, 18N05F01A04F, 18N05F01A04A, 18N05B21M24F, 18N05F01A14R, 18N05F01A14B, 18N05F01A09B, 18N05F01A04W, 18N05B21M19W, 18N05F01A19M, 18N05F01A09X, 18N05F01A09S, 18N05F01A19N, 18N05F01A14D, 18N05F01A04Y, 18N05B21M24Y, 18N05B21M24D, 18N05F01A04E, 18N05B21M24J, 18N05F01A15A, 18N05F01A10Q, 18N05F01A10K, 18N05F01A20B, 18N05F01A10B, 18N05F01A05R, 18N05B21M20W, 18N05F01A20M, 18N05F01A15C, 18N05F01A10I, 18N05B21M25S, 18N05F01A15E, 18N05F01A10Z, 18N05F01B06A, 18N05B21N16W, 18N05F01B11C, 18N05F01B06M, 18N05B21N21D, 18N05B21N16Y, 18N05F01B06E, 18N05F01B01Z, 18N05E05D11E, 18N05E05D12V, 18N05E05D12K, 18N05E05D07V, 18N05E05D12W, 18N05E05D12B, 18N05E05D07B, 18N05E05D07H, 18N05E05D17I, 18N05E05D17D, 18N05E05D12Y, 18N05E05D07Y, 18N05E05D07D, 18N05E05D02Y, 18N05E05D17E, 18N05E05D07P, 18N05E05D18A, 18N05E05D13W, 18N05E05D13B, 18N05E05D08M, 18N05E05D08H, 18N05E05D18N, 18N05E05D13Y, 18N05E05D14V, 18N05E05D19C, 18N05E05D19I, 18N05E05D04J, 18N05E05D15A, 18N05E05D05V, 18N05E05D05G, 18N05E05D20M, 18N05E05D15Y, 18N05E05D10D, 18N05E05D15E, 18N05E05D10Z, 18N05E05D10E, 18N05F01A11Q, 18N05F01A11B, 18N05F01A01K, 18N05B21M21W, 18N05F01A11M, 18N05F01A11H, 18N05F01A06Y, 18N05F01A06D, 18N05F01A01Y, 18N05B21M21D, 18N05F01A06E, 18N05F01A01J, 18N05B21M16Z, 18N05F01A07V, 18N05F01A07A, 18N05B21M22V, 18N05F01A07W, 18N05F01A02W, 18N05B21M22G, 18N05F01A17M, 18N05F01A07M, 18N05F01A17D, 18N05B21M22Y, 18N05F01A07U, 18N05F01A07E, 18N05F01A03Q, 18N05F01A03K, 18N05B21M23Q, 18N05F01A18B, 18N05B21M23R, 18N05B21M23M, 18N05F01A13T, 18N05F01A08Y, 18N05F01A03Y, 18N05B21M23T, 18N05B21M23D, 18N05B21M18Y, 18N05F01A08U, 18N05F01A03P, 18N05F01A03E, 18N05B21M23J, 18N05F01A14W, 18N05F01A09L, 18N05F01A04L, 18N05F01A04B, 18N05B21M24W, 18N05B21M24L, 18N05F01A09M, 18N05F01A04X, 18N05F01A09T, 18N05F01A09N, 18N05F01A04I, 18N05F01A04P, 18N05B21M19Z, 18N05F01A15W, 18N05F01A15L, 18N05F01A15G, 18N05F01A10W, 18N05B21M25R, 18N05F01A10M, 18N05F01A05N, 18N05B21M20Y, 18N05F01A15P, 18N05F01A10U, 18N05B21M25P, 18N05B21M25E, 18N05F01B06Q, 18N05F01B01K, 18N05F01B01A, 18N05F01B06W, 18N05F01B06G, 18N05B21N21C, 18N05F01B11D, 18N05F01B06Y, 18N05F01B01Y, 18N05F01B01P, 18N05E05D16U, 18N05E05D11J, 18N05E05D06Z, 18N05E05D06T, 18N05E05D06J, 18N05E05D01U, 18N05E05D01N, 18N05E05D12Q, 18N05E05D17L, 18N05E05D12R, 18N05E05D07N, 18N05E05D02N, 18N05E05D18K, 18N05E05D18L, 18N05E05D08R, 18N05E05D13X, 18N05E05D08X, 18N05E05D13N, 18N05E05D03Y, 18N05E05D03N, 18N05E05D14F, 18N05E05D09V, 18N05E05D09K, 18N05E05D08J, 18N05E05D04F, 18N05E05D14L, 18N05E05D09W, 18N05E05D09R, 18N05E05D04G, 18N05E05D19M, 18N05E05D09M, 18N05E05D14T, 18N05E05D09D, 18N05E05D14J, 18N05E05D14E, 18N05E05D09J, 18N05E05D04Z, 18N05E05D04U, 18N05E05D15L, 18N05E05D05L, 18N05E05D10C, 18N05E05D05S, 18N05E05D20I, 18N05E05D05I, 18N05E05D15P, 18N05F01A16G, 18N05F01A06W, 18N05F01A06Q, 18N05F01A06L, 18N05F01A01W, 18N05F01A16H, 18N05F01A01X, 18N05F01A01C, 18N05B21M21C, 18N05F01A11N, 18N05F01A11D, 18N05F01A06Z, 18N05F01A12F, 18N05F01A07Q, 18N05F01A02K, 18N05B21M22Q, 18N05F01A02L, 18N05F01A02B, 18N05F01A12C, 18N05F01A07S, 18N05F01A07H, 18N05F01A02C, 18N05B21M22S, 18N05F01A12I, 18N05F01A07T, 18N05F01A07N, 18N05B21M22N, 18N05F01A12Z, 18N05F01A02Z, 18N05F01A08V, 18N05F01A08K, 18N05B21M23A, 18N05F01A13C, 18N05F01A08L, 18N05F01A03X, 18N05F01A03M, 18N05B21M18X, 18N05F01A18N, 18N05F01A18E, 18N05F01A13P, 18N05F01A03J, 18N05F01A19K, 18N05B21M24K, 18N05B21M19V, 18N05F01A19G, 18N05F01A09G, 18N05F01A04G, 18N05F01A14S, 18N05F01A14C, 18N05B21M24H, 18N05F01A14I, 18N05F01A09I, 18N05F01A04T, 18N05F01A04D, 18N05F01A14P, 18N05F01A09U, 18N05F01A04Z, 18N05F01A04J, 18N05F01A20Q, 18N05F01A15Q, 18N05F01A10A, 18N05F01A05Q, 18N05F01A05K, 18N05B21M20V, 18N05F01A15R, 18N05B21M25B, 18N05F01A15M, 18N05F01A15N, 18N05F01A10X, 18N05F01A10T, 18N05F01A10D, 18N05B21M20X, 18N05F01A15J, 18N05F01A10E, 18N05F01A05Z, 18N05B21M25U, 18N05B21M20Z, 18N05F01B06K, 18N05B21N21K, 18N05B21N16V, 18N05F01B11G, 18N05F01B01B, 18N05F01B11H, 18N05F01B01X, 18N05F01B01M, 18N05B21N21H, 18N05B21N16X, 18N05F01B01N, 18N05B21N21N, 18N05B21N21E, 18N05E05D16E, 18N05E05D11D, 18N05E05D12L, 18N05E05D12G, 18N05E05D07W, 18N05E05D17M, 18N05E05D02X, 18N05E05D17N, 18N05E05D12N, 18N05E05D07T, 18N05E05D02I, 18N05E05D02U, 18N05E05D18F, 18N05E05D08A, 18N05E05D03V, 18N05E05D13R, 18N05E05D08G, 18N05E05D03T, 18N05E05D14K, 18N05E05D08P, 18N05E05D09F, 18N05E05D04V, 18N05E05D03P, 18N05E05D03J, 18N05E05D14G, 18N05E05D09G, 18N05E05D04W, 18N05E05D14H, 18N05E05D04S, 18N05E05D19D, 18N05E05D09T, 18N05E05D15V, 18N05E05D15Q, 18N05E05D10Q, 18N05E05D05F, 18N05E05D15W, 18N05E05D20H, 18N05E05D15H, 18N05E05D10M, 18N05E05D05T, 18N05E05D05U, 18N05F01A11V, 18N05F01A11F, 18N05F01A11A, 18N05F01A06R, 18N05B21M21R, 18N05B21M21L, 18N05F01A16C, 18N05F01A06S, 18N05F01A06C, 18N05F01A01M, 18N05B21M21X, 18N05F01A16N, 18N05F01A16I, 18N05F01A11Y, 18N05F01A11T, 18N05F01A06T, 18N05B21M21Y, 18N05B21M21T, 18N05B21M21I, 18N05F01A16E, 18N05F01A11E, 18N05F01A01Z, 18N05F01A01P, 18N05F01A17K, 18N05F01A12V, 18N05F01A12Q, 18N05F01A12K, 18N05F01A12R, 18N05F01A12X, 18N05F01A07X, 18N05B21M22C, 18N05F01A12Y, 18N05B21M22D, 18N05F01A17J, 18N05F01A02P, 18N05B21M22E, 18N05F01A18K, 18N05F01A08Q, 18N05B21M18V, 18N05F01A18S, 18N05F01A13S, 18N05F01A13H, 18N05F01A13B, 18N05F01A08R, 18N05F01A03R, 18N05F01A03G, 18N05B21M23L, 18N05B21M23G, 18N05F01A03T, 18N05F01A13E, 18N05B21M23P, 18N05F01A19Q, 18N05F01A19F, 18N05F01A09K, 18N05F01A09A, 18N05B21M24R, 18N05F01A19S, 18N05F01A19C, 18N05F01A09H, 18N05B21M24S, 18N05B21M24M, 18N05F01A19D, 18N05F01A04N, 18N05F01A09Z, 18N05F01A20F, 18N05F01A15K, 18N05F01A10V, 18N05F01A05A, 18N05F01A10R, 18N05F01A10G, 18N05F01A05B, 18N05B21M25W, 18N05F01A20H, 18N05F01A15D, 18N05B21M25N, 18N05F01A10P, 18N05F01A05J, 18N05F01B01V, 18N05F01B01W, 18N05F01B01G, 18N05B21N21L, 18N05B21N21B, 18N05F01B06X, 18N05F01B06C, 18N05B21N21X, 18N05F01B06T, 18N05F01B06D, 18N05F01B11E, 18N05F01B06J, 18N05F01B01J, 18N05B21N21P, 18N05E05D11U, 18N05E05D11P, 18N05E05D06I, 18N05E05D01Y, 18N05E05D17Q, 18N05E05D17K, 18N05E05D02R, 18N05E05D12S, 18N05E05D12H, 18N05E05D02S, 18N05E05D07I, 18N05E05D17P, 18N05E05D12E, 18N05E05D02Z, 18N05E05D13F, 18N05E05D08Q, 18N05E05D18B, 18N05E05D08W, 18N05E05D08L, 18N05E05D08B, 18N05E05D03G, 18N05E05D13M, 18N05E05D08C, 18N05E05D18I, 18N05E05D18D, 18N05E05D13D, 18N05E05D13E, 18N05E05D09Q, 18N05E05D03Z, 18N05E05D04K, 18N05E05D19B, 18N05E05D09L, 18N05E05D09X, 18N05E05D09C, 18N05E05D19N, 18N05E05D09Y, 18N05E05D04T, 18N05E05D19J, 18N05E05D14U, 18N05E05D14P, 18N05E05D09P, 18N05E05D20F, 18N05E05D20A, 18N05E05D15F, 18N05E05D10K, 18N05E05D10F, 18N05E05D20G, 18N05E05D15B, 18N05E05D10L, 18N05E05D15C, 18N05E05D10S, 18N05E05D05M, 18N05E05D10N, 18N05E05D05Y, 18N05E05D20E, 18N05E05D15Z, 18N05E05D05P, 18N05F01A16F, 18N05F01A11W, 18N05F01A11K, 18N05F01A11G, 18N05F01A01Q, 18N05B21M16W, 18N05F01A11C, 18N05F01A01I, 18N05B21M16Y, 18N05F01A16J, 18N05F01A01E, 18N05F01A02V, 18N05B21M22A, 18N05B21M17V, 18N05F01A17L, 18N05F01A17G, 18N05F01A12L, 18N05B21M22L, 18N05F01A12S, 18N05F01A12H, 18N05F01A02S, 18N05B21M22M, 18N05F01A17N, 18N05F01A17I, 18N05F01A12T, 18N05B21M17Y, 18N05F01A07Z, 18N05B21M22J, 18N05F01A13K, 18N05B21M23K, 18N05F01A18M, 18N05F01A13W, 18N05F01A13X, 18N05F01A13L, 18N05F01A13M, 18N05F01A13G, 18N05F01A08X, 18N05F01A03W, 18N05F01A03H, 18N05B21M23B, 18N05F01A13Y, 18N05F01A13N, 18N05F01A08T, 18N05F01A08P, 18N05F01A03Z, 18N05B21M18Z, 18N05F01A14V, 18N05F01A14Q, 18N05F01A14K, 18N05F01A14A, 18N05F01A04Q, 18N05B21M24V, 18N05F01A19B, 18N05F01A14L, 18N05F01A14X, 18N05F01A14H, 18N05F01A04S, 18N05F01A04M, 18N05F01A19T, 18N05F01A19I, 18N05F01A14T, 18N05F01A09Y, 18N05F01A14Z, 18N05B21M24U, 18N05B21M24E, 18N05F01A15V, 18N05F01A05V, 18N05F01A05F, 18N05B21M25K, 18N05F01A20L, 18N05F01A05W, 18N05F01A05L, 18N05F01A05S, 18N05F01A05I, 18N05F01A05C, 18N05B21M25T, 18N05B21M25C, 18N05F01A05E, 18N05B21M25J, 18N05F01B06F, 18N05F01B01Q, 18N05F01B01F, 18N05B21N21Q, 18N05B21N21G, 18N05F01B01H, 18N05F01B01I, 18N05F01B01D, 18N05F01B06Z, 18N05F01B06P, 18N05B21N16Z"],
                    77
                );
            }
            if (Band == 81) {
                console.log("FILTRADO  2 " + Filtrado);
                MonitorearAreas(
                    IdArea,
                    1,
                    "Esto es una celda de prueba",
                    [Filtrado],
                    0
                );
                // await page.waitForTimeout(50000);
                // Band=99;
            }

            // SE ACCEDE A CADA UNA DE LA INFORMACIÓN RETORNADA EN LA FUNCIÓN MonitorearAreas PARA UTILIZARLA MÁS ADELANTE EN OTROS PROCEOS
            IdArea = DetallesCompletos.IdArea;
            Aviso = DetallesCompletos.Aviso;
            Celda = DetallesCompletos.Celda;
            Area = DetallesCompletos.Area;
            Comas = DetallesCompletos.Comas;
            ComparacionCeldas = DetallesCompletos.ComparacionCeldas;

            const continCeldas = await page.$x('//span[contains(.,"Continuar")]');
            await page.waitForTimeout(1000);
            await continCeldas[1].click();
            console.log(IdArea);
            await page.waitForTimeout(2000);

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

            /* CODIGO PARA REORGANIZAR AREA CON CELDAS NO DISPONIBLES, INFERIOR A LA INICIAL */
            // Extraer celdas no disponibles del DOM
            const celdasNoDisponibles = await page.$$eval('a.errorMsg', links => {
                return links
                    .filter(link => link.textContent.includes('Las siguientes celdas de selección no están disponibles:'))
                    .map(link => link.textContent.split(': ')[1].split(',').map(celda => celda.trim())); // Extrae las celdas y las limpia
            });

            console.log(`===============================================================================================`.cyan.bold);
            // console.log(`AREA COMPLETA => ${Area}`);
            // console.log(`CELDAS NO DISPONIBLES => ${celdasNoDisponibles}`);

            console.log(`ÁREA COMPLETA => `.magenta.bold);
            console.log(`[${Area}]`);
            console.log(`CELDAS NO DISPONIBLES => `.red.bold);
            console.log(`[${celdasNoDisponibles}]`);


            if (Band != 81) {

                try {
     // Tipo, Area, Celda

                // Crear una lista de celdas no disponibles (eliminando espacios innecesarios)
                const celdasNoDisponiblesLimpias = celdasNoDisponibles[0].map(celda => celda.trim());

                // Asegurarse de que 'ComparacionCeldas' esté correctamente dividido en celdas
                const areaCeldas = ComparacionCeldas;

                // Filtrar el arreglo 'areaCeldas' para excluir las celdas no disponibles
                areaFiltrado = areaCeldas.filter(celda => !celdasNoDisponiblesLimpias.includes(celda));



                if (areaFiltrado.length > 0) {
                    //Correo(1, Area, areaFiltrado);

                    // Mostrar el nuevo arreglo que no contiene las celdas no disponibles
                    // console.log('ÁREA MONTADA EXCLUYENDO LAS CELDAS QUE NO ESTÁN DISPONIBLES => ', areaFiltrado);
                    // console.log(`ÁREA MONTADA EXCLUYENDO LAS CELDAS QUE NO ESTÁN DISPONIBLES => `.green.bold);
                    console.log(`CELDAS DISPONIBLES => `.green.bold);
                    console.log(`["${areaFiltrado.join(', ')}"],`);
                    console.log(`===============================================================================================`.cyan.bold);
                    Band = 80;

                } else {

                    console.log('No se encontraron celdas no disponibles.');
                    console.log(`===============================================================================================`.cyan.bold);
                }
                } catch (error) {
                    
                }
               
            }
            /* FIN FIN FIN */


            const FechaReapertura = await page.$$eval("a", links =>
                links.map(link => link.textContent)
            );
            var Reapertura = 0;
            //EL DIA DE MAÑANA 12 04 2022 SE REALIZARA LA PRUEBA 
            //PARA ASI VALIDAR CUANDO APAREZCA ALGO DIFERENTE A "Las siguientes celdas de selección no están disponibles:"

            for (let i = 0; i < FechaReapertura.length; i++) {


                var Text = FechaReapertura[i].substring(24, 120);
                if (Text == "Las siguientes celdas de selección no están disponibles ya que la fecha de reapertura es futura:") {
                    console.log("Lo encontre");
                    Reapertura = 1;
                    contreapertura++;
                    // if (contreapertura < 2) {
                    //     Correo(3, IdArea, Celda);
                    // }


                    console.log(contreapertura);
                } else {
                    var Text = FechaReapertura[i].substring(24, 140);
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
                // else if (Band == 81){

                // }

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

        //CORREO LIBERADA
        Correo(1, IdArea, Celda);


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
            if(IdArea == '509188'){
                 ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509188.pdf`;
            }else if(IdArea == '503239'){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\503239.pdf`;

            }else if(IdArea == 'RFE_08211'){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08211.pdf`;

            }else if(IdArea == 'RFE_08A'){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08A.pdf`;

            }else if(IdArea == 'RFE_08B'){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08B.pdf`;

            }else if(IdArea == 'Riosucio598' || IdArea == 'supia' || IdArea == 'supiaincompleto'){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\QCO-08032.pdf`;

            }else if(IdArea == '507948sincelda'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\507948sincelda.pdf`;

            }else if(IdArea == '509136'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509136.pdf`;

            }else if(IdArea == 'CollectiveCAG_141'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\CollectiveCAG_141.pdf`;

            }else if(IdArea == '697_17'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\697_17.pdf`;

            }else if(IdArea == '502172'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\502172.pdf`;

            }else if(IdArea == '671_17'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\671_17.pdf`;

            }else if(IdArea == '508353Inferior'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508353Inferior.pdf`;

            }else if(IdArea == '508353Superior'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508353Superior.pdf`;

            }else if(IdArea == '508359SUPERIOR'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508359SUPERIOR.pdf`;

            }else if(IdArea == '508359INFERIOR'  ){
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508359INFERIOR.pdf`;

            }else{
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\Certificado_Ambiental.pdf`;

            }
            
            
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


        //CAPTURA DE PANTALLA
        await CapturaPantalla(page);
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

        //CAPTURA DE PANTALLA
        await CapturaPantalla(page);
        //CORREO RADICACION
        Correo(2, IdArea, Celda);
        clearTimeout(Radisegundo);
        await page.waitForTimeout(180000);
        Mineria(browser,  Pin);







    })();
}


// FUNCIÓN PARA ENVÍO DE CORREO SEGÚN LA SITUACIÓN
function Correo(Tipo, Area, Celda) {
    // 1. Liberada 2. radicada 3. Fecha reapertura
    var msg = "";
    var Color = "";
    var Texto = "";
    //Area = "Tranquilos area de prueba";
    if (Tipo == 1) {
        msg = "¡¡¡Posible Area Liberada!!! " + EquipoActual + " " + Area + " " + Empresa;
        Color = "#4CAF50";
        Texto = "POSIBLE AREA LIBERADA";
    } else if (Tipo == 2) {
        msg = "¡¡¡Posible Area Radicada!!! " + EquipoActual + " " + Area + " " + Empresa;
        Color = "#D4AF37";
        Texto = "POSIBLE AREA RADICADA";
    } else if (Tipo == 3) {
        msg = "¡¡¡Area Con fecha de Reapertura!!! " + EquipoActual + " " + Area + " " + Empresa;
        Color = "#2196F3";
        Texto = "AREA CON REAPERTURA";
    } else if (Tipo == 4) {
        msg = Area + " " + Empresa + " ¡¡¡Verificar!!!!.";
    }else if ( Tipo == 5){
        msg = "¡¡¡Ojo Pestañas!!! " + EquipoActual ;
        Color = "#fe1426";
        Texto = "Pestañas";
    }

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        host: "mail.ceere.net", // hostname
        secureConnection: false,
        port: 465,
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'correomineria2@ceere.net',
            pass: '1998Ceere*'
        }
    });
    var mensaje = msg;
    var mailOptions = {
        from: msg + '"Ceere" <correomineria2@ceere.net>', //Deje eso quieto Outlook porne demasiados problemas 
        to: 'jorgecalle@hotmail.com, jorgecaller@gmail.com, alexisaza@hotmail.com, camilodesarrollador@outlook.com, ceereweb@gmail.com, Soporte2ceere@gmail.com, soportee4@gmail.com, soporte.ceere06068@gmail.com',
        //to: '  Soporte2ceere@gmail.com',
        subject: 'LA AREA ES-> ' + Area,
        text: 'LA AREA ES->  ' + Area + "  " + Celda,
        html: `
            <html>
                <head>
                    <style>
                        .container {
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            background-color: #f9f9f9;
                        }
                        .header {
                            background-color: ${Color};
                            color: white;
                            padding: 10px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px;
                            font-size: 12px;
                            color: #777;
                            border-top: 1px solid #ddd;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h3> ${Texto} </h3>
                        </div>
                        <div class="content">
                            <p><strong>Detalles:</strong></p>
                            <ul>
                                <li><strong>Empresa: </strong><br>${Empresa}</li>
                                <li><strong>Area:</strong><br>${Area}</li>
                                <li><strong>Celda:</strong><br>${Celda}</li>
                            <li><strong>Equipo Actual:</strong><br>${EquipoActual}</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p>Creado por Ceere Software - © 2024 Todos los derechos reservados</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });
}

// FUNCIÓN PARA LA CAPTURA DE PANTALLA AL MOMENTO DE LA RADICACIÓN
async function CapturaPantalla(page) {

    const FechaGeneral = new Date();

    let Dia = FechaGeneral.getDate();
    let Mes = FechaGeneral.getMonth();
    let Anio = FechaGeneral.getFullYear();
    let Hora = FechaGeneral.getHours();
    let Minuto = FechaGeneral.getMinutes();
    let Segundo = FechaGeneral.getSeconds();
    let DiaFinal, MesFinal, HoraFinal, MinutoFinal, SegundoFinal;

    Mes = Mes + 1; // PORQUE COMIENZA EN 0 Y TERMNA EN 11, POR ESTA REZÓN SE LE SUMA 1, PARA QUE QUEDE EN EL MES ACTUAL
    DiaFinal = Dia < 10 ? '0' + Dia : Dia;
    MesFinal = Mes < 10 ? '0' + Mes : Mes;
    HoraFinal = Hora < 10 ? '0' + Hora : Hora;
    MinutoFinal = Minuto < 10 ? '0' + Minuto : Minuto;
    SegundoFinal = Segundo < 10 ? '0' + Segundo : Segundo;

    let Fecha = `${DiaFinal}-${MesFinal}-${Anio} --- ${HoraFinal}-${MinutoFinal}-${SegundoFinal}`;

    const { mkdir, access } = require('fs/promises');

    let NombreCarpeta = "ScreenShots";
    let pathProduccion = `C:\\Aplicaciones\\${NombreCarpeta}`;

    try {
        // Verificar si la carpeta ya existe
        await access(pathProduccion);
        console.log(`La carpeta ${NombreCarpeta} ya existe en la dirección ${pathProduccion}`);
    } catch (error) {
        // Si no existe, crearla
        await mkdir(pathProduccion);
        console.log(`La carpeta fue creada en la dirección ${pathProduccion} con el nombre ${NombreCarpeta}`);
    }

    await page.screenshot({ path: `C:\\Aplicaciones\\ScreenShots\\Imagen Tomada El ${Fecha}.png`, type: 'png' })
    console.log("El ScreenShot fue guardado");
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

var CorreoEnviado = false;
var PrimerCorreoEnviado = false;
// FUNCIÓN PARA VERIFICAR VENCIMIENTO DE PIN Y ENVIAR RECORDATORIO
function VerificarVencimientoPin(selectedText, TextoDeOpcionSeleccionadaEnCampoPin) {

    const input = TextoDeOpcionSeleccionadaEnCampoPin;

    // Separar la fecha después de la coma
    const dateString = input.split(',')[1].trim();

    // Crear un objeto de fecha a partir de la cadena
    const targetDate = new Date(dateString);

    // Obtener la fecha actual
    const currentDate = new Date();

    // Calcular la diferencia en milisegundos
    const diffInMs = targetDate - currentDate;

    // Convertir la diferencia en días
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    const diaSemana = targetDate.toLocaleString('es-Es', { weekday: 'long' });
    console.log(`¡¡¡ DIFERENCIA EN DÍAS PIN: ${diffInDays}`);
    const Description = `El pin vence en ${diffInDays} días, es decir, tiene vigencia hasta el día ${diaSemana} - ${dateString}`;

    // Se captura la hora del día actual
    const HoraActual = currentDate.getHours();

    // Se captura el minuto actual
    const MinutoActual = currentDate.getMinutes();

    // Se captura el segundo actual
    const SegundoActual = currentDate.getSeconds();

    // Se verifica si la diferencia de días es igual a 5 y si la hora actual contiene 7 de la mañana ó contiene 3 de la tarde. Para hacer 2 envíos de recordatorio el día que se cumplan todas las condiciones

    // Primer envío: 07:00 am
    if ((diffInDays === 5) && ([7].includes(HoraActual)) && (MinutoActual === 0) && (CorreoEnviado === false) && !PrimerCorreoEnviado) {
        console.log("TODAS LAS CONDICIONES SE CUMPLIERON, SE ENVIARÁ EL PRIMER CORREO RECORDANDO EL VENCIMIENTO DEL PIN SELECCIONADO...");
        Correo(4, selectedText, Description);
        CorreoEnviado = true;
        PrimerCorreoEnviado = true;
    }

    // Resetear el flag solo una vez después del primer correo
    if ((diffInDays === 5) && ((HoraActual > 7) && (HoraActual < 15)) && (MinutoActual === 0) && PrimerCorreoEnviado && CorreoEnviado) {
        CorreoEnviado = false;
        console.log("LA VARIABLE DE CORREO ENVIADO SE HIZO FALSA");
    }

    // Segundo envío: 03:00 pm
    if ((diffInDays === 5) && ([15].includes(HoraActual)) && (MinutoActual === 0) && (CorreoEnviado === false)) {
        console.log("TODAS LAS CONDICIONES SE CUMPLIERON, SE ENVIARÁ EL SEGUNDO CORREO RECORDANDO EL VENCIMIENTO DEL PIN SELECCIONADO...");
        Correo(4, selectedText, Description);
        CorreoEnviado = true;
        PrimerCorreoEnviado = false;
    }
}