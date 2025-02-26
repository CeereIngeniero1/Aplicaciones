const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require('console');
const colors = require('colors');
const { keyboard, mouse, Key, clipboard } = require('@nut-tree-fork/nut-js');


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
var Empresa = 'Freeport';
var user1 = '97295';
var pass1 = 'Freeport2025#';
var user2 = '83949';
var pass2 = '*Jcrmh2022#';
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
        if (Pines.substring(i + 1, i + 4) == 'F1:') {
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

            await page.type('#submitterPersonOrganizationNameId', '97295');
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

            let Minerales = ['COBRE', 'cobre', 'PLATA', 'Plata', 'ORO', 'oro'];
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
                    "508391",
                    1,
                    "18P09K04N18H",
                    ['18P09K04N18H, 18P09K04N18Y, 18P09K04N18N, 18P09K04N19Z, 18P09K04N19P, 18P09K04N20H, 18P09K04N20I, 18P09K04N20U, 18P09K04P16V, 18P09K04P16W, 18P09K04P16S, 18P09K04P16H, 18P09K04P16D, 18P09K04P16J, 18P09K04P16E, 18P09K04P17V, 18P09K04P17W, 18P09K04P17S, 18P09K04P18F, 18P09K04P18U, 18P09K09C04Q, 18P09K04P19F, 18P09K09C14G, 18P09K09C09R, 18P09K04P19B, 18P09K09C04S, 18P09K04P19H, 18P09K04P19T, 18P09K09C04Z, 18P09K04P24U, 18P09K09C05K, 18P09K09C05F, 18P09K09C05A, 18P09K04P25F, 18P09K04P20A, 18P09K09C05S, 18P09K09C05G, 18P09K09C05B, 18P09K09C10Y, 18P09K09C10I, 18P09K04P20Y, 18P09K09C10E, 18P09K09C05E, 18P09K04P25P, 18P09K04P20U, 18P09K09D11A, 18P09K09D01K, 18P09K09D01X, 18P09K09D01M, 18P09K04Q21S, 18P09K04Q16M, 18P09K09D11D, 18P09K09D06I, 18P09K09D01D, 18P09K09D06Z, 18P09K09D01Z, 18P09K09D01E, 18P09K09D12F, 18P09K09D07F, 18P09K09D02F, 18P09K04Q17F, 18P09K09D07R, 18P09K04Q17W, 18P09K04Q17R, 18P09K04N18U, 18P09K04N19Q, 18P09K04N19K, 18P09K04N19B, 18P09K04N20Y, 18P09K04N20P, 18P09K04P16R, 18P09K04P16T, 18P09K04P16N, 18P09K04P17L, 18P09K04P17X, 18P09K04P18A, 18P09K09C09K, 18P09K09C04F, 18P09K04P24F, 18P09K09C04R, 18P09K04P24S, 18P09K04P19N, 18P09K09C09J, 18P09K09C04U, 18P09K04P20Q, 18P09K04P20F, 18P09K09C10W, 18P09K09C05R, 18P09K04P25H, 18P09K04P20X, 18P09K09C10D, 18P09K09C05N, 18P09K04P25Y, 18P09K04P25N, 18P09K09C10U, 18P09K09C05P, 18P09K04P20P, 18P09K04P20E, 18P09K09D06L, 18P09K09D01G, 18P09K04Q21L, 18P09K04Q21B, 18P09K04Q16R, 18P09K09D01S, 18P09K04Q21M, 18P09K04Q16C, 18P09K09D01N, 18P09K04Q21D, 18P09K09D06U, 18P09K04Q21P, 18P09K04Q16U, 18P09K09D07V, 18P09K09D07Q, 18P09K09D07A, 18P09K09D02Q, 18P09K04Q22V, 18P09K09D07W, 18P09K09D02L, 18P09K09D02G, 18P09K04Q22H, 18P09K04Q17H, 18P09K04N18I, 18P09K04N18D, 18P09K04N19A, 18P09K04N19I, 18P09K04N19U, 18P09K04N20A, 18P09K04N20X, 18P09K04N20D, 18P09K04P16F, 18P09K04P16U, 18P09K04P17G, 18P09K04P17B, 18P09K04P17H, 18P09K04P17N, 18P09K04P17J, 18P09K04P18L, 18P09K04P18M, 18P09K09C09V, 18P09K04P24K, 18P09K09C09L, 18P09K04P24W, 18P09K04P19R, 18P09K04P19L, 18P09K09C14C, 18P09K09C04M, 18P09K04P24X, 18P09K09C09D, 18P09K09C04Y, 18P09K09C04N, 18P09K04P24T, 18P09K04P24I, 18P09K09C09Z, 18P09K09C09E, 18P09K04P24E, 18P09K04P19J, 18P09K09C15A, 18P09K09C10F, 18P09K04P25V, 18P09K04P25A, 18P09K09C15H, 18P09K09C10X, 18P09K09C10G, 18P09K09C10B, 18P09K09C10C, 18P09K09C05C, 18P09K04P25W, 18P09K04P25M, 18P09K04P25G, 18P09K04P20B, 18P09K09C15D, 18P09K09C05I, 18P09K09C05D, 18P09K04P20I, 18P09K09D06V, 18P09K04Q16A, 18P09K09D01L, 18P09K04Q21W, 18P09K04Q21R, 18P09K04Q21C, 18P09K04Q16S, 18P09K04Q11Y, 18P09K09D01P, 18P09K04Q21J, 18P09K04Q21E, 18P09K04Q22F, 18P09K04Q22A, 18P09K09D07G, 18P09K04Q22B, 18P09K09D07X, 18P09K09D07C, 18P09K09D02M, 18P09K04Q17C, 18P09K04N18J, 18P09K04N19V, 18P09K04N19W, 18P09K04N19R, 18P09K04N19X, 18P09K04N20Q, 18P09K04N20M, 18P09K04P17F, 18P09K04P17Y, 18P09K04P17T, 18P09K04P17I, 18P09K04P17D, 18P09K04P17U, 18P09K04P17E, 18P09K04P18Q, 18P09K04P18W, 18P09K04P18R, 18P09K04P18K, 18P09K04P18D, 18P09K04P18P, 18P09K04P19Q, 18P09K09C09B, 18P09K04P19G, 18P09K09C09C, 18P09K09C04X, 18P09K04P24M, 18P09K04P24C, 18P09K04P19X, 18P09K09C14I, 18P09K09C09N, 18P09K04P24D, 18P09K04P19D, 18P09K09C14J, 18P09K04P24P, 18P09K04P19P, 18P09K09C10V, 18P09K09C10A, 18P09K09C15G, 18P09K09C10S, 18P09K09C05W, 18P09K09C05H, 18P09K04P25X, 18P09K04P20G, 18P09K09C10P, 18P09K04P25Z, 18P09K04P25U, 18P09K04P25E, 18P09K09D11F, 18P09K09D06Q, 18P09K04Q21K, 18P09K04Q21F, 18P09K04Q21A, 18P09K04Q16F, 18P09K04Q16W, 18P09K04Q16G, 18P09K09D01C, 18P09K09D06T, 18P09K09D01T, 18P09K04Q21T, 18P09K09D01J, 18P09K04Q21U, 18P09K04Q16Z, 18P09K09D07K, 18P09K09D02K, 18P09K04Q22Q, 18P09K09D07L, 18P09K09D07B, 18P09K09D02B, 18P09K04Q17G, 18P09K09D02S, 18P09K09D02C, 18P09K04Q22X, 18P09K04N18M, 18P09K04N18T, 18P09K04N18E, 18P09K04N19G, 18P09K04N19S, 18P09K04N19Y, 18P09K04N20R, 18P09K04N20G, 18P09K04N20Z, 18P09K04P16K, 18P09K04P16G, 18P09K04P16B, 18P09K04P16Z, 18P09K04P17Q, 18P09K04P17K, 18P09K04P17R, 18P09K04P17Z, 18P09K04P17P, 18P09K04P18V, 18P09K04P18G, 18P09K04P18B, 18P09K04P18T, 18P09K09C09W, 18P09K09C04W, 18P09K09C04L, 18P09K09C04B, 18P09K04P24R, 18P09K04P24L, 18P09K09C04H, 18P09K04P24H, 18P09K04P19S, 18P09K04P19C, 18P09K09C14D, 18P09K09C09T, 18P09K04P24Y, 18P09K04P24N, 18P09K09C09U, 18P09K09C04E, 18P09K09C15F, 18P09K09C10K, 18P09K04P25K, 18P09K04P20K, 18P09K09C10L, 18P09K09C05X, 18P09K09C05M, 18P09K04P25R, 18P09K04P25L, 18P09K04P25B, 18P09K04P20M, 18P09K09C15I, 18P09K09C10T, 18P09K09C05T, 18P09K04P25D, 18P09K04P20N, 18P09K04P20D, 18P09K09C15J, 18P09K09C05U, 18P09K04P25J, 18P09K04P20Z, 18P09K09D06A, 18P09K09D01Q, 18P09K09D01F, 18P09K04Q21Q, 18P09K04Q16Q, 18P09K09D11G, 18P09K09D06G, 18P09K09D06B, 18P09K09D01R, 18P09K09D06S, 18P09K04Q21X, 18P09K04Q16X, 18P09K04Q16H, 18P09K04Q21Y, 18P09K04Q16I, 18P09K04Q16D, 18P09K04Q21Z, 18P09K04Q11Z, 18P09K09D02V, 18P09K04Q17K, 18P09K04Q22G, 18P09K09D12H, 18P09K09D07H, 18P09K04Q22M, 18P09K04Q17X, 18P09K04N18X, 18P09K04N18S, 18P09K04N18C, 18P09K04N18P, 18P09K04N19L, 18P09K04N19C, 18P09K04N20V, 18P09K04N20W, 18P09K04N20B, 18P09K04N20C, 18P09K04N20T, 18P09K04P16Q, 18P09K04N20E, 18P09K04P16A, 18P09K04P17A, 18P09K04P18S, 18P09K04P18Y, 18P09K04P18N, 18P09K04P18I, 18P09K04P18Z, 18P09K09C04V, 18P09K04P24Q, 18P09K04P19A, 18P09K09C14B, 18P09K04P24B, 18P09K04P19W, 18P09K09C09X, 18P09K09C09I, 18P09K09C04D, 18P09K09C14E, 18P09K04P20V, 18P09K09C10R, 18P09K09C05L, 18P09K04P25S, 18P09K04P25T, 18P09K04P20T, 18P09K09C15E, 18P09K09C10Z, 18P09K09D01V, 18P09K04Q21V, 18P09K09D06R, 18P09K04Q21G, 18P09K09D11H, 18P09K09D11C, 18P09K09D06X, 18P09K09D06C, 18P09K04Q21H, 18P09K09D01Y, 18P09K09D01I, 18P09K04Q21N, 18P09K04Q21I, 18P09K04Q16T, 18P09K04Q16N, 18P09K09D06P, 18P09K09D12A, 18P09K09D02A, 18P09K04Q22K, 18P09K04Q12V, 18P09K09D12B, 18P09K09D02W, 18P09K09D02R, 18P09K04Q22R, 18P09K04Q17B, 18P09K09D02X, 18P09K04Q22S, 18P09K04Q22C, 18P09K04Q17M, 18P09K04N18Z, 18P09K04N19F, 18P09K04N19J, 18P09K04N19E, 18P09K04N20K, 18P09K04N20F, 18P09K04N20S, 18P09K04N20N, 18P09K04N20J, 18P09K04P16P, 18P09K04P17C, 18P09K04P18C, 18P09K09C09Q, 18P09K09C09A, 18P09K09C04A, 18P09K04P24V, 18P09K04P19V, 18P09K09C09G, 18P09K09C04G, 18P09K09C14H, 18P09K09C09H, 18P09K09C09Y, 18P09K04P19I, 18P09K09C09P, 18P09K04P24J, 18P09K04P19Z, 18P09K09C10Q, 18P09K04P25Q, 18P09K09C15B, 18P09K09C15C, 18P09K09C10H, 18P09K04P20W, 18P09K04P20R, 18P09K04P20S, 18P09K04P20H, 18P09K04P20C, 18P09K09C10N, 18P09K04P25I, 18P09K09C10J, 18P09K09C05J, 18P09K04P20J, 18P09K09D06F, 18P09K04Q16K, 18P09K09D06W, 18P09K09D01B, 18P09K04Q16B, 18P09K09D06M, 18P09K09D06H, 18P09K09D01H, 18P09K09D06N, 18P09K09D11J, 18P09K09D11E, 18P09K09D06J, 18P09K09D06E, 18P09K09D01U, 18P09K04Q16P, 18P09K04Q17V, 18P09K04Q22L, 18P09K04Q12W, 18P09K09D12C, 18P09K09D07S, 18P09K04Q12X, 18P09K04N19M, 18P09K04N19H, 18P09K04N19T, 18P09K04N19N, 18P09K04N19D, 18P09K04N20L, 18P09K04P16L, 18P09K04P16X, 18P09K04P16M, 18P09K04P16C, 18P09K04P16Y, 18P09K04P16I, 18P09K04P17M, 18P09K04P18X, 18P09K04P18H, 18P09K04P18J, 18P09K04P18E, 18P09K09C14F, 18P09K09C14A, 18P09K09C09F, 18P09K09C04K, 18P09K04P24A, 18P09K04P19K, 18P09K04P24G, 18P09K09C09S, 18P09K09C09M, 18P09K09C04C, 18P09K04P19M, 18P09K09C04T, 18P09K09C04I, 18P09K04P19Y, 18P09K09C04P, 18P09K09C04J, 18P09K04P24Z, 18P09K04P19U, 18P09K04P19E, 18P09K09C05V, 18P09K09C05Q, 18P09K09C10M, 18P09K04P25C, 18P09K04P20L, 18P09K09C05Y, 18P09K09C05Z, 18P09K09D06K, 18P09K09D01A, 18P09K04Q16V, 18P09K09D11B, 18P09K09D01W, 18P09K04Q16L, 18P09K04Q11X, 18P09K09D11I, 18P09K09D06Y, 18P09K09D06D, 18P09K04Q16Y, 18P09K04Q16J, 18P09K04Q16E, 18P09K04Q17Q, 18P09K04Q17A, 18P09K09D12G, 18P09K04Q22W, 18P09K04Q17L, 18P09K09D07M, 18P09K09D02H, 18P09K04Q17S'],
                    77
                );
            }  else  if (Band == 3) {
                MonitorearAreas(
                    "ARE-510343",// rECUERDA EL SAHPEFILE DEBE IR CON ESTE MISMO NOMBRE ES DECIR 508390.zip
                    1,
                    "18P09K04C23I",
                    ['18P09K04C23I, 18P09K04C18N, 18P09K04C24Q, 18P09K04C24B, 18P09K04C24H, 18P09K04C19Z, 18P09K04C20K, 18P09K04C20F, 18P09K04C20G, 18P09K04C25E, 18P09K04D21I, 18P09K04D21D, 18P09K04D16Y, 18P09K04C23N, 18P09K04C18Y, 18P09K04C24K, 18P09K04C19L, 18P09K04C24T, 18P09K04C25F, 18P09K04C25S, 18P09K04C25G, 18P09K04C20W, 18P09K04C20I, 18P09K04C25P, 18P09K04C20U, 18P09K04D21Q, 18P09K04D16V, 18P09K04D16Q, 18P09K04D21L, 18P09K04D16R, 18P09K04D21S, 18P09K04D21N, 18P09K04D21E, 18P09K04D16Z, 18P09K04D22K, 18P09K04C18T, 18P09K04C23U, 18P09K04C23E, 18P09K04C18U, 18P09K04C19F, 18P09K04C24S, 18P09K04C24N, 18P09K04C19U, 18P09K04C19J, 18P09K04C25Q, 18P09K04C25L, 18P09K04C25I, 18P09K04D16F, 18P09K04D21G, 18P09K04D21C, 18P09K04C23T, 18P09K04C18I, 18P09K04C23J, 18P09K04C19V, 18P09K04C24R, 18P09K04C24L, 18P09K04C19S, 18P09K04C24I, 18P09K04C20Q, 18P09K04C25H, 18P09K04C25T, 18P09K04C20Y, 18P09K04C20T, 18P09K04C20N, 18P09K04D16L, 18P09K04D21M, 18P09K04D16H, 18P09K04D16I, 18P09K04D21J, 18P09K04D16U, 18P09K04D16J, 18P09K04D22Q, 18P09K04D17V, 18P09K04C18J, 18P09K04C19Q, 18P09K04C19K, 18P09K04C19G, 18P09K04C24C, 18P09K04C19M, 18P09K04C24D, 18P09K04C19T, 18P09K04C20X, 18P09K04C20M, 18P09K04D21K, 18P09K04D16G, 18P09K04D16X, 18P09K04D16M, 18P09K04D16T, 18P09K04D21U, 18P09K04D21P, 18P09K04D22F, 18P09K04D17Q, 18P09K04D17K, 18P09K04C24F, 18P09K04C24A, 18P09K04C24G, 18P09K04C19W, 18P09K04C24U, 18P09K04C24P, 18P09K04C25A, 18P09K04C25M, 18P09K04C25B, 18P09K04C20L, 18P09K04C20H, 18P09K04C25N, 18P09K04C20P, 18P09K04D16K, 18P09K04D16W, 18P09K04D21H, 18P09K04D16N, 18P09K04D17F, 18P09K04C23D, 18P09K04C19X, 18P09K04C19H, 18P09K04C19Y, 18P09K04C19I, 18P09K04C25R, 18P09K04C25J, 18P09K04C20J, 18P09K04D21F, 18P09K04D21A, 18P09K04D21R, 18P09K04D16S, 18P09K04D16P, 18P09K04C23P, 18P09K04C18Z, 18P09K04C18P, 18P09K04C19R, 18P09K04C24M, 18P09K04C19N, 18P09K04C24J, 18P09K04C24E, 18P09K04C19P, 18P09K04C25K, 18P09K04C20V, 18P09K04C25C, 18P09K04C20R, 18P09K04C20S, 18P09K04C25D, 18P09K04C25U, 18P09K04C20Z, 18P09K04D21B, 18P09K04D21T, 18P09K04D22A'], // DON JORGE ACA COLOCAS EL AREA QUE TERMINA EN 90
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
            await continCeldas[1].click();
            // if(Band == 81 ){
            //     console.log("prueba");
            //     await page.waitForTimeout(300000);
            // }
            console.log(IdArea);
            await page.waitForTimeout(3000);

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

            if (celdasNoDisponibles.length > 0) {
                // Tipo, Area, Celda

                // Crear una lista de celdas no disponibles (eliminando espacios innecesarios)
                const celdasNoDisponiblesLimpias = celdasNoDisponibles[0].map(celda => celda.trim());

                // Asegurarse de que 'ComparacionCeldas' esté correctamente dividido en celdas
                const areaCeldas = ComparacionCeldas;

                // Filtrar el arreglo 'areaCeldas' para excluir las celdas no disponibles
                areaFiltrado = areaCeldas.filter(celda => !celdasNoDisponiblesLimpias.includes(celda));

                //Correo(1, Area, areaFiltrado);

                // Mostrar el nuevo arreglo que no contiene las celdas no disponibles
                // console.log('ÁREA MONTADA EXCLUYENDO LAS CELDAS QUE NO ESTÁN DISPONIBLES => ', areaFiltrado);
                // console.log(`ÁREA MONTADA EXCLUYENDO LAS CELDAS QUE NO ESTÁN DISPONIBLES => `.green.bold);
                console.log(`CELDAS DISPONIBLES => `.green.bold);
                console.log(`["${areaFiltrado.join(', ')}"],`);
                console.log(`===============================================================================================`.cyan.bold);

                //     page.evaluate(() => {
                //         document.querySelector('[id="cellIdsTxtId"]').value = "";
                //     });

                //     MonitorearAreas(
                //         "007-85M",
                //         1,
                //         "Esto es una celda de prueba",
                //         `["${areaFiltrado.join(', ')}"],`,
                //         0
                //     );

                //     IdArea = DetallesCompletos.IdArea;
                // Aviso = DetallesCompletos.Aviso;
                // Celda = DetallesCompletos.Celda;
                // Area = DetallesCompletos.Area;
                // Comas = DetallesCompletos.Comas;
                // ComparacionCeldas = DetallesCompletos.ComparacionCeldas;

                // const continCeldas = await page.$x('//span[contains(.,"Continuar")]');
                // await continCeldas[1].click();

                // Band = 80;


                // await page.waitForTimeout(2000000);
            } else {
                Band = 80;
                console.log('No se encontraron celdas no disponibles.');
                console.log(`===============================================================================================`.cyan.bold);
            }
            /* FIN FIN FIN */

            // await page.waitForTimeout(2000000);
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
                if (Band == 3) {
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
            // { tipo: "Geólogo", nombres: ["MARVIN MOSQUERA PALACIOS  (74336)"] },
            { tipo: "Ingeniero Geólogo", nombres: ["Marvin  Mosquera Palacios (74336)"] },
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
            { tipo: "Contador", nombres: ["YISELA ISABEL ORTIZ TAPIAS (97297)"] },
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



            //ESTADOS FINACIERS
            // Check
            // document.querySelector('Input[id="declareIndId0"]').click();

            //Valores
            // document.getElementById('currentAssetId0').value = '42539369275' // OLD
            document.getElementById('activoCorrienteId0').value = '273722000';

            angular.element(document.getElementById('activoCorrienteId0')).triggerHandler('change');

            // document.getElementById('currentLiabilitiesId0').value = '15184416062' // OLD
            document.getElementById('pasivoCorrienteId0').value = '32023000';

            angular.element(document.getElementById('pasivoCorrienteId0')).triggerHandler('change');

            // document.getElementById('totalAssetId0').value = '48322540755' // OLD
            document.getElementById('activoTotalId0').value = '575074000';

            angular.element(document.getElementById('activoTotalId0')).triggerHandler('change');

            // document.getElementById('totalLiabilitiesId0').value = '15401226207' // OLD
            document.getElementById('pasivoTotalId0').value = '32023000';

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
            ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\Certificado_Ambiental.pdf`;



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
        to: 'jorgecalle@hotmail.com, jorgecaller@gmail.com, alexisaza@hotmail.com, camilodesarrollador@outlook.com, ceereweb@gmail.com, Fernando.pala.99@gmail.com, soportee4@gmail.com, soporte.ceere06068@gmail.com',
        //to: '  Fernando.pala.99@gmail.com',
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