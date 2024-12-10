const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require('console');
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
    'HPRED241':"FERCHO ingeniero en sistemas best"
}


const EquipoActual = EquiposGenerales[NombreEquipo];
// Actualizado
var Empresa = 'Collective';
var user1 = '76966';
var pass1 = 'CollectiveM_2024**';
var user2 = '83949';
var pass2 = '*Jcrmh2022#';
var Agente = 0;
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
        if (Pines.substring(i + 1, i + 4) == 'Co:') {
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
        let EnviarCorreosParaPestanas = 0;
        while (Band != 99) {

            const Pestanas = await browser.pages();
            console.log(`HAY ${Pestanas.length} PESTAÑAS ABIERTAS`);
            if (Pestanas.length >= 4) {
                EnviarCorreosParaPestanas++;
                if (EnviarCorreosParaPestanas <= 2) {
                    // Se realiza envío de correo para alertar
                    Correo(5, '', '');
                }
            }

            // VerificarVencimientoPin(selectedText, input);
            VerificarVencimientoPin(closestDateOption, input);

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
                    "Area14",
                    1,
                    "18N05A25G21R",
                    ['18N05A25G21R, 18N05A25G16L, 18N05A25G21S, 18N05A25G21T, 18N05A25G21J, 18N05A25G16U, 18N05A25G22Q, 18N05A25G22A, 18N05A25G17W, 18N05A25G17S, 18N05A25G22T, 18N05A25G23F, 18N05A25G23A, 18N05A25G16P, 18N05A25G22K, 18N05A25G17V, 18N05A25G22H, 18N05A25G22C, 18N05A25G17H, 18N05A25G17Y, 18N05A25G22J, 18N05A25G22E, 18N05A25G17Z, 18N05A25G17P, 18N05A25G16X, 18N05A25G16M, 18N05A25G16Y, 18N05A25G22F, 18N05A25G22N, 18N05A25G22P, 18N05A25G23K, 18N05A25G21L, 18N05A25G16W, 18N05A25G21C, 18N05A25G16S, 18N05A25G21I, 18N05A25G16T, 18N05A25G16I, 18N05A25G21U, 18N05A25G21E, 18N05A25G17X, 18N05A25G17G, 18N05A25G17T, 18N05A25G17U, 18N05A25G18V, 18N05A25G18Q, 18N05A25G21M, 18N05A25G21P, 18N05A25G16J, 18N05A25G17K, 18N05A25G17J, 18N05A25G21H, 18N05A25G16N, 18N05A25G22R, 18N05A25G22S, 18N05A25G22B, 18N05A25G17N, 18N05A25G18K, 18N05A25G21N, 18N05A25G21D, 18N05A25G16Z, 18N05A25G17F, 18N05A25G17R, 18N05A25G17M, 18N05A25G22I, 18N05A25G22D, 18N05A25G22U, 18N05A25G18F, 18N05A25G21G, 18N05A25G21B, 18N05A25G16H, 18N05A25G17Q, 18N05A25G22L, 18N05A25G22M, 18N05A25G22G, 18N05A25G17L, 18N05A25G17I, 18N05A25G23Q'],
                    77
                );
            }
            else if (Band == 2) {
                MonitorearAreas(
                    "Area18",
                    1,
                    "18N05E04D06M",
                    ["18N05E04D06M"],
                    0
                );
            }

            else if (Band == 3) {
                MonitorearAreas(
                    "505810_OG2_1",
                    1,
                    "18N05A24L21M",
                    ['18N05A24L21M, 18N05A24L21E, 18N05A24L22J, 18N05A24Q03K, 18N05A24L21S, 18N05A24L21U, 18N05A24L22C, 18N05A24L17S, 18N05A24L22Q, 18N05A24L22B, 18N05A24L17T, 18N05A24Q03V, 18N05A24Q03Q, 18N05A24L23A, 18N05A24L21I, 18N05A24L22R, 18N05A24L22L, 18N05A24L17Y, 18N05A24L17Z, 18N05A24L23F, 18N05A24L21N, 18N05A24L22K, 18N05A24L22A, 18N05A24L22S, 18N05A24L22H, 18N05A24L17X, 18N05A24Q03A, 18N05A24L23V, 18N05A24L23Q, 18N05A24L21R, 18N05A24L21L, 18N05A24L21T, 18N05A24L21J, 18N05A24L22G, 18N05A24L22M, 18N05A24L22T, 18N05A24L22N, 18N05A24L22P, 18N05A24L22E, 18N05A24L23K, 18N05A24L18V, 18N05A24L21Q, 18N05A24L21P, 18N05A24L22I, 18N05A24Q08F, 18N05A24L22F, 18N05A24L17W, 18N05A24L22D, 18N05A24L22U, 18N05A24Q08A, 18N05A24Q03F'],
                    50
                )
            }
            else if (Band == 4) {
                MonitorearAreas(
                    "OG2_Area_10",//Nombre del area
                    0, // aviso
                    "18N05A24L21Q", // ceda de correo
                    ['18N05A24L17S, 18N05A24L17T, 18N05A24L17W, 18N05A24L17X, 18N05A24L17Y, 18N05A24L17Z, 18N05A24L18V, 18N05A24L18W, 18N05A24L18X, 18N05A24L18Y, 18N05A24L18Z, 18N05A24L19V, 18N05A24L19W, 18N05A24L19X, 18N05A24L19Y, 18N05A24L19Z, 18N05A24L20V, 18N05A24L20W, 18N05A24L20X, 18N05A24L20Y, 18N05A24L20Z, 18N05A24L21E, 18N05A24L21I, 18N05A24L21J, 18N05A24L21L, 18N05A24L21M, 18N05A24L21N, 18N05A24L21P, 18N05A24L21Q, 18N05A24L21R, 18N05A24L21S, 18N05A24L21T, 18N05A24L21U, 18N05A24L22A, 18N05A24L22B, 18N05A24L22C, 18N05A24L22D, 18N05A24L22E, 18N05A24L22F, 18N05A24L22G, 18N05A24L22H, 18N05A24L22I, 18N05A24L22J, 18N05A24L22K, 18N05A24L22L, 18N05A24L22M, 18N05A24L22N, 18N05A24L22P, 18N05A24L22Q, 18N05A24L22R, 18N05A24L22S, 18N05A24L22T, 18N05A24L22U, 18N05A24L23A, 18N05A24L23B, 18N05A24L23C, 18N05A24L23D, 18N05A24L23E, 18N05A24L23F, 18N05A24L23G, 18N05A24L23H, 18N05A24L23I, 18N05A24L23J, 18N05A24L23K, 18N05A24L23L, 18N05A24L23M, 18N05A24L23N, 18N05A24L23P, 18N05A24L23Q, 18N05A24L23R, 18N05A24L23S, 18N05A24L23T, 18N05A24L23U, 18N05A24L23V, 18N05A24L23W, 18N05A24L23X, 18N05A24L23Y, 18N05A24L23Z, 18N05A24L24A, 18N05A24L24B, 18N05A24L24C, 18N05A24L24D, 18N05A24L24E, 18N05A24L24F, 18N05A24L24G, 18N05A24L24H, 18N05A24L24I, 18N05A24L24J, 18N05A24L24K, 18N05A24L24L, 18N05A24L24M, 18N05A24L24N, 18N05A24L24P, 18N05A24L24Q, 18N05A24L24R, 18N05A24L24S, 18N05A24L24T, 18N05A24L24U, 18N05A24L24V, 18N05A24L24W, 18N05A24L24X, 18N05A24L24Y, 18N05A24L25A, 18N05A24L25B, 18N05A24L25C, 18N05A24L25D, 18N05A24L25E, 18N05A24L25F, 18N05A24L25G, 18N05A24L25H, 18N05A24L25I, 18N05A24L25J, 18N05A24L25K, 18N05A24L25L, 18N05A24L25M, 18N05A24L25N, 18N05A24L25P, 18N05A24L25Q, 18N05A24L25R, 18N05A24L25S, 18N05A24L25T, 18N05A24L25U, 18N05A24Q03A, 18N05A24Q03B, 18N05A24Q03C, 18N05A24Q03D, 18N05A24Q03E, 18N05A24Q03F, 18N05A24Q03G, 18N05A24Q03H, 18N05A24Q03I, 18N05A24Q03J, 18N05A24Q03K, 18N05A24Q03L, 18N05A24Q03M, 18N05A24Q03N, 18N05A24Q03P, 18N05A24Q03Q, 18N05A24Q03R, 18N05A24Q03S, 18N05A24Q03T, 18N05A24Q03U, 18N05A24Q03V, 18N05A24Q03W, 18N05A24Q03X, 18N05A24Q03Y, 18N05A24Q03Z, 18N05A24Q04A, 18N05A24Q04B, 18N05A24Q04C, 18N05A24Q04D, 18N05A24Q04E, 18N05A24Q04F, 18N05A24Q04G, 18N05A24Q04H, 18N05A24Q04J, 18N05A24Q04K, 18N05A24Q04L, 18N05A24Q04P, 18N05A24Q04Q, 18N05A24Q04R, 18N05A24Q04V, 18N05A24Q05F, 18N05A24Q05K, 18N05A24Q05L, 18N05A24Q05Q, 18N05A24Q05R, 18N05A24Q05S, 18N05A24Q05V, 18N05A24Q05W, 18N05A24Q05X, 18N05A24Q05Y, 18N05A24Q08A, 18N05A24Q08B, 18N05A24Q08C, 18N05A24Q08D, 18N05A24Q08E, 18N05A24Q08F, 18N05A24Q08G, 18N05A24Q08H, 18N05A24Q08I, 18N05A24Q08J, 18N05A24Q09A, 18N05A24Q10B, 18N05A24Q10C, 18N05A24Q10D, 18N05A24Q10E, 18N05A24Q10H, 18N05A24Q10I, 18N05A24Q10J, 18N05A24Q10P, 18N05A25I16V, 18N05A25I16W, 18N05A25I16X, 18N05A25I16Y, 18N05A25I16Z, 18N05A25I17V, 18N05A25I17W, 18N05A25I17X, 18N05A25I17Y, 18N05A25I17Z, 18N05A25I18V, 18N05A25I21A, 18N05A25I21B, 18N05A25I21C, 18N05A25I21D, 18N05A25I21E, 18N05A25I21F, 18N05A25I21G, 18N05A25I21H, 18N05A25I21I, 18N05A25I21J, 18N05A25I21K, 18N05A25I21L, 18N05A25I21M, 18N05A25I21N, 18N05A25I21P, 18N05A25I21Q, 18N05A25I21R, 18N05A25I21S, 18N05A25I21T, 18N05A25I21U, 18N05A25I22A, 18N05A25I22B, 18N05A25I22C, 18N05A25I22D, 18N05A25I22E, 18N05A25I22F, 18N05A25I22G, 18N05A25I22H, 18N05A25I22I, 18N05A25I22J, 18N05A25I22K, 18N05A25I22L, 18N05A25I22M, 18N05A25I22N, 18N05A25I22P, 18N05A25I22Q, 18N05A25I22R, 18N05A25I22S, 18N05A25I22T, 18N05A25I22U, 18N05A25I23A, 18N05A25I23F, 18N05A25I23K, 18N05A25I23Q, 18N05A25M06A, 18N05A25M06B, 18N05A25M06F, 18N05A25M06G, 18N05A25M06H, 18N05A25M06K, 18N05A25M06L, 18N05A25M06M, 18N05A25M06N, 18N05A25M06P, 18N05A25M07G, 18N05A25M07H, 18N05A25M07I, 18N05A25M07K, 18N05A25M07L, 18N05A25M07M, 18N05A25M07N, 18N05A25M07P, 18N05A25M08K, 18N05A25M08L, 18N05A25M08M, 18N05A25M08N, 18N05A25M08P, 18N05A25M09K, 18N05A25M09L, 18N05A25M09M, 18N05A25M09N'],
                    260 // comas
                )

            }

            else if (Band == 5) {
                MonitorearAreas(
                    "HI8_15231_P2", // Nombre del area (IdArea)
                    0, // aviso (Aviso)
                    "18N05E05A01S", // celda de correo (Celda)
                    ['18N05E05A01S, 18N05E05A02T, 18N05E05A02U, 18N05A25M16V, 18N05E05A01R, 18N05E05A02Q, 18N05E05A02R, 18N05A25M21F, 18N05A25M21A, 18N05E05A01T, 18N05E05A01F, 18N05E05A01A, 18N05A25M16W, 18N05E05A02S, 18N05E05A03Q, 18N05E05A01K, 18N05A25M21V, 18N05E05A01Q, 18N05A25M21Q, 18N05A25M21K, 18N05A25M16X, 18N05A25M16Y, 18N05E05A01U'], // Celdas de area (AreaNueva)
                    22 // comas (Comas)
                );
            }
            else if (Band == 6) {
                MonitorearAreas(
                    "LH0071_17_P1",//Nombre del area
                    1, // aviso
                    "18N05E04D11A", // ceda de correo
                    ['18N05E04D11A, 18N05E04D11F, 18N05E04D11K, 18N05E04D11Q, 18N05E04D11V, 18N05E04D16A, 18N05E04D16F, 18N05E04D16K, 18N05E04D16Q, 18N05E04D16V, 18N05E04D21A, 18N05E04D21F, 18N05E04D21K, 18N05E04D21G, 18N05E04D21H, 18N05E04D21C, 18N05E04D21D, 18N05E04D16X, 18N05E04D16Z, 18N05E04D16Y, 18N05E04D17V, 18N05E04D17Q, 18N05E04D17W, 18N05E04D17R, 18N05E04D17X, 18N05E04D17S, 18N05E04D17Y, 18N05E04D17T, 18N05E04D17M, 18N05E04D17N, 18N05E04D17P, 18N05E04D17U, 18N05E04D18Q, 18N05E04D18K, 18N05E04D18L, 18N05E04D18F, 18N05E04D17J, 18N05E04D18G, 18N05E04D18A, 18N05E04D18B, 18N05E04D18H, 18N05E04D18I, 18N05E04D18C, 18N05E04D13X, 18N05E04D18D, 18N05E04D13Y, 18N05E04D18E, 18N05E04D13Z, 18N05E04D13U, 18N05E04D14Q, 18N05E04D14V, 18N05E04D19A, 18N05E04D14W, 18N05E04D14L, 18N05E04D14X, 18N05E04D14S, 18N05E04D14M, 18N05E04D14G, 18N05E04D14H, 18N05E04D14C, 18N05E04D14B, 18N05E04D09W, 18N05E04D09X, 18N05E04D09Y, 18N05E04D09R, 18N05E04D09T, 18N05E04D09L, 18N05E04D09N, 18N05E04D09G, 18N05E04D09I, 18N05E04D09B, 18N05E04D09C, 18N05E04D09J, 18N05E04D10F, 18N05E04D10G, 18N05E04D10H, 18N05E04D10I, 18N05E04D10J, 18N05E05A06F, 18N05E04D09D, 18N05E04D04Y, 18N05E04D04T, 18N05E04D04N, 18N05E04D04I, 18N05E04D04H, 18N05E04D04G, 18N05E04D04F, 18N05E04D03J, 18N05E04D03I, 18N05E04D03N, 18N05E04D03M, 18N05E04D03S, 18N05E04D03R, 18N05E04D03Q, 18N05E04D03V, 18N05E04D02Z, 18N05E04D02Y, 18N05E04D07D, 18N05E04D07C, 18N05E04D07H, 18N05E04D07G, 18N05E04D07F, 18N05E04D07K, 18N05E04D06P, 18N05E04D06N, 18N05E04D06T, 18N05E04D06S, 18N05E04D06X, 18N05E04D06W, 18N05E04D06V'], // Celdas de area
                    109  // comas
                )
            }
            else if (Band == 7) {
                MonitorearAreas(
                    "Area13",//Nombre del area
                    1, // aviso
                    "18N05A24K01G", // ceda de correo
                    ['18N05A24K01G, 18N05A24G21R, 18N05A24K01S, 18N05A24K01J, 18N05A24G21U, 18N05A24G22Q, 18N05A24G22Y, 18N05A24G22S, 18N05A24K02Z, 18N05A24K03F, 18N05A24K01L, 18N05A24G21W, 18N05A24K01T, 18N05A24G21Z, 18N05A24K02F, 18N05A24K02G, 18N05A24G22W, 18N05A24K02T, 18N05A24K02P, 18N05A24K02J, 18N05A24G22Z, 18N05A24K03Q, 18N05A24K03A, 18N05A24K01X, 18N05A24G21S, 18N05A24K01Z, 18N05A24K01P, 18N05A24K02V, 18N05A24K02W, 18N05A24K02B, 18N05A24K02C, 18N05A24K01H, 18N05A24K01Y, 18N05A24K01N, 18N05A24G21Y, 18N05A24G21T, 18N05A24K01U, 18N05A24K02K, 18N05A24G22V, 18N05A24G22R, 18N05A24K02Y, 18N05A24K02S, 18N05A24K02N, 18N05A24K02H, 18N05A24G22X, 18N05A24G22T, 18N05A24G21L, 18N05A24K01C, 18N05A24G21N, 18N05A24K02Q, 18N05A24K02R, 18N05A24K02L, 18N05A24K02M, 18N05A24K03V, 18N05A24G23V, 18N05A24K01B, 18N05A24K01D, 18N05A24K02A, 18N05A24K02I, 18N05A24K02U, 18N05A24G22U, 18N05A24G23Q, 18N05A24G21X, 18N05A24G21M, 18N05A24K02D, 18N05A24K03K, 18N05A24K01R, 18N05A24K01M, 18N05A24K01I, 18N05A24K01E, 18N05A24K02X, 18N05A24K02E'], // Celdas de area
                    72 // comas
                )
            }

            else if (Band == 8) {
                MonitorearAreas(
                    "500946",//Nombre del area
                    1, // aviso
                    "18N05E04L17N", // ceda de correo
                    ['18N05E04L17N, 18N05E04L17D, 18N05E04L07N, 18N05E04Q07J, 18N05E04Q07E, 18N05E04L17U, 18N05E04L12U, 18N05E04L12E, 18N05E04L07P, 18N05E04Q08F, 18N05E04L18Q, 18N05E04Q03G, 18N05E04L23L, 18N05E04L18R, 18N05E04L13W, 18N05E04L08S, 18N05E04Q03Y, 18N05E04L18Z, 18N05E04L13J, 18N05E04Q04K, 18N05E04L24V, 18N05E04L19R, 18N05E04L09V, 18N05E04L09Q, 18N05E04Q04H, 18N05E04L24H, 18N05E04L19C, 18N05E04L14M, 18N05E04L19N, 18N05E04L14Y, 18N05E04L14D, 18N05E04Q04Z, 18N05E04Q04P, 18N05E04L24Z, 18N05E04L24U, 18N05E04L24P, 18N05E04L14U, 18N05E04Q05W, 18N05E04L20L, 18N05E04L10R, 18N05E04Q02Y, 18N05E04L22I, 18N05E04L17I, 18N05E04L07T, 18N05E04L22Z, 18N05E04L17E, 18N05E04L12P, 18N05E04Q03V, 18N05E04Q03K, 18N05E04L13K, 18N05E04L13F, 18N05E04L08K, 18N05E04L23B, 18N05E04L18G, 18N05E04L18B, 18N05E04L13G, 18N05E04Q08C, 18N05E04Q03C, 18N05E04L23T, 18N05E04L13Y, 18N05E04Q03E, 18N05E04L23Z, 18N05E04Q09G, 18N05E04Q04Q, 18N05E04L24K, 18N05E04L09F, 18N05E04Q04X, 18N05E04L24M, 18N05E04L14H, 18N05E04Q09D, 18N05E04L24Y, 18N05E04L14P, 18N05E04L09Z, 18N05E04Q10A, 18N05E04L20K, 18N05E04L15Q, 18N05E04Q05B, 18N05E04L25W, 18N05E04L25B, 18N05E04L20R, 18N05E04L10W, 18N05E04L10L, 18N05E04Q07I, 18N05E04Q02N, 18N05E04L07I, 18N05E04Q02U, 18N05E04Q02J, 18N05E04Q02E, 18N05E04L22J, 18N05E04L12J, 18N05E04L23Q, 18N05E04L18K, 18N05E04Q03L, 18N05E04Q03B, 18N05E04L23G, 18N05E04L08L, 18N05E04Q03S, 18N05E04Q03M, 18N05E04L18M, 18N05E04L18H, 18N05E04L18C, 18N05E04L13C, 18N05E04L08X, 18N05E04L23Y, 18N05E04L23D, 18N05E04L18T, 18N05E04L08Y, 18N05E04L08T, 18N05E04L08N, 18N05E04Q03J, 18N05E04L18J, 18N05E04L08Z, 18N05E04Q04F, 18N05E04Q04B, 18N05E04L24R, 18N05E04L24G, 18N05E04L19W, 18N05E04L19Q, 18N05E04L19L, 18N05E04L14R, 18N05E04L14G, 18N05E04L09G, 18N05E04Q04S, 18N05E04Q04M, 18N05E04Q04C, 18N05E04L24X, 18N05E04L19S, 18N05E04L09S, 18N05E04L24N, 18N05E04L19Y, 18N05E04L14T, 18N05E04L09I, 18N05E04Q09J, 18N05E04L24E, 18N05E04L19U, 18N05E04L19P, 18N05E04L19E, 18N05E04L25V, 18N05E04L25Q, 18N05E04L25A, 18N05E04L15A, 18N05E04L20G, 18N05E04L15R, 18N05E04L22Y, 18N05E04L22T, 18N05E04L12T, 18N05E04L07Y, 18N05E04Q02P, 18N05E04L17Z, 18N05E04Q08A, 18N05E04Q03Q, 18N05E04Q03F, 18N05E04L18V, 18N05E04L18F, 18N05E04L08V, 18N05E04Q08G, 18N05E04Q03W, 18N05E04L23R, 18N05E04Q08H, 18N05E04L23M, 18N05E04L13M, 18N05E04Q08I, 18N05E04Q08D, 18N05E04Q03T, 18N05E04Q08E, 18N05E04Q03Z, 18N05E04L08J, 18N05E04Q09A, 18N05E04Q09B, 18N05E04Q04W, 18N05E04Q04R, 18N05E04Q04L, 18N05E04L24B, 18N05E04L19V, 18N05E04L19G, 18N05E04L19A, 18N05E04L19B, 18N05E04L14W, 18N05E04L09W, 18N05E04L09R, 18N05E04Q09C, 18N05E04L14S, 18N05E04Q04N, 18N05E04L24I, 18N05E04L09Y, 18N05E04L09N, 18N05E04Q04J, 18N05E04L24J, 18N05E04L14J, 18N05E04L09U, 18N05E04Q10F, 18N05E04L25K, 18N05E04L15F, 18N05E04Q10B, 18N05E04Q05G, 18N05E04L25R, 18N05E04Q07D, 18N05E04Q02T, 18N05E04Q02I, 18N05E04L17T, 18N05E04L12N, 18N05E04L12I, 18N05E04L07U, 18N05E04L23A, 18N05E04L18A, 18N05E04L13V, 18N05E04L08Q, 18N05E04L08F, 18N05E04L13R, 18N05E04L13L, 18N05E04L08R, 18N05E04L08G, 18N05E04Q03X, 18N05E04L08H, 18N05E04Q03N, 18N05E04Q03D, 18N05E04L23N, 18N05E04L18N, 18N05E04L18D, 18N05E04L13D, 18N05E04L13P, 18N05E04Q04V, 18N05E04L24Q, 18N05E04L24F, 18N05E04L14V, 18N05E04L19X, 18N05E04L19M, 18N05E04Q09I, 18N05E04L24D, 18N05E04L14I, 18N05E04Q04E, 18N05E04L19Z, 18N05E04L14E, 18N05E04Q05V, 18N05E04Q05Q, 18N05E04L25F, 18N05E04L20V, 18N05E04L20Q, 18N05E04Q10G, 18N05E04Q05R, 18N05E04L25G, 18N05E04L20W, 18N05E04L15B, 18N05E04L17Y, 18N05E04L12Y, 18N05E04L12D, 18N05E04L12Z, 18N05E04L07Z, 18N05E04Q03A, 18N05E04L23V, 18N05E04L13Q, 18N05E04Q03R, 18N05E04L18W, 18N05E04L13B, 18N05E04L18S, 18N05E04Q03I, 18N05E04L23I, 18N05E04L18I, 18N05E04L13I, 18N05E04Q03U, 18N05E04Q03P, 18N05E04L23E, 18N05E04L18E, 18N05E04L08U, 18N05E04Q04A, 18N05E04L24L, 18N05E04L24A, 18N05E04L14Q, 18N05E04L14K, 18N05E04L14L, 18N05E04L14F, 18N05E04L14A, 18N05E04L09K, 18N05E04Q09H, 18N05E04L24C, 18N05E04L09X, 18N05E04Q04Y, 18N05E04L24T, 18N05E04L09T, 18N05E04L19J, 18N05E04L09J, 18N05E04Q05K, 18N05E04Q05A, 18N05E04L15K, 18N05E04L10V, 18N05E04L10Q, 18N05E04L10F, 18N05E04L25L, 18N05E04L15W, 18N05E04Q02D, 18N05E04L22D, 18N05E04Q02Z, 18N05E04L17P, 18N05E04L07J, 18N05E04L23K, 18N05E04Q03H, 18N05E04L23C, 18N05E04L13X, 18N05E04L13S, 18N05E04L13H, 18N05E04L08M, 18N05E04L18Y, 18N05E04L13T, 18N05E04L13N, 18N05E04L08I, 18N05E04Q08J, 18N05E04L23U, 18N05E04L23P, 18N05E04L18U, 18N05E04L18P, 18N05E04L13Z, 18N05E04L13U, 18N05E04L13E, 18N05E04L08P, 18N05E04L24W, 18N05E04L19F, 18N05E04L24S, 18N05E04L19H, 18N05E04L14X, 18N05E04L09H, 18N05E04Q04T, 18N05E04Q04D, 18N05E04Q09E, 18N05E04L09P, 18N05E04Q05F, 18N05E04L20F, 18N05E04Q05L, 18N05E04L22N, 18N05E04L22U, 18N05E04L22P, 18N05E04L22E, 18N05E04L17J, 18N05E04L23F, 18N05E04L13A, 18N05E04Q08B, 18N05E04L23W, 18N05E04L18L, 18N05E04L08W, 18N05E04L23X, 18N05E04L23S, 18N05E04L23H, 18N05E04L18X, 18N05E04L23J, 18N05E04Q09F, 18N05E04Q04G, 18N05E04L19K, 18N05E04L14B, 18N05E04L09L, 18N05E04L14C, 18N05E04L09M, 18N05E04Q04I, 18N05E04L19T, 18N05E04L19I, 18N05E04L19D, 18N05E04L14N, 18N05E04Q04U, 18N05E04L14Z, 18N05E04L20A, 18N05E04L15V, 18N05E04L10K, 18N05E04L20B, 18N05E04L15L, 18N05E04L15G, 18N05E04L10G '], // Celdas de area
                    260 // comas
                )
            }

            else if (Band == 9) {
                MonitorearAreas(
                    "505811_OG2_2",//Nombre del area
                    1, // aviso
                    "18N05A24Q08G", // ceda de correo
                    ['18N05A24Q08G, 18N05A24Q04K, 18N05A24Q04F, 18N05A24Q04A, 18N05A24L24K, 18N05A24L24G, 18N05A24L24C, 18N05A24L24N, 18N05A24Q05F, 18N05A24L25A, 18N05A24Q05W, 18N05A24Q05L, 18N05A24L25C, 18N05A24L25P, 18N05A25M06F, 18N05A25I21Q, 18N05A25M06L, 18N05A25I21R, 18N05A25I21L, 18N05A25I21B, 18N05A25I22K, 18N05A25I22L, 18N05A25I17X, 18N05A25I22U, 18N05A25I23K, 18N05A24L23R, 18N05A24L23L, 18N05A24Q08I, 18N05A24Q09A, 18N05A24L19V, 18N05A24Q04H, 18N05A24Q04C, 18N05A24L24T, 18N05A24L24D, 18N05A24L24E, 18N05A24L25R, 18N05A24L25N, 18N05A24L25E, 18N05A24L20Z, 18N05A25I21F, 18N05A25I21A, 18N05A25M06G, 18N05A25M06H, 18N05A25I21M, 18N05A25I21G, 18N05A25I21I, 18N05A25I21D, 18N05A25I21P, 18N05A25I22B, 18N05A25M07M, 18N05A25I17Y, 18N05A25I22J,' +
                        ' 18N05A25I23F, 18N05A25I18V, 18N05A25M08M, 18N05A24L18W, 18N05A24Q08H, 18N05A24L23C, 18N05A24Q08D, 18N05A24Q03I, 18N05A24Q08E, 18N05A24Q03Z, 18N05A24L23J, 18N05A24Q04B, 18N05A24L24V, 18N05A24L24L, 18N05A24L24Y, 18N05A24Q04J, 18N05A24L19Z, 18N05A24L20W, 18N05A24Q10E, 18N05A25M06M, 18N05A25M06B, 18N05A25I21H, 18N05A25I16W, 18N05A25I16X, 18N05A25I16Z, 18N05A25M07L, 18N05A25I17W, 18N05A24Q08C, 18N05A24Q03S, 18N05A24Q03T, 18N05A24L23Y, 18N05A24Q08J, 18N05A24L23U, 18N05A24L18Z, 18N05A24Q04Q, 18N05A24L24F, 18N05A24L24A, 18N05A24L24B, 18N05A24Q04D, 18N05A24Q04E, 18N05A24L25L, 18N05A24L25G, 18N05A24Q10H, 18N05A24L25S, 18N05A24L20Y, 18N05A24L25U, 18N05A25I21K, 18N05A25I21C, 18N05A25I21T, 18N05A25I22R, 18N05A25M07H, 18N05A25I22T, 18N05A25I22I, 18N05A25M07P, 18N05A25M08L, 18N05A25M08N, 18N05A25M09M, 18N05A24L23W, 18N05A24Q03C, 18N05A24L23H, 18N05A24L18X, 18N05A24Q03Y, 18N05A24L23I, 18N05A24L23D, 18N05A24L18Y, 18N05A24Q03U, 18N05A24Q03P, 18N05A24L23Z, 18N05A24L24Q, 18N05A24L24R, 18N05A24L24J, 18N05A24Q05Q, 18N05A24Q05X, 18N05A24L20X, 18N05A24Q10P, 18N05A24L25J, 18N05A25M06N, 18N05A25I16Y, 18N05A25I21E, 18N05A25I22G, 18N05A25I22S, 18N05A25I22C, 18N05A25M07N, 18N05A25I22D, 18N05A25I17Z, 18N05A25M08K, 18N05A25M09N, 18N05A24Q08B, 18N05A24Q03W, 18N05A24Q03L, 18N05A24Q03G, 18N05A24L23B, 18N05A24L23P, 18N05A24Q04V, 18N05A24Q04R, 18N05A24L19W, 18N05A24L24X, 18N05A24L19Y, 18N05A24Q04P, 18N05A24L24P, 18N05A24Q05V, 18N05A24Q10B, 18N05A24L25B, 18N05A24Q10I, 18N05A24Q10D, 18N05A24L25T, 18N05A25M06K, 18N05A25M07K, 18N05A25I22A, 18N05A25M07G, 18N05A25I22E, 18N05A25I23Q, 18N05A25M09K, 18N05A24Q03R, 18N05A24Q03X, 18N05A24Q03H, 18N05A24L23M, 18N05A24L23T, 18N05A24Q03J, 18N05A24Q04L, 18N05A24L24I, 18N05A24L24U, 18N05A24Q05K, 18N05A24L25Q, 18N05A24L25F, 18N05A24L20V, 18N05A24Q05S, 18N05A24L25M, 18N05A24L25H, 18N05A25M06A, 18N05A25I16V, 18N05A25I21S, 18N05A25M06P, 18N05A25I21U, 18N05A25I21J, 18N05A25I22M, 18N05A25I22H, 18N05A25M07I, 18N05A25I22N, 18N05A25I23A, 18N05A24Q03B, 18N05A24L23G, 18N05A24Q03M, 18N05A24L23X, 18N05A24L23S, 18N05A24Q03N, 18N05A24Q03D, 18N05A24L23N, 18N05A24Q03E, 18N05A24L23E, 18N05A24Q04G, 18N05A24L24W, 18N05A24L24S, 18N05A24L24M, 18N05A24L24H, 18N05A24L19X, 18N05A24L25K, 18N05A24Q05R, 18N05A24Q10C, 18N05A24Q05Y, 18N05A24L25I, 18N05A24L25D, 18N05A24Q10J, 18N05A25I21N, 18N05A25I22Q, 18N05A25I22F, 18N05A25I17V, 18N05A25I22P, 18N05A25M08P, 18N05A25M09L'], // Celdas de area
                    221 // comas
                )
            }
            else if (Band == 10) {
                MonitorearAreas(
                    "007-85M",//Nombre del area
                    1, // aviso
                    "18N05E04D09P", // ceda de correo
                    ['18N05E04D09P, 18N05E04D10L, 18N05E04D10M, 18N05E04D10T, 18N05E04D10Z, 18N05E04D10U, 18N05E04D10K, 18N05E04D15D, 18N05E04D10N, 18N05E04D15E, 18N05E04D10Y, 18N05E04D10P'], // Celdas de area
                    11 // comas
                )
            }
            else if (Band == 11) {
                MonitorearAreas(
                    "HI8-15231-P1",//Nombre del area
                    1, // aviso
                    "18N05A25M06S", // ceda de correo
                    [' 18N05A25M06S, 18N05A25M06T, 18N05A25M06U, 18N05A25M06X, 18N05A25M06Y, 18N05A25M06Z, 18N05A25M11C, 18N05A25M11D, 18N05A25M11E, 18N05A25M11H, 18N05A25M11I'], // Celdas de area
                    10 // comas
                )
            }
            else if (Band == 12) {
                MonitorearAreas(
                    "HI8-15231-P3",//Nombre del area
                    1, // aviso
                    "18N05E04G11P", // ceda de correo
                    ['18N05E04G11P, 18N05E04G12P, 18N05E04G13P, 18N05E04H21A, 18N05E04H21C, 18N05E04H16S, 18N05E04H16M, 18N05E04H06S, 18N05E04H06C, 18N05E04H01S, 18N05E04G12M, 18N05E04G14M, 18N05E04G15L, 18N05E04H11Q, 18N05E04H11M, 18N05E04H06X, 18N05E04G12N, 18N05E04G13M, 18N05E04G14L, 18N05E04G15P, 18N05E04H21G, 18N05E04H21H, 18N05E04G14K, 18N05E04H16C, 18N05E04H11X, 18N05E04G12L, 18N05E04G13K, 18N05E04G15N, 18N05E04H16Q, 18N05E04H06H, 18N05E04G11N, 18N05E04H16V, 18N05E04H16A, 18N05E04H11C, 18N05E04H01H, 18N05E04G13L, 18N05E04G13N, 18N05E04G14N, 18N05E04G14P, 18N05E04G15K, 18N05E04G15M, 18N05E04H21F, 18N05E04H16K, 18N05E04H11V, 18N05E04H11S, 18N05E04H11H, 18N05E04G12K, 18N05E04H16F, 18N05E04H11K, 18N05E04H16X, 18N05E04H16H, 18N05E04H06M, 18N05E04H01X, 18N05E04H01M'], // Celdas de area
                    53 // comas
                )
            }
            else if (Band == 13) {
                MonitorearAreas(
                    "781-17-P1",//Nombre del area
                    1, // aviso
                    "18N05E04C15Q", // ceda de correo
                    ['18N05E04C15Q, 18N05E04C15R, 18N05E04C15S, 18N05E04C15T, 18N05E04C15N, 18N05E04C15I, 18N05E04C15D, 18N05E04C10Y, 18N05E04C10T, 18N05E04C10N, 18N05E04C10I, 18N05E04C10D, 18N05E04C05Y, 18N05E04C05T, 18N05E04C05N, 18N05E04C05I, 18N05E04C05H, 18N05E04C05G, 18N05E04C05F, 18N05E04C04J, 18N05E04C04I, 18N05E04C04H, 18N05E04C04G, 18N05E04C04F, 18N05E04C03J, 18N05E04C03I, 18N05E04C03H, 18N05E04C03G, 18N05E04C03L, 18N05E04C03R, 18N05E04C03W, 18N05E04C08B, 18N05E04C08G, 18N05E04C08L, 18N05E04C08R, 18N05E04C08W, 18N05E04C13B, 18N05E04C13G, 18N05E04C13L, 18N05E04C13M, 18N05E04C13N, 18N05E04C13P, 18N05E04C14K, 18N05E04C14L, 18N05E04C14M, 18N05E04C14N, 18N05E04C14P'], // Celdas de area
                    46 // comas
                )
            }
            else if (Band == 14) {
                MonitorearAreas(
                    "DLH-14451X",//Nombre del area
                    1, // aviso
                    "18N05A24Q24J", // ceda de correo
                    ['18N05A24Q24J, 18N05A24Q24D, 18N05A24Q19Y, 18N05A24Q25A, 18N05A24Q24E, 18N05A24Q19N, 18N05A24Q25G, 18N05A24Q25H, 18N05A24Q20X, 18N05A24Q19Z, 18N05A24Q20K, 18N05A24Q25B, 18N05A24Q20W, 18N05A24Q20L, 18N05A24Q25C, 18N05A24Q25I, 18N05A24Q25E, 18N05A24Q24I, 18N05A24Q19U, 18N05A24Q19P, 18N05A24Q25F, 18N05A24Q20V, 18N05A24Q20Q, 18N05A24Q20M, 18N05A24Q20R, 18N05A24Q25D, 18N05A24Q20S, 18N05A24Q19T, 18N05A24Q25J'], // Celdas de area
                    46 // comas
                )
            }
            else if (Band == 15) {
                MonitorearAreas(
                    "500946_1",//Nombre del area
                    1, // aviso
                    "18N05E04L17N", // ceda de correo
                    ['18N05E04L17N, 18N05E04L17D, 18N05E04L07N, 18N05E04L17U, 18N05E04L12U, 18N05E04L12E, 18N05E04L07P, 18N05E04L18Q, 18N05E04L18R, 18N05E04L13W, 18N05E04L08S, 18N05E04L13J, 18N05E04L19R, 18N05E04L09V, 18N05E04L09Q, 18N05E04L19C, 18N05E04L14M, 18N05E04L19N, 18N05E04L14Y, 18N05E04L14D, 18N05E04L14U, 18N05E04L20L, 18N05E04L10R, 18N05E04L17I, 18N05E04L07T, 18N05E04L17E, 18N05E04L12P, 18N05E04L13K, 18N05E04L13F, 18N05E04L08K, 18N05E04L18G, 18N05E04L18B, 18N05E04L13G, 18N05E04L13Y, 18N05E04L09F, 18N05E04L14H, 18N05E04L14P, 18N05E04L09Z, 18N05E04L20K, 18N05E04L15Q, 18N05E04L20R, 18N05E04L10W, 18N05E04L10L, 18N05E04L07I, 18N05E04L12J, 18N05E04L18K, 18N05E04L08L, 18N05E04L18M, 18N05E04L18H, 18N05E04L18C, 18N05E04L13C, 18N05E04L08X, 18N05E04L18T, 18N05E04L08Y, 18N05E04L08T, 18N05E04L08N, 18N05E04L18J, 18N05E04L08Z, 18N05E04L19Q, 18N05E04L19L, 18N05E04L14R, 18N05E04L14G, 18N05E04L09G, 18N05E04L19S, 18N05E04L09S, 18N05E04L14T, 18N05E04L09I, 18N05E04L19U, 18N05E04L19P, 18N05E04L19E, 18N05E04L15A, 18N05E04L20G, 18N05E04L15R, 18N05E04L12T, 18N05E04L07Y, 18N05E04L18F, 18N05E04L08V, 18N05E04L13M, 18N05E04L08J, 18N05E04L19G, 18N05E04L19A, 18N05E04L19B, 18N05E04L14W, 18N05E04L09W, 18N05E04L09R, 18N05E04L14S, 18N05E04L09Y, 18N05E04L09N, 18N05E04L14J, 18N05E04L09U, 18N05E04L15F, 18N05E04L17T, 18N05E04L12N, 18N05E04L12I, 18N05E04L07U, 18N05E04L18A, 18N05E04L13V,' +
                        ' 18N05E04L08Q, 18N05E04L08F, 18N05E04L13R, 18N05E04L13L, 18N05E04L08R, 18N05E04L08G, 18N05E04L08H, 18N05E04L18N, 18N05E04L18D, 18N05E04L13D, 18N05E04L13P, 18N05E04L14V, 18N05E04L19M, 18N05E04L14I, 18N05E04L14E, 18N05E04L20Q, 18N05E04L15B, 18N05E04L12Y, 18N05E04L12D, 18N05E04L12Z, 18N05E04L07Z, 18N05E04L13Q, 18N05E04L13B, 18N05E04L18S, 18N05E04L18I, 18N05E04L13I, 18N05E04L18E, 18N05E04L08U, 18N05E04L14Q, 18N05E04L14K, 18N05E04L14L, 18N05E04L14F, 18N05E04L14A, 18N05E04L09K, 18N05E04L09X, 18N05E04L09T, 18N05E04L19J, 18N05E04L09J, 18N05E04L15K, 18N05E04L10V, 18N05E04L10Q, 18N05E04L10F, 18N05E04L15W, 18N05E04L17P, 18N05E04L07J, 18N05E04L13X, 18N05E04L13S, 18N05E04L13H, 18N05E04L08M, 18N05E04L13T, 18N05E04L13N, 18N05E04L08I, 18N05E04L18U, 18N05E04L18P, 18N05E04L13Z, 18N05E04L13U, 18N05E04L13E, 18N05E04L08P, 18N05E04L19F, 18N05E04L19H, 18N05E04L14X, 18N05E04L09H, 18N05E04L09P, 18N05E04L20F, 18N05E04L17J, 18N05E04L13A, 18N05E04L18L, 18N05E04L08W, 18N05E04L19K, 18N05E04L14B, 18N05E04L09L, 18N05E04L14C, 18N05E04L09M, 18N05E04L19T, 18N05E04L19I, 18N05E04L19D, 18N05E04L14N, 18N05E04L14Z, 18N05E04L20A, 18N05E04L15V, 18N05E04L10K, 18N05E04L20B, 18N05E04L15L, 18N05E04L15G, 18N05E04L10G'], // Celdas de area
                    0 // comas
                )
            }
            else if (Band == 16) {
                MonitorearAreas(
                    "500946_2",//Nombre del area
                    1, // aviso
                    "18N05E04Q07J", // ceda de correo
                    ['18N05E04Q07J, 18N05E04Q07E, 18N05E04Q08F, 18N05E04Q03G, 18N05E04L23L, 18N05E04Q03Y, 18N05E04L18Z, 18N05E04Q04K, 18N05E04L24V, 18N05E04Q04H, 18N05E04L24H, 18N05E04Q04Z, 18N05E04Q04P, 18N05E04L24Z, 18N05E04L24U, 18N05E04L24P, 18N05E04Q05W, 18N05E04Q02Y, 18N05E04L22I, 18N05E04L22Z, 18N05E04Q03V, 18N05E04Q03K, 18N05E04L23B, 18N05E04Q08C, 18N05E04Q03C, 18N05E04L23T, 18N05E04Q03E, 18N05E04L23Z, 18N05E04Q09G, 18N05E04Q04Q, 18N05E04L24K, 18N05E04Q04X, 18N05E04L24M, 18N05E04Q09D, 18N05E04L24Y, 18N05E04Q10A, 18N05E04Q05B, 18N05E04L25W, 18N05E04L25B, 18N05E04Q07I, 18N05E04Q02N, 18N05E04Q02U, 18N05E04Q02J, 18N05E04Q02E, 18N05E04L22J, 18N05E04L23Q, 18N05E04Q03L, 18N05E04Q03B, 18N05E04L23G, 18N05E04Q03S, 18N05E04Q03M, 18N05E04L23Y, 18N05E04L23D, 18N05E04Q03J, 18N05E04Q04F, 18N05E04Q04B, 18N05E04L24R, 18N05E04L24G, 18N05E04L19W, 18N05E04Q04S, 18N05E04Q04M, 18N05E04Q04C, 18N05E04L24X, 18N05E04L24N, 18N05E04L19Y, 18N05E04Q09J, 18N05E04L24E, 18N05E04L25V, 18N05E04L25Q, 18N05E04L25A, 18N05E04L22Y, 18N05E04L22T, 18N05E04Q02P, 18N05E04L17Z, 18N05E04Q08A, 18N05E04Q03Q, 18N05E04Q03F, 18N05E04L18V, 18N05E04Q08G, 18N05E04Q03W, 18N05E04L23R, 18N05E04Q08H, 18N05E04L23M, 18N05E04Q08I,' +
                        ' 18N05E04Q08D, 18N05E04Q03T, 18N05E04Q08E, 18N05E04Q03Z, 18N05E04Q09A, 18N05E04Q09B, 18N05E04Q04W, 18N05E04Q04R, 18N05E04Q04L, 18N05E04L24B, 18N05E04L19V, 18N05E04Q09C, 18N05E04Q04N, 18N05E04L24I, 18N05E04Q04J, 18N05E04L24J, 18N05E04Q10F, 18N05E04L25K, 18N05E04Q10B, 18N05E04Q05G, 18N05E04L25R, 18N05E04Q07D, 18N05E04Q02T, 18N05E04Q02I, 18N05E04L23A, 18N05E04Q03X, 18N05E04Q03N, 18N05E04Q03D, 18N05E04L23N, 18N05E04Q04V, 18N05E04L24Q, 18N05E04L24F, 18N05E04L19X, 18N05E04Q09I, 18N05E04L24D, 18N05E04Q04E, 18N05E04L19Z, 18N05E04Q05V, 18N05E04Q05Q, 18N05E04L25F, 18N05E04L20V, 18N05E04Q10G, 18N05E04Q05R, 18N05E04L25G, 18N05E04L20W, 18N05E04L17Y, 18N05E04Q03A, 18N05E04L23V, 18N05E04Q03R, 18N05E04L18W, 18N05E04Q03I, 18N05E04L23I, 18N05E04Q03U, 18N05E04Q03P, 18N05E04L23E, 18N05E04Q04A, 18N05E04L24L, 18N05E04L24A, 18N05E04Q09H, 18N05E04L24C, 18N05E04Q04Y, 18N05E04L24T, 18N05E04Q05K, 18N05E04Q05A, 18N05E04L25L, 18N05E04Q02D, 18N05E04L22D, 18N05E04Q02Z, 18N05E04L23K, 18N05E04Q03H, 18N05E04L23C, 18N05E04L18Y, 18N05E04Q08J, 18N05E04L23U, 18N05E04L23P, 18N05E04L24W, 18N05E04L24S, 18N05E04Q04T, 18N05E04Q04D, 18N05E04Q09E, 18N05E04Q05F, 18N05E04Q05L, 18N05E04L22N, 18N05E04L22U, 18N05E04L22P, 18N05E04L22E, 18N05E04L23F, 18N05E04Q08B, 18N05E04L23W, 18N05E04L23X, 18N05E04L23S, 18N05E04L23H, 18N05E04L18X, 18N05E04L23J, 18N05E04Q09F, 18N05E04Q04G, 18N05E04Q04I, 18N05E04Q04U']
                    , // Celdas de area
                    0 // comas
                )
            }
            else if (Band == 17) {
                MonitorearAreas(
                    "841-17",//Nombre del area
                    1, // aviso
                    "18N05A24P08T", // ceda de correo
                    ['18N05A24P08T, 18N05A24P08R, 18N05A24P07U, 18N05A24P08Q, 18N05A24P08S, 18N05A24P07T'], // Celdas de area
                    0 // comas
                )
            }
            else if (Band == 18) {
                MonitorearAreas(
                    "Cag-141",//Nombre del area
                    1, // aviso
                    "18N05A25N06S", // ceda de correo
                    ['18N05A25N06S, 18N05A25N06R, 18N05A25N06N, 18N05A25N06I, 18N05A25N06D, 18N05A25N06K, 18N05A25N06L, 18N05A25N06M, 18N05A25N06T, 18N05A25N06Q, 18N05A25N06H'], // Celdas de area
                    0 // comas
                )
            } else if (Band == 19) {
                MonitorearAreas(
                    "502172",//Nombre del area
                    1, // aviso
                    "18N05E04D03F", // ceda de correo
                    ['18N05E04D03F, 18N05A24Q23V, 18N05E04D03B, 18N05E04D03C, 18N05A24Q23U, 18N05A24Q24R, 18N05E04D02U, 18N05E04D03A, 18N05A24Q23S, 18N05A24Q23T, 18N05A24Q23N, 18N05A24Q23Z, 18N05A24Q24L, 18N05E04D02J, 18N05E04D02E, 18N05A24Q23Q, 18N05A24Q23M, 18N05A24Q23P, 18N05A24Q24Q, 18N05A24Q22U, 18N05A24Q23K, 18N05E04D03D, 18N05E04D03E, 18N05E04D04B, 18N05A24Q24V, 18N05A24Q24W, 18N05A24Q23L, 18N05A24Q23X, 18N05A24Q24X, 18N05E04D03L, 18N05E04D04A, 18N05A24Q24K, 18N05E04D04C, 18N05A24Q24M, 18N05A24Q22Z, 18N05E04D03G, 18N05A24Q23W, 18N05A24Q23R, 18N05A24Q23Y, 18N05E04D02P, 18N05A24Q22P, 18N05E04D03K, 18N05E04D03H, 18N05A24Q24S'], // Celdas de area
                     0 // comas
                )
            }
            else  if (Band == 20) {
                MonitorearAreas(
                    "505485",
                    1,
                    "",
                    ["18N05A24N13H, 18N05A24N13Z, 18N05A24N13P, 18N05A24N19A, 18N05A24N14K, 18N05A24N14B, 18N05A24N14X, 18N05A24N14Z, 18N05A24N13Y, 18N05A24N09V, 18N05A24N14H, 18N05A24N14Y, 18N05A24N09Y, 18N05A24N14P, 18N05A24N09Z, 18N05A24N15W, 18N05A24N10W, 18N05A24N15Y, 18N05A24N15D, 18N05A24N18D, 18N05A24N14C, 18N05A24N14D, 18N05A24N19E, 18N05A24N14E, 18N05A24N10Y, 18N05A24N13X, 18N05A24N14J, 18N05A24N10V, 18N05A24N20D, 18N05A24N15N, 18N05A24N18C, 18N05A24N13M, 18N05A24N18E, 18N05A24N14M, 18N05A24N09X, 18N05A24N14T, 18N05A24N15F, 18N05A24N15L, 18N05A24N15G, 18N05A24N15B, 18N05A24N13N, 18N05A24N14V, 18N05A24N14F, 18N05A24N14A, 18N05A24N14L, 18N05A24N19D, 18N05A24N14I, 18N05A24N15V, 18N05A24N15K, 18N05A24N15A, 18N05A24N20B, 18N05A24N15S, 18N05A24N15M, 18N05A24N15H, 18N05A24N15T, 18N05A24N13S, 18N05A24N19B, 18N05A24N14R, 18N05A24N14G, 18N05A24N09W, 18N05A24N14U, 18N05A24N20C, 18N05A24N15X, 18N05A24N15R, 18N05A24N15C, 18N05A24N15I, 18N05A24N13T, 18N05A24N13I, 18N05A24N13U, 18N05A24N13J, 18N05A24N14Q, 18N05A24N14W, 18N05A24N19C, 18N05A24N14S, 18N05A24N14N, 18N05A24N20A, 18N05A24N15Q, 18N05A24N10X"],
                    0
                );
            }
            else  if (Band == 21) {
                MonitorearAreas(
                    "509188",
                    1,
                    "",
                    [" 18N05A24Q23G, 18N05A24Q18W, 18N05A24Q18Y, 18N05A24Q23F, 18N05A24Q23A, 18N05A24Q23B, 18N05A24Q18X, 18N05A24Q23D, 18N05A24Q17Z, 18N05A24Q22J, 18N05A24Q18V, 18N05A24Q23H, 18N05A24Q23I, 18N05A24Q22E, 18N05A24Q23C"],
                    0
                );
            }  
          




            // SE ACCEDE A CADA UNA DE LA INFORMACIÓN RETORNADA EN LA FUNCIÓN MonitorearAreas PARA UTILIZARLA MÁS ADELANTE EN OTROS PROCEOS
            IdArea = DetallesCompletos.IdArea;
            Aviso = DetallesCompletos.Aviso;
            Celda = DetallesCompletos.Celda;
            Area = DetallesCompletos.Area;
            Comas = DetallesCompletos.Comas;

            const continCeldas = await page.$x('//span[contains(.,"Continuar")]');
            await continCeldas[1].click();
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
                    if (contreapertura < 2) {
                        Correo(3, IdArea, Celda);
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
                if (Band == 22) {
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
            document.getElementById('activoCorrienteId0').value = '1414973400';

            angular.element(document.getElementById('activoCorrienteId0')).triggerHandler('change');

            // document.getElementById('currentLiabilitiesId0').value = '15184416062' // OLD
            document.getElementById('pasivoCorrienteId0').value = '6104212000';

            angular.element(document.getElementById('pasivoCorrienteId0')).triggerHandler('change');

            // document.getElementById('totalAssetId0').value = '48322540755' // OLD
            document.getElementById('activoTotalId0').value = '1155178400';

            angular.element(document.getElementById('activoTotalId0')).triggerHandler('change');

            // document.getElementById('totalLiabilitiesId0').value = '15401226207' // OLD
            document.getElementById('pasivoTotalId0').value = '6423743000';

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

            }
            else{
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