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
var Empresa = 'NegoYMetales';
var user1 = '98725';
var pass1 = 'Riosucio2025.';
var user2 = '';
var pass2 = '';
var Agente = 0;
var EnviarCorreosParaPestanas = 0;
var contreapertura = 0;
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
        if (Pines.substring(i + 1, i + 4) == 'NM:') {
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

            await page.type('#submitterPersonOrganizationNameId', '98725');
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
               if (Band == 1) {
                MonitorearAreas(
                    "509897",
                    1,
                    "18N05E04J01U",
                    ['18N05E04J01U, 18N05E04J12F, 18N05E04N07L, 18N05E04J02W, 18N05E04J22X, 18N05E04J22C, 18N05E04J12S, 18N05E04J02M, 18N05E04N02Y, 18N05E04N02N, 18N05E04J22N, 18N05E04J12T, 18N05E04J07I, 18N05E04N02J, 18N05E04J17Z, 18N05E04J07P, 18N05E04N08Q, 18N05E04J23W, 18N05E04J23B, 18N05E04J18F, 18N05E04J13Q, 18N05E04J13K, 18N05E04J08K, 18N05E04J03K, 18N05E04N08X, 18N05E04N03H, 18N05E04J13M, 18N05E04J23D, 18N05E04J18Y, 18N05E04J13Y, 18N05E04J08T, 18N05E04J03T, 18N05E04N08Z, 18N05E04N03Z, 18N05E04J23P, 18N05E04J23J, 18N05E04N09K, 18N05E04N04A, 18N05E04J24Q, 18N05E04J19Q, 18N05E04J09F, 18N05E04J24R, 18N05E04J09R, 18N05E04J04R, 18N05E04N09H, 18N05E04N09T, 18N05E04N04I, 18N05E04J09Y, 18N05E04J14Z, 18N05E04J09Z, 18N05E04J09U, 18N05E04J09P, 18N05E04N10F, 18N05E04N05V, 18N05E04J20V, 18N05E04J20Q, 18N05E04N05G, 18N05E04J25W, 18N05E04J25R, 18N05E04J25S, 18N05E04J25C, 18N05E04J20W, 18N05E04J20R, 18N05E04J20S, 18N05E04J25I, 18N05E04J20T, 18N05E04J20E, 18N05E04J15Z, 18N05E04J11Z, 18N05E04J06Y, 18N05E04J06U, 18N05E04J06J, 18N05E04J01Y, 18N05E04N02Q, 18N05E04J22K, 18N05E04J17Q, 18N05E04J12V, 18N05E04J12Q, 18N05E04J12A, 18N05E04J07F, 18N05E04N02R, 18N05E04J22L, 18N05E04J22G, 18N05E04J12L, 18N05E04J07G, 18N05E04J02L, 18N05E04N07S, 18N05E04N07H, 18N05E04J22S, 18N05E04J17C, 18N05E04J12H, 18N05E04J07M, 18N05E04N07T, 18N05E04N02T, 18N05E04J22D, 18N05E04J22U, 18N05E04J22P, 18N05E04J22E, 18N05E04J17U, 18N05E04J17J, 18N05E04J17E, 18N05E04J12Z, 18N05E04J07Z, 18N05E04J02Z, 18N05E04N08L, 18N05E04J23Q, 18N05E04J23R, 18N05E04J18W, 18N05E04J18R, 18N05E04J13A, 18N05E04J08Q, 18N05E04N03X, 18N05E04N03M, 18N05E04J23X, 18N05E04J18M, 18N05E04J18H, 18N05E04J08S, 18N05E04N08T, 18N05E04N08I, 18N05E04N03D, 18N05E04J23I, 18N05E04J18N, 18N05E04N09A, 18N05E04N04Q, 18N05E04N04K, 18N05E04J24A, 18N05E04J19A, 18N05E04J09K, 18N05E04J04Q, 18N05E04J04K, 18N05E04N04G, 18N05E04J24L, 18N05E04J19B, 18N05E04J14R, 18N05E04J14G, 18N05E04J09W, 18N05E04N04X, 18N05E04J24S, 18N05E04J19X, 18N05E04J19M, 18N05E04N04Y, 18N05E04J14N, 18N05E04J09N, 18N05E04J09I, 18N05E04J04Y, 18N05E04N09E, 18N05E04J24J, 18N05E04J19P, 18N05E04J04P, 18N05E04J15K, 18N05E04J15F, 18N05E04J05Q, 18N05E04N10X, 18N05E04N10B, 18N05E04J20H, 18N05E04J15L, 18N05E04J15G, 18N05E04J10B, 18N05E04N10I, 18N05E04N05T, 18N05E04J25N, 18N05E04J20I, 18N05E04J25J, 18N05E04J20J, 18N05E04J15J, 18N05E04J11T, 18N05E04J11D, 18N05E04J06T, 18N05E04J06I, 18N05E04J07A, 18N05E04N07R, 18N05E04N02L, 18N05E04J17W, 18N05E04J17L, 18N05E04N02M, 18N05E04J22M, 18N05E04N07N, 18N05E04J12I, 18N05E04J12D, 18N05E04J12U, 18N05E04J13B, 18N05E04J08V, 18N05E04J08F, 18N05E04N08H, 18N05E04J23S, 18N05E04J13C, 18N05E04J03S, 18N05E04N03T, 18N05E04J23Y, 18N05E04J23N, 18N05E04J18I, 18N05E04J08N, 18N05E04N08U, 18N05E04N08E, 18N05E04J13P, 18N05E04J03Z, 18N05E04J03U, 18N05E04J14V, 18N05E04N09L, 18N05E04N09G, 18N05E04J19L, 18N05E04J04W, 18N05E04J24X, 18N05E04J19S, 18N05E04J19C, 18N05E04J14S, 18N05E04J14H, 18N05E04N09D, 18N05E04J24Y, 18N05E04N04U, 18N05E04J24U, 18N05E04J04Z, 18N05E04N10V, 18N05E04J25Q, 18N05E04J25F, 18N05E04J25A, 18N05E04J20K, 18N05E04J10A, 18N05E04J05V, 18N05E04N10L, 18N05E04N05W, 18N05E04N05L, 18N05E04J20B, 18N05E04J15W, 18N05E04J15B, 18N05E04J05W, 18N05E04N10N, 18N05E04J10T, 18N05E04J25Z, 18N05E04J15P, 18N05E04J16Z, 18N05E04J16D, 18N05E04J11Y, 18N05E04J11U, 18N05E04J11N, 18N05E04N02A, 18N05E04J17A, 18N05E04J07Q, 18N05E04J02V, 18N05E04N07G, 18N05E04N02W, 18N05E04J07W, 18N05E04J07L, 18N05E04J07B, 18N05E04J02R, 18N05E04N02X, 18N05E04J17M, 18N05E04J17H, 18N05E04N07D, 18N05E04J07D, 18N05E04N07E, 18N05E04J22Z, 18N05E04J17P, 18N05E04N08F, 18N05E04N08G, 18N05E04N03R, 18N05E04J23V, 18N05E04J13G, 18N05E04J08R, 18N05E04J08B, 18N05E04N03S, 18N05E04J08X, 18N05E04J13I, 18N05E04J08Y, 18N05E04N08J, 18N05E04N03E, 18N05E04J13E, 18N05E04J08U, 18N05E04J08E, 18N05E04N09Q, 18N05E04N09F, 18N05E04N04V, 18N05E04J24V, 18N05E04J19K, 18N05E04N04L, 18N05E04N04B, 18N05E04J24W, 18N05E04J24G, 18N05E04N09M, 18N05E04N04H, 18N05E04J24M, 18N05E04J24C, 18N05E04J09M, 18N05E04N09Y, 18N05E04N09I, 18N05E04N04T, 18N05E04N04N, 18N05E04J24T, 18N05E04J19T, 18N05E04J19I, 18N05E04J19D, 18N05E04J14D, 18N05E04N09J, 18N05E04J24P, 18N05E04J19J, 18N05E04J19E, 18N05E04J15A, 18N05E04J10F, 18N05E04N10W, 18N05E04N10C, 18N05E04J25B, 18N05E04J20X, 18N05E04J20L, 18N05E04J05R, 18N05E04J05L, 18N05E04J20D, 18N05E04J15T, 18N05E04N10Z, 18N05E04N10P, 18N05E04J15U, 18N05E04J21J, 18N05E04J16Y, 18N05E04J16P, 18N05E04J11E, 18N05E04J06Z, 18N05E04J06P, 18N05E04J06D, 18N05E04N02K, 18N05E04J22V, 18N05E04J17V, 18N05E04J17K, 18N05E04J07K, 18N05E04J02K, 18N05E04N02B, 18N05E04J17R, 18N05E04N07M, 18N05E04N07C, 18N05E04N02S, 18N05E04J22H, 18N05E04J17X, 18N05E04J12X, 18N05E04J12C, 18N05E04J02X, 18N05E04N02I, 18N05E04J17Y, 18N05E04J17T, 18N05E04N07U, 18N05E04N07J, 18N05E04N02E, 18N05E04N08W, 18N05E04N08K, 18N05E04N08A, 18N05E04N03A, 18N05E04J18Q, 18N05E04J18G, 18N05E04J18B, 18N05E04J13R, 18N05E04J08G, 18N05E04J03Q, 18N05E04N08S, 18N05E04N03C, 18N05E04J23C, 18N05E04J18S, 18N05E04J18C, 18N05E04J13H, 18N05E04J08C, 18N05E04J03X, 18N05E04N08Y, 18N05E04N08D, 18N05E04N03N, 18N05E04J13D, 18N05E04J08I, 18N05E04J03N, 18N05E04N08P, 18N05E04N03U, 18N05E04N03P, 18N05E04J23Z, 18N05E04J23U, 18N05E04J18P, 18N05E04J18E, 18N05E04J08P, 18N05E04J24K, 18N05E04J24F, 18N05E04J09A, 18N05E04J04V, 18N05E04N09W, 18N05E04N09R, 18N05E04N09B, 18N05E04J24B, 18N05E04J09L, 18N05E04J09B, 18N05E04J04L, 18N05E04N09C, 18N05E04N04S, 18N05E04N04M, 18N05E04J19H, 18N05E04J09S, 18N05E04J09H, 18N05E04J04S, 18N05E04N09N, 18N05E04J24I, 18N05E04J14Y, 18N05E04J09T, 18N05E04J09D, 18N05E04N09U, 18N05E04N04Z, 18N05E04J24E, 18N05E04J14U, 18N05E04J25V, 18N05E04J25K, 18N05E04J20A, 18N05E04J15Q, 18N05E04J10V, 18N05E04N10M, 18N05E04N10H, 18N05E04N05S, 18N05E04N05C, 18N05E04J25M, 18N05E04J25H, 18N05E04J20C, 18N05E04J15X, 18N05E04J15S, 18N05E04J15M, 18N05E04J15H, 18N05E04J15C, 18N05E04J10X, 18N05E04J10R, 18N05E04J10G, 18N05E04N10Y, 18N05E04N05I, 18N05E04N05D, 18N05E04J25Y, 18N05E04J15N, 18N05E04J10P, 18N05E04J21D, 18N05E04J16T, 18N05E04J16N, 18N05E04J11I, 18N05E04J11J, 18N05E04J06E, 18N05E04J01Z, 18N05E04J01T, 18N05E04J01P, 18N05E04N02F, 18N05E04J22Q, 18N05E04J07V, 18N05E04J02Q, 18N05E04J17S, 18N05E04J07X, 18N05E04J02S, 18N05E04N02D, 18N05E04J17N, 18N05E04J07N, 18N05E04J02N, 18N05E04N02Z, 18N05E04N02U, 18N05E04J07U, 18N05E04J07E, 18N05E04J02U, 18N05E04J02P, 18N05E04N03V, 18N05E04N03W, 18N05E04N03L, 18N05E04N03F, 18N05E04N03B, 18N05E04J23L, 18N05E04J18A, 18N05E04J13V, 18N05E04J13F, 18N05E04J08L, 18N05E04J03V, 18N05E04J03L, 18N05E04N08M, 18N05E04J08H, 18N05E04J18T, 18N05E04J18D, 18N05E04N03J, 18N05E04J18U, 18N05E04J13Z, 18N05E04N09V, 18N05E04N04F, 18N05E04J14K, 18N05E04J09V, 18N05E04N04W, 18N05E04J19G, 18N05E04J09G, 18N05E04N09X, 18N05E04N04C, 18N05E04J09X, 18N05E04J04X, 18N05E04N04D, 18N05E04J24N, 18N05E04J14P, 18N05E04J14E, 18N05E04N10Q, 18N05E04N10A, 18N05E04N05K, 18N05E04N05F, 18N05E04N10S, 18N05E04N05R, 18N05E04N05B, 18N05E04J25G, 18N05E04J20M, 18N05E04J10W, 18N05E04J25T, 18N05E04J10Y, 18N05E04J10N, 18N05E04N10U, 18N05E04J25U, 18N05E04J25P, 18N05E04J20P, 18N05E04J21E, 18N05E04J16U, 18N05E04J16E, 18N05E04J01N, 18N05E04J22F, 18N05E04N07B, 18N05E04J22W, 18N05E04J17G, 18N05E04J17B, 18N05E04J12W, 18N05E04J12B, 18N05E04J07R, 18N05E04N02C, 18N05E04J07S, 18N05E04J07H, 18N05E04J07C, 18N05E04N07I, 18N05E04J22T, 18N05E04J12Y, 18N05E04J07Y, 18N05E04J22J, 18N05E04J12P, 18N05E04J12J, 18N05E04N08R, 18N05E04N08B, 18N05E04N03G, 18N05E04J23A, 18N05E04J18K, 18N05E04J18L, 18N05E04J13W, 18N05E04J08A, 18N05E04N08C, 18N05E04J23M, 18N05E04J23H, 18N05E04J18X, 18N05E04J13X, 18N05E04J08M, 18N05E04J03M, 18N05E04J23T, 18N05E04J23E, 18N05E04J18J, 18N05E04J13J, 18N05E04J08Z, 18N05E04J08J, 18N05E04J03P, 18N05E04J19V, 18N05E04J14Q, 18N05E04J14W, 18N05E04J14L, 18N05E04N09S, 18N05E04J09C, 18N05E04J04M, 18N05E04J24D, 18N05E04J14T, 18N05E04J14I, 18N05E04J04T, 18N05E04J04N, 18N05E04N09Z, 18N05E04N04J, 18N05E04N04E, 18N05E04J24Z, 18N05E04J19Z, 18N05E04N10K, 18N05E04J20F, 18N05E04J15V, 18N05E04J05K, 18N05E04N10R, 18N05E04N10G, 18N05E04N05H, 18N05E04J20G, 18N05E04J10L, 18N05E04N10D, 18N05E04N05Y, 18N05E04N05N, 18N05E04J25D, 18N05E04J15Y, 18N05E04J15D, 18N05E04N10J, 18N05E04J25E, 18N05E04J20U, 18N05E04J16I, 18N05E04J16J, 18N05E04J11P, 18N05E04J06N, 18N05E04J22A, 18N05E04J17F, 18N05E04J12K, 18N05E04N02G, 18N05E04J22R, 18N05E04J22B, 18N05E04J12R, 18N05E04J12G, 18N05E04N02H, 18N05E04J12M, 18N05E04J22Y, 18N05E04J22I, 18N05E04J17I, 18N05E04J17D, 18N05E04J12N, 18N05E04J07T, 18N05E04J02Y, 18N05E04J02T, 18N05E04N07P, 18N05E04N02P, 18N05E04J12E, 18N05E04J07J, 18N05E04N03Q, 18N05E04N03K, 18N05E04J23K, 18N05E04J23F, 18N05E04J23G, 18N05E04J18V, 18N05E04J13L, 18N05E04J08W, 18N05E04J03W, 18N05E04J03R, 18N05E04J13S, 18N05E04N08N, 18N05E04N03Y, 18N05E04N03I, 18N05E04J13T, 18N05E04J13N, 18N05E04J08D, 18N05E04J03Y, 18N05E04J18Z, 18N05E04J13U, 18N05E04J19F, 18N05E04J14F, 18N05E04J14A, 18N05E04J09Q, 18N05E04N04R, 18N05E04J19W, 18N05E04J19R, 18N05E04J14B, 18N05E04J24H, 18N05E04J14X, 18N05E04J14M, 18N05E04J14C, 18N05E04J19Y, 18N05E04J19N, 18N05E04N09P, 18N05E04N04P, 18N05E04J19U, 18N05E04J14J, 18N05E04J09J, 18N05E04J09E, 18N05E04J04U, 18N05E04N05Q, 18N05E04N05A, 18N05E04J10Q, 18N05E04J10K, 18N05E04N05X, 18N05E04N05M, 18N05E04J25X, 18N05E04J25L, 18N05E04J15R, 18N05E04J10S, 18N05E04J10M, 18N05E04N10T, 18N05E04J20Y, 18N05E04J20N, 18N05E04J15I, 18N05E04N10E, 18N05E04N05Z, 18N05E04J20Z, 18N05E04J15E, 18N05E04J10Z, 18N05E04J10U'],
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

                ////Correo(1, Area, areaFiltrado);

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

                Band = 80;


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
                var Text = FechaReapertura[i].substring(116, 135);
                if (Text == "CELL_REOPENING_DATE") {
                    console.log("Lo encontre");
                    Reapertura = 1;
                    contreapertura++;
                    if (contreapertura < 2) {
                        //Correo(3, IdArea, Celda);
                    }


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
             { tipo: "Ingeniero de Minas", nombres: ["kelys yurany zuluaga alvarez (70700)"] },
            // { tipo: "Geólogo", nombres: ["Oscar Javier Pinilla Reyes (73619)"] },
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
            // { tipo: "Contador", nombres: ["PABLO ESTEBAN MONTOYA MONTOYA (91124)"] },
            { tipo: "Contador", nombres: ["NILSON FABER VALDERRAMA SUAREZ (79731)"] },
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
            document.getElementById('activoCorrienteId0').value = '3419636415';

            angular.element(document.getElementById('activoCorrienteId0')).triggerHandler('change');

            // document.getElementById('currentLiabilitiesId0').value = '15184416062' // OLD
            document.getElementById('pasivoCorrienteId0').value = '77678552';

            angular.element(document.getElementById('pasivoCorrienteId0')).triggerHandler('change');

            // document.getElementById('totalAssetId0').value = '48322540755' // OLD
            document.getElementById('activoTotalId0').value = '3565989574';

            angular.element(document.getElementById('activoTotalId0')).triggerHandler('change');

            // document.getElementById('totalLiabilitiesId0').value = '15401226207' // OLD
            document.getElementById('pasivoTotalId0').value = '1501296112';

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
            if(IdArea == '509897'){
                 ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509897.pdf`;
            } 
            else{
                 ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509897.pdf`;

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
        
        //CORREO RADICACION
        Correo(2, IdArea, Celda);
        clearTimeout(Radisegundo);
        await page.waitForTimeout(180000);
        Mineria(browser,  Pin);







    })();
}


// FUNCIÓN PARA ENVÍO DE CORREO SEGÚN LA SITUACIÓN
function Correo(Tipo, Area, Celda) {
 
}

// FUNCIÓN PARA LA CAPTURA DE PANTALLA AL MOMENTO DE LA RADICACIÓN
async function CapturaPantalla(page) {
 
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
