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
    'HPRED241': "FERCHO ingeniero en sistemas best"
}


const EquipoActual = EquiposGenerales[NombreEquipo];
// Actualizado
var Empresa = 'Collective';
var user1 = '76966';
var pass1 = 'CML2025_Supia';
var user2 = '96232';
var pass2 = 'OscarM_2025*';
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
        if (Pines.substring(i + 1, i + 4) == 'C3:') {
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




function Mineria(browser, Pin) {
    (async () => {

        console.log("Esta es la vuelta " + ContadorVueltas);
        const page = await browser.newPage();

        let Primerpaso = setTimeout(() => {
            console.log("ENTRO EN EL PRIMERPASO")

            page.close();
            Mineria(browser, Pin);

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
            Mineria(browser, Pin);
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
                    "508359INFERIOR",
                    1,
                    "18N05A25C25V",
                    ["18N05A25C25V, 18N05A25C15Q, 18N05A25C09J, 18N05A25C10K, 18N05A25C05Q, 18N05A25C05A, 18N05A25G15B, 18N05A25G05G, 18N05A25G15C, 18N05A25G10C, 18N05A25G05M, 18N05A25G05H, 18N05A25C25M, 18N05A25C10M, 18N05A25C05C, 18N05A25G10D, 18N05A25G05D, 18N05A25C10Y, 18N05A25G10J, 18N05A25C25U, 18N05A25C25P, 18N05A25H06V, 18N05A25H06K, 18N05A25H06A, 18N05A25D11K, 18N05A25H06R, 18N05A25H06G, 18N05A25D21W, 18N05A25D21L, 18N05A25D06R, 18N05A25H01X, 18N05A25H06N, 18N05A25H01T, 18N05A25D21P, 18N05A25H02Q, 18N05A25D22K, 18N05A25D22A, 18N05A25H07R, 18N05A25H02W, 18N05A25H02R, 18N05A25H02G, 18N05A25H07X, 18N05A25H07S, 18N05A25H02H, 18N05A25D22J, 18N05A25D23K, 18N05A25D23R, 18N05A25H08X, 18N05A25H03E, 18N05A25D23Z, 18N05A25H09B, 18N05A25D24R, 18N05A25H09H, 18N05A25H09D, 18N05A25D24I, 18N05A25H09E, 18N05A25H04J, 18N05A25H10B, 18N05A25H05W, 18N05A25H10S, 18N05A25H05H, 18N05A25H10N, 18N05A25H10D, 18N05A25H05T, 18N05A25H10J, 18N05B21E11A, 18N05B21E06W, 18N05B21E01K, 18N05B21E01A, 18N05B21E01B, 18N05B21A21W, 18N05B21A21B, 18N05B21E06S, 18N05B21E01M, 18N05B21E01H, 18N05B21A21M, 18N05B21E06N, 18N05B21E06D, 18N05B21E01I, 18N05B21A21N, 18N05B21E01P, 18N05B21E07Q, 18N05B21A22K, 18N05B21E02G, 18N05B21E02B, 18N05B21E07Y, 18N05B21E02T, 18N05B21E02N, 18N05B21E07U, 18N05B21E07P, 18N05B21E02P, 18N05B21E02E, 18N05B21E03A, 18N05B21A23V, 18N05B21E13G, 18N05B21E08W, 18N05B21E08G, 18N05B21E08H, 18N05B21E03W, 18N05B21E03X, 18N05B21A23R, 18N05B21A23S, 18N05B21A23G, 18N05B21E14F, 18N05B21E04V, 18N05B21E04K, 18N05B21A24V, 18N05B21E09B, 18N05B21E04B, 18N05B21E14H, 18N05B21E04S, 18N05B21A24I, 18N05B21E04P, 18N05B21E04E, 18N05B21A25V, 18N05B21E15G, 18N05A25G10K, 18N05A25G10F, 18N05A25G05V, 18N05A25C25K, 18N05A25C25F, 18N05A25C20V, 18N05A25C20F, 18N05A25C09P, 18N05A25C10A, 18N05A25C04U, 18N05A25C05K, 18N05A25G10G, 18N05A25G10B, 18N05A25C15L, 18N05A25C05W, 18N05A25G10M, 18N05A25C15S, 18N05A25C15H, 18N05A25G10T, 18N05A25G05Y, 18N05A25C25Y, 18N05A25C20Y, 18N05A25C20Z, 18N05A25C20P, 18N05A25C20E, 18N05A25C15Z, 18N05A25H06Q, 18N05A25H06F, 18N05A25H01F, 18N05A25D16F, 18N05A25H01G, 18N05A25H01B, 18N05A25D21R, 18N05A25D16R, 18N05A25D11R, 18N05A25D11G, 18N05A25H06C, 18N05A25H01S, 18N05A25D21X, 18N05A25H06J, 18N05A25H07V, 18N05A25D22F, 18N05A25H12B, 18N05A25D22R, 18N05A25H07M, 18N05A25D22X, 18N05A25D22S, 18N05A25H07Y, 18N05A25H07T, 18N05A25D22I, 18N05A25H08Q, 18N05A25H03Q, 18N05A25D23V, 18N05A25D23Q, 18N05A25D23A, 18N05A25H13B, 18N05A25H03W, 18N05A25H08H, 18N05A25H03M, 18N05A25D23H, 18N05A25H03Y, 18N05A25H13E, 18N05A25H14A, 18N05A25H09K, 18N05A25H04K, 18N05A25H03J, 18N05A25H09W, 18N05A25D24W, 18N05A25H04S, 18N05A25D24C, 18N05A25H04D, 18N05A25D24T, 18N05A25D24N, 18N05A25D24Z, 18N05A25D24U, 18N05A25D25A, 18N05A25H10G, 18N05A25H05L, 18N05A25D25B, 18N05A25H10M, 18N05A25D25M, 18N05A25H05Y, 18N05A25H10P, 18N05A25H05J, 18N05A25D25Z, 18N05A25D25P, 18N05B21E06V, 18N05B21E06Q, 18N05B21E06K, 18N05B21E06G, 18N05B21A21A, 18N05B21E02V, 18N05B21E02K, 18N05B21A22F, 18N05B21A22W, 18N05B21E07C, 18N05B21E02X, 18N05B21E02H, 18N05B21A22X, 18N05B21E02I, 18N05B21E08Q, 18N05B21E03K, 18N05B21E08X, 18N05B21E08R, 18N05B21E08L, 18N05B21E03R, 18N05B21E03M, 18N05B21A23M, 18N05B21A23Y, 18N05B21E08U, 18N05B21E08E, 18N05B21A23U, 18N05B21A23P, 18N05B21A23E, 18N05B21E04A, 18N05B21E14G, 18N05B21E09W, 18N05B21E04W, 18N05B21A24B, 18N05B21A24M, 18N05B21E04Y, 18N05B21E04T, 18N05B21E04D, 18N05B21A24J, 18N05B21E10F, 18N05B21E10R, 18N05B21E05G, 18N05A25G15A, 18N05A25G10Q, 18N05A25G05K, 18N05A25G05F, 18N05A25C15F, 18N05A25C05V, 18N05A25C04P, 18N05A25G10R, 18N05A25G05W, 18N05A25G05L, 18N05A25C25G, 18N05A25C10G, 18N05A25C05R, 18N05A25G05X, 18N05A25C15M, 18N05A25C10C, 18N05A25G10I, 18N05A25G05N, 18N05A25C25N, 18N05A25G10Z, 18N05A25G05Z, 18N05A25G05J, 18N05A25C15P, 18N05A25D16A, 18N05A25H01R, 18N05A25D21G, 18N05A25D16W, 18N05A25H11C, 18N05A25H01H, 18N05A25D21M, 18N05A25D16M, 18N05A25D11H, 18N05A25D06S, 18N05A25H06Y, 18N05A25H06U, 18N05A25H01J, 18N05A25H07Q, 18N05A25H02V, 18N05A25H02F, 18N05A25H02B, 18N05A25H02I, 18N05A25D22N, 18N05A25H03A, 18N05A25H08W, 18N05A25H03G, 18N05A25H03B, 18N05A25D23G, 18N05A25H08N, 18N05A25H03U, 18N05A25H04V, 18N05A25D24V, 18N05A25D23J, 18N05A25D24F, 18N05A25H09C, 18N05A25H04M, 18N05A25H04Y, 18N05A25H04N, 18N05A25H04Z, 18N05A25H04U, 18N05A25H05A, 18N05A25D25V, 18N05A25H10I, 18N05A25H05I, 18N05A25D25I, 18N05A25H05U, 18N05A25H05P, 18N05B21E11B, 18N05B21E06R, 18N05B21E06B, 18N05B21E01Q, 18N05B21E06X, 18N05B21E01S, 18N05B21E06Y, 18N05B21A21I, 18N05B21A21D, 18N05B21A21U, 18N05B21E07B, 18N05B21E07S, 18N05B21E12I, 18N05B21E07T, 18N05B21E07D, 18N05B21A22T, 18N05B21A22N, 18N05B21E02U, 18N05B21E13A, 18N05B21E08V, 18N05B21A23A, 18N05B21E03H, 18N05B21E03C, 18N05B21E08N, 18N05B21E08I, 18N05B21E03N, 18N05B21A23T, 18N05B21E09K, 18N05B21A24F, 18N05B21E14B, 18N05B21E09R, 18N05B21A24G, 18N05B21E09M, 18N05B21A24C, 18N05B21A24Z, 18N05B21A25F, 18N05B21E05R, 18N05B21A25W, 18N05B21A25R, 18N05A25C20A, 18N05A25C15K, 18N05A25C25L, 18N05A25C10L, 18N05A25G05S, 18N05A25G05C, 18N05A25C20H, 18N05A25C05S, 18N05A25G10N, 18N05A25C15Y, 18N05A25G10P, 18N05A25G05E, 18N05A25C25J, 18N05A25C20U, 18N05A25C15J, 18N05A25C10U, 18N05A25D21V, 18N05A25D16V, 18N05A25H06B, 18N05A25D11B, 18N05A25H06M, 18N05A25H06H, 18N05A25D16H, 18N05A25D11S, 18N05A25H01Z, 18N05A25H01U, 18N05A25H01N, 18N05A25H01E, 18N05A25D21J, 18N05A25H02C, 18N05A25D22M, 18N05A25D22C, 18N05A25H12D, 18N05A25H07N, 18N05A25H07I, 18N05A25H07D, 18N05A25H07Z, 18N05A25H07J, 18N05A25H02J, 18N05A25D22Z, 18N05A25D22U, 18N05A25D22P, 18N05A25H03V, 18N05A25H03L, 18N05A25D23L, 18N05A25D23B, 18N05A25H08M, 18N05A25D23M, 18N05A25D23C, 18N05A25H08Y, 18N05A25H03D, 18N05A25H08J, 18N05A25H04A, 18N05A25D23U, 18N05A25D24K, 18N05A25D24G, 18N05A25H09S, 18N05A25H09M, 18N05A25D24H, 18N05A25H09T, 18N05A25H09P, 18N05A25H04E, 18N05A25H10K, 18N05A25H10A, 18N05A25H05K, 18N05A25H10R, 18N05A25H10L, 18N05A25H05B, 18N05A25D25R, 18N05A25H15C, 18N05A25H10H, 18N05A25H05X, 18N05A25D25H, 18N05A25D25N, 18N05A25H10E, 18N05A25H05Z, 18N05B21E11G, 18N05B21E01R, 18N05B21E06C, 18N05B21E01X, 18N05B21A21X, 18N05B21E01Y, 18N05B21E01T, 18N05B21A21Y, 18N05B21A21J, 18N05B21E12F, 18N05B21E07K, 18N05B21E07A, 18N05B21E07W, 18N05B21E02L, 18N05B21A22L, 18N05B21E07N, 18N05B21E07I, 18N05B21A22Y, 18N05B21E13F, 18N05B21E08A, 18N05B21E03V, 18N05B21A23Q, 18N05B21A23F, 18N05B21E13C, 18N05B21E08C, 18N05B21A23L, 18N05B21E03I, 18N05B21E13J, 18N05B21E03E, 18N05B21E09H, 18N05B21E04X, 18N05B21E04M, 18N05B21E04H, 18N05B21E04C, 18N05B21A24S, 18N05B21E09T, 18N05B21E09D, 18N05B21E04I, 18N05B21E14J, 18N05B21A24U, 18N05B21A24P, 18N05B21E05V, 18N05B21A25K, 18N05B21E10B, 18N05A25G10V, 18N05A25G10A, 18N05A25C15A, 18N05A25C10F, 18N05A25C09E, 18N05A25C04J, 18N05A25C04E, 18N05A25C25R, 18N05A25C20R, 18N05A25C20G, 18N05A25C10R, 18N05A25C05B, 18N05A25G10S, 18N05A25G10H, 18N05A25C10X, 18N05A25C05H, 18N05A25G10Y, 18N05A25C25T, 18N05A25C20I, 18N05A25C15T, 18N05A25C15D, 18N05A25G10U, 18N05A25H11A, 18N05A25H01A, 18N05A25D06V, 18N05A25H01C, 18N05A25D16S, 18N05A25H06Z, 18N05A25H01Y, 18N05A25H01P, 18N05A25D21N, 18N05A25D21D, 18N05A25H07A, 18N05A25H07G, 18N05A25H02L, 18N05A25D22W, 18N05A25D22B, 18N05A25H07P, 18N05A25H02U, 18N05A25H02P, 18N05A25H08A, 18N05A25H08C, 18N05A25H03C, 18N05A25D23X, 18N05A25D23S, 18N05A25H08T, 18N05A25H03T, 18N05A25H08U, 18N05A25H09A, 18N05A25H03Z, 18N05A25H03P, 18N05A25H04F, 18N05A25H14B, 18N05A25H09R, 18N05A25H04W, 18N05A25H04H, 18N05A25D24X, 18N05A25H04T, 18N05A25D24J, 18N05A25H10V, 18N05A25H10Q, 18N05A25H05Q, 18N05A25D25S, 18N05A25H05N, 18N05A25H05D, 18N05A25D25D, 18N05A25H10Z, 18N05A25D25U, 18N05B21E06F, 18N05B21A21V, 18N05B21A21F, 18N05B21A21H, 18N05B21A21C, 18N05B21A21T, 18N05B21E11J, 18N05B21E06E, 18N05B21A21Z, 18N05B21E07V, 18N05B21E02Q, 18N05B21E02F, 18N05B21E02A, 18N05B21E12B, 18N05B21E07G, 18N05B21E02R, 18N05B21A22R, 18N05B21E02D, 18N05B21E12E, 18N05B21A22P, 18N05B21A22J, 18N05B21A22E, 18N05B21E03Q, 18N05B21A23X, 18N05B21A23B, 18N05B21E13I, 18N05B21E13D, 18N05B21E03Y, 18N05B21A23N, 18N05B21A23I, 18N05B21A23D, 18N05B21E13E, 18N05B21E08Z, 18N05B21A23J, 18N05B21E09A, 18N05B21E09L, 18N05B21E14C, 18N05B21E09X, 18N05B21E09C, 18N05B21A24X, 18N05B21E14I, 18N05B21E14D, 18N05B21A24T, 18N05B21A24D, 18N05B21E04J, 18N05B21E15F, 18N05B21E10V, 18N05B21E10Q, 18N05B21E10K, 18N05B21E05K, 18N05B21E10W, 18N05A25G05Q, 18N05A25C25Q, 18N05A25C20K, 18N05A25C09Z, 18N05A25C09U, 18N05A25C10Q, 18N05A25G10W, 18N05A25G10L, 18N05A25C20L, 18N05A25C20B, 18N05A25C15R, 18N05A25C15G, 18N05A25C10W, 18N05A25G10X, 18N05A25C25X, 18N05A25C25S, 18N05A25C20X, 18N05A25C15X, 18N05A25C10S, 18N05A25C25I, 18N05A25C20T, 18N05A25G10E, 18N05A25C25Z, 18N05A25C25E, 18N05A25C15U, 18N05A25H01Q, 18N05A25H01K, 18N05A25D21Q, 18N05A25D21A, 18N05A25D16K, 18N05A25D11A, 18N05A25D16G, 18N05A25D11L, 18N05A25H06S, 18N05A25H01M, 18N05A25D11C, 18N05A25H11E, 18N05A25H06I, 18N05A25H06D, 18N05A25D21T, 18N05A25D21I, 18N05A25D21E, 18N05A25H02A, 18N05A25D22V, 18N05A25H07L, 18N05A25H07H, 18N05A25H02M, 18N05A25D22H, 18N05A25H02Y, 18N05A25H02T, 18N05A25D22D, 18N05A25H12E, 18N05A25D22E, 18N05A25H13A, 18N05A25H08L, 18N05A25H08B, 18N05A25H03R, 18N05A25H13C, 18N05A25D23T, 18N05A25D23N, 18N05A25D23D, 18N05A25H08P, 18N05A25D24Q, 18N05A25D23P, 18N05A25D24A, 18N05A25H09L, 18N05A25H04L, 18N05A25H04G, 18N05A25H04B, 18N05A25H14C, 18N05A25H09X, 18N05A25H04X, 18N05A25H04C, 18N05A25D24Y, 18N05A25H09J, 18N05A25D24P, 18N05A25H05V, 18N05A25H05F, 18N05A25H15B, 18N05A25D25G, 18N05A25H05M, 18N05A25D25C, 18N05A25H15D, 18N05A25D25Y, 18N05A25D25T, 18N05A25H10U, 18N05B21E06L, 18N05B21E01W, 18N05B21E01F, 18N05B21A21R, 18N05B21A21L, 18N05B21E06M, 18N05B21E06I, 18N05B21E11E, 18N05B21E06Z, 18N05B21E06P, 18N05B21E01J, 18N05B21E01E, 18N05B21A21P, 18N05B21A21E, 18N05B21E12A, 18N05B21A22Q, 18N05B21A22A, 18N05B21E12G, 18N05B21E07L, 18N05B21A22G, 18N05B21E12H, 18N05B21E07X, 18N05B21E07M, 18N05B21E02M, 18N05B21E02C, 18N05B21E02Y, 18N05B21A22D, 18N05B21A22Z, 18N05B21A23K, 18N05B21E13B, 18N05B21E08S, 18N05B21E03L, 18N05B21E03G, 18N05B21E03B, 18N05B21A23W, 18N05B21A23H, 18N05B21E08D, 18N05B21E08P, 18N05B21E08J, 18N05B21E14A, 18N05B21A24Q, 18N05B21A24K, 18N05B21A24A, 18N05B21E04L, 18N05B21E04G, 18N05B21A24W, 18N05B21A24Y, 18N05B21E04Z, 18N05B21E04U, 18N05B21A24E, 18N05B21E10A, 18N05B21E05Q, 18N05B21E05A, 18N05B21A25Q, 18N05B21E10G, 18N05A25C25A, 18N05A25C04Z, 18N05A25C05F, 18N05A25G05B, 18N05A25C20W, 18N05A25C15W, 18N05A25C15B, 18N05A25C25H, 18N05A25C25C, 18N05A25C20M, 18N05A25C15C, 18N05A25C10H, 18N05A25C05X, 18N05A25G15D, 18N05A25G05I, 18N05A25C15N, 18N05A25G05P, 18N05A25C15E, 18N05A25H01V, 18N05A25D21K, 18N05A25D16Q, 18N05A25D11F, 18N05A25D06Q, 18N05A25H06W, 18N05A25D21B, 18N05A25D16L, 18N05A25D16B, 18N05A25D06W, 18N05A25D21H, 18N05A25D16X, 18N05A25D16C, 18N05A25H11D, 18N05A25H06T, 18N05A25D21Z, 18N05A25D21U, 18N05A25D06T, 18N05A25H12A, 18N05A25H07K, 18N05A25H07B, 18N05A25D22L, 18N05A25H12C, 18N05A25H07C, 18N05A25H02X, 18N05A25H02S, 18N05A25H02D, 18N05A25H07U, 18N05A25H07E, 18N05A25H08K, 18N05A25H08S, 18N05A25H03H, 18N05A25H13D, 18N05A25H08I, 18N05A25H03N, 18N05A25H03I, 18N05A25D23Y, 18N05A25H04Q, 18N05A25H09G, 18N05A25D24M, 18N05A25H14D, 18N05A25H09N, 18N05A25H04I, 18N05A25D24D, 18N05A25H09Z, 18N05A25H09U, 18N05A25H04P, 18N05A25D25Q, 18N05A25H05R, 18N05A25H05G, 18N05A25D25W, 18N05A25D25L, 18N05A25H10X, 18N05A25H05S, 18N05A25D25X, 18N05A25H10T, 18N05A25D25J, 18N05A25D25E, 18N05B21E06A, 18N05B21E01L, 18N05B21A21K, 18N05B21A21G, 18N05B21E11I, 18N05B21E06U, 18N05B21E06J, 18N05B21E01U, 18N05B21E07F, 18N05B21A22V, 18N05B21E07R, 18N05B21E02W, 18N05B21A22B, 18N05B21E12C, 18N05B21A22S, 18N05B21A22M, 18N05B21A22H, 18N05B21E12J, 18N05B21E07Z, 18N05B21E07J, 18N05B21E08K, 18N05B21E03F, 18N05B21E08B, 18N05B21E03S, 18N05B21A23C, 18N05B21E08Y, 18N05B21E08T, 18N05B21E03Z, 18N05B21E03U, 18N05B21E03P, 18N05B21A23Z, 18N05B21E09Q, 18N05B21E04Q, 18N05B21E04F, 18N05B21E04R, 18N05B21A24R, 18N05B21A24H, 18N05B21E09Y, 18N05B21E14E, 18N05B21E09U, 18N05B21E15A, 18N05B21E05F, 18N05B21E05W, 18N05B21E05L, 18N05B21A25G, 18N05A25G05A, 18N05A25C20Q, 18N05A25C15V, 18N05A25C10V, 18N05A25G05R, 18N05A25C25W, 18N05A25C25B, 18N05A25C10B, 18N05A25C05L, 18N05A25C05G, 18N05A25C20S, 18N05A25C20C, 18N05A25C05M, 18N05A25G05T, 18N05A25C25D, 18N05A25C20N, 18N05A25C20D, 18N05A25C15I, 18N05A25C10T, 18N05A25G15E, 18N05A25G05U, 18N05A25C20J, 18N05A25C10Z, 18N05A25D21F, 18N05A25D11V, 18N05A25D11Q, 18N05A25H11B, 18N05A25H06L, 18N05A25H01W, 18N05A25H01L, 18N05A25D11W, 18N05A25H06X, 18N05A25D21S, 18N05A25D21C, 18N05A25D11X, 18N05A25D11M, 18N05A25D06X, 18N05A25H06P, 18N05A25H06E, 18N05A25H01I, 18N05A25H01D, 18N05A25D21Y, 18N05A25D06Y, 18N05A25H07F, 18N05A25H02K, 18N05A25D22Q, 18N05A25H07W, 18N05A25D22G, 18N05A25H02N, 18N05A25D22Y, 18N05A25D22T, 18N05A25H02Z, 18N05A25H02E, 18N05A25H08V, 18N05A25H08F, 18N05A25H03K, 18N05A25H03F, 18N05A25D23F, 18N05A25H08R, 18N05A25H08G, 18N05A25D23W, 18N05A25H03X, 18N05A25H03S, 18N05A25H08D, 18N05A25D23I, 18N05A25H08Z, 18N05A25H09V, 18N05A25H09Q, 18N05A25H09F, 18N05A25H08E, 18N05A25D23E, 18N05A25H04R, 18N05A25D24L, 18N05A25D24B, 18N05A25D24S, 18N05A25H09Y, 18N05A25H09I, 18N05A25H14E, 18N05A25D24E, 18N05A25H15A, 18N05A25H10F, 18N05A25D25K, 18N05A25D25F, 18N05A25H10W, 18N05A25H10C, 18N05A25H05C, 18N05A25H10Y, 18N05A25H15E, 18N05A25H05E, 18N05B21E01V, 18N05B21E01G, 18N05B21A21Q, 18N05B21E11H, 18N05B21E11C, 18N05B21E06H, 18N05B21E01C, 18N05B21A21S, 18N05B21E11D, 18N05B21E06T, 18N05B21E01N, 18N05B21E01D, 18N05B21E01Z, 18N05B21E07H, 18N05B21E02S, 18N05B21A22C, 18N05B21E12D, 18N05B21A22I, 18N05B21E07E, 18N05B21E02Z, 18N05B21E02J, 18N05B21A22U, 18N05B21E08F, 18N05B21E13H, 18N05B21E08M, 18N05B21E03T, 18N05B21E03D, 18N05B21E03J, 18N05B21E09V, 18N05B21E09F, 18N05B21E09G, 18N05B21A24L, 18N05B21E09S, 18N05B21E09N, 18N05B21E09I, 18N05B21E04N, 18N05B21A24N, 18N05B21E09Z, 18N05B21E09P, 18N05B21E09J, 18N05B21E09E, 18N05B21A25A, 18N05B21E15B, 18N05B21E10L, 18N05B21E05B, 18N05B21A25L, 18N05B21A25B"],
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
            Mineria(browser, Pin);
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
            { tipo: "Contador", nombres: ["Daniela Celeste Bracho Raleigh (88876)"] },
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
            Mineria(browser, Pin);


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


            let ArchivoAmbiental;
            if (IdArea == '509188') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509188.pdf`;
            } else if (IdArea == '503239') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\503239.pdf`;

            } else if (IdArea == 'RFE_08211') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08211.pdf`;

            } else if (IdArea == 'RFE_08A') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08A.pdf`;

            } else if (IdArea == 'RFE_08B') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08B.pdf`;

            } else if (IdArea == 'Riosucio598' || IdArea == 'supia' || IdArea == 'supiaincompleto') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\QCO-08032.pdf`;

            } else if (IdArea == '507948sincelda') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\507948sincelda.pdf`;

            } else if (IdArea == '509136') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509136.pdf`;

            } else if (IdArea == 'CollectiveCAG_141') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\CollectiveCAG_141.pdf`;

            } else if (IdArea == '697_17') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\697_17.pdf`;

            } else if (IdArea == '502172') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\502172.pdf`;

            } else if (IdArea == '671_17') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\671_17.pdf`;

            } else if (IdArea == '508353Inferior') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508353Inferior.pdf`;

            } else if (IdArea == '508353Superior') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508353Superior.pdf`;

            } else if (IdArea == '508359SUPERIOR') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508359SUPERIOR.pdf`;

            } else if (IdArea == '508359INFERIOR') {
                ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\508359INFERIOR.pdf`;

            }
            else {
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
            Mineria(browser, Pin);
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

        for (let i = 0; i < 1; i += 1) {
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
        Mineria(browser, Pin);







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
    } else if (Tipo == 5) {
        msg = "¡¡¡Ojo Pestañas!!! " + EquipoActual;
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
                    console.log(`Bro manito sabe que  pilke -> ${error}`)
                }
                try {
                    await addProfesional[1].click();
                } catch (error) {
                    console.log("ERR 1");
                    console.log(`Bro manito sabe que  pilke -> ${error}`)
                }
                try {
                    await addProfesional[2].click();

                } catch (error) {
                    console.log("ERR 2");
                    console.log(`Bro manito sabe que  pilke -> ${error}`)
                }
                try {

                    await addProfesional[3].click();
                } catch (error) {
                    console.log("ERR 3");
                    console.log(`Bro manito sabe que  pilke -> ${error}`)
                }
                try {

                    await addProfesional[4].click();
                } catch (error) {
                    console.log("ERR 4");
                    console.log(`Bro manito sabe que  pilke -> ${error}`)
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