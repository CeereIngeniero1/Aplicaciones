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
                    "508353Superior",
                    1,
                    "18N05B21M16H",
                    ["18N05B21M16H, 18N05B21M11C, 18N05B21M06X, 18N05B21M06C, 18N05B21M01S, 18N05B21M01M, 18N05B21I21S, 18N05B21I01M, 18N05B21E21X, 18N05B21M01N, 18N05B21I16Y, 18N05B21I16I, 18N05B21I11I, 18N05B21I06I, 18N05B21I01T, 18N05B21I01N, 18N05B21I01I, 18N05B21E21Y, 18N05B21M06E, 18N05B21I16U, 18N05B21I01P, 18N05B21M17K, 18N05B21M17F, 18N05B21M02Q, 18N05B21M02F, 18N05B21I17K, 18N05B21I07Q, 18N05B21I07F, 18N05B21I02K, 18N05B21M17B, 18N05B21M07R, 18N05B21M02L, 18N05B21I07W, 18N05B21E22W, 18N05B21M12M, 18N05B21M07M, 18N05B21M02M, 18N05B21I22H, 18N05B21I12M, 18N05B21I07M, 18N05B21M07Y, 18N05B21M02D, 18N05B21I22D, 18N05B21E22Y, 18N05B21M12P, 18N05B21I22J, 18N05B21I07U, 18N05B21I07J, 18N05B21I07E, 18N05B21M13K, 18N05B21M13F, 18N05B21M08V, 18N05B21I13V, 18N05B21E23V, 18N05B21M18H, 18N05B21M18B, 18N05B21M18C, 18N05B21M03L, 18N05B21I23B, 18N05B21I18X, 18N05B21I13M, 18N05B21I08M, 18N05B21I03X, 18N05B21I03H, 18N05B21E23L, 18N05B21E23G, 18N05B21M18N, 18N05B21M03N, 18N05B21M03D, 18N05B21I23Y, 18N05B21I03Y, 18N05B21E23T, 18N05B21M13Z, 18N05B21I23U, 18N05B21I13Z, 18N05B21I13E, 18N05B21M14F, 18N05B21M04V, 18N05B21I24Q, 18N05B21I14V, 18N05B21I14Q, 18N05B21I09F, 18N05B21I09A, 18N05B21I04Q, 18N05B21E24Q, 18N05B21M19B, 18N05B21M14G, 18N05B21M04W, 18N05B21M04R, 18N05B21I24G, 18N05B21I24B, 18N05B21I09R, 18N05B21I04L, 18N05B21E24B, 18N05B21M04X, 18N05B21E24X, 18N05B21M19I, 18N05B21M19D, 18N05B21M14N, 18N05B21M14I, 18N05B21M09T, 18N05B21M04Y, 18N05B21I24Y, 18N05B21I19Y, 18N05B21I19I, 18N05B21I19D, 18N05B21I09I, 18N05B21I04I, 18N05B21I04D, 18N05B21M04P, 18N05B21I24Z, 18N05B21I24P, 18N05B21I19J, 18N05B21E24E, 18N05B21M10V, 18N05B21I25V, 18N05B21I25Q, 18N05B21I20F, 18N05B21I15V, 18N05B21I15F, 18N05B21I05Q, 18N05B21I05K, 18N05B21M05L, 18N05B21I15B, 18N05B21I10G, 18N05B21I10B, 18N05B21I05W, 18N05B21M10C, 18N05B21M05T, 18N05B21M05N, 18N05B21I25S, 18N05B21I20Y, 18N05B21I10I, 18N05B21E25S, 18N05B21E25T, 18N05B21M20P, 18N05B21M15Z, 18N05B21M10U, 18N05B21M10P, 18N05B21M05Z, 18N05B21I05P, 18N05B21N16A, 18N05B21N11V, 18N05B21N06F, 18N05B21N01V, 18N05B21N01A, 18N05B21J11V, 18N05B21J11Q, 18N05B21J11K, 18N05B21J01V, 18N05B21J01Q, 18N05B21J01K, 18N05B21F21Q, 18N05B21N06G, 18N05B21N01G, 18N05B21J11W, 18N05B21J11R, 18N05B21J11G, 18N05B21J06R, 18N05B21J06G, 18N05B21F21G, 18N05B21F21B, 18N05B21N16M, 18N05B21N16H, 18N05B21N11S, 18N05B21N06H, 18N05B21N01C, 18N05B21J11S, 18N05B21J06M, 18N05B21N16I, 18N05B21N16D, 18N05B21N11T, 18N05B21N11I, 18N05B21J21D, 18N05B21J11N, 18N05B21J01N, 18N05B21F21T, 18N05B21J16J, 18N05B21J01Z, 18N05B21F21J, 18N05B21M11M, 18N05B21M16I, 18N05B21M06T, 18N05B21M06D, 18N05B21I21Y, 18N05B21I06T, 18N05B21E21I, 18N05B21M11E, 18N05B21M06U, 18N05B21I16E, 18N05B21I06Z, 18N05B21I06J, 18N05B21I01Z, 18N05B21E21U, 18N05B21M12A, 18N05B21M07V, 18N05B21M07Q, 18N05B21M02K, 18N05B21M02A, 18N05B21I22V, 18N05B21I17Q, 18N05B21I02A, 18N05B21E22F, 18N05B21M17G, 18N05B21M12W, 18N05B21M07L, 18N05B21M02B, 18N05B21I22L, 18N05B21I22B, 18N05B21I17B, 18N05B21I12L, 18N05B21I07R, 18N05B21I07B, 18N05B21I02R, 18N05B21E22R, 18N05B21E22B, 18N05B21I22M, 18N05B21I12X, 18N05B21E22X, 18N05B21M12T, 18N05B21M02I, 18N05B21I22I, 18N05B21I17N, 18N05B21I12D, 18N05B21I07Y, 18N05B21M17J, 18N05B21M12U, 18N05B21M12E, 18N05B21M07Z, 18N05B21M07P, 18N05B21M07J, 18N05B21M07E, 18N05B21I22E, 18N05B21I17U, 18N05B21I07Z, 18N05B21I07P, 18N05B21I02P, 18N05B21I02E, 18N05B21E22E, 18N05B21M08K, 18N05B21M08A, 18N05B21M03K, 18N05B21I23K, 18N05B21I23A, 18N05B21E23A, 18N05B21M13R, 18N05B21M08X, 18N05B21M03S, 18N05B21M03H, 18N05B21M03B, 18N05B21I23W, 18N05B21I23R, 18N05B21I18M, 18N05B21I08R, 18N05B21I03M, 18N05B21I03C, 18N05B21E23X, 18N05B21E23M, 18N05B21M18I, 18N05B21M13T, 18N05B21I23I, 18N05B21I23D, 18N05B21I18D, 18N05B21I08T, 18N05B21I08D, 18N05B21M18P, 18N05B21I23Z, 18N05B21I23J, 18N05B21I18J, 18N05B21I08P, 18N05B21M19F, 18N05B21M09A, 18N05B21M04A, 18N05B21I19A, 18N05B21E24F, 18N05B21M14L, 18N05B21M14B, 18N05B21I24W, 18N05B21I19B, 18N05B21I14R, 18N05B21I14G, 18N05B21I09L, 18N05B21I04B, 18N05B21M09S, 18N05B21I14M, 18N05B21I04X, 18N05B21E24H, 18N05B21I24D, 18N05B21I14T, 18N05B21M19J, 18N05B21M14E, 18N05B21M09U, 18N05B21I24J, 18N05B21I04U, 18N05B21M15V, 18N05B21M15F, 18N05B21M10F, 18N05B21M05Q, 18N05B21I15K, 18N05B21I10F, 18N05B21M15B, 18N05B21M05G, 18N05B21M05B, 18N05B21I25R, 18N05B21I15W, 18N05B21I10L, 18N05B21I05G, 18N05B21E25W, 18N05B21E25R, 18N05B21M10X, 18N05B21M05C, 18N05B21I20T, 18N05B21I05X, 18N05B21E25C, 18N05B21E25D, 18N05B21M15U, 18N05B21I25E, 18N05B21I20J, 18N05B21I15P, 18N05B21I05Z, 18N05B21I05J, 18N05B21E25U, 18N05B21E25E, 18N05B21J21Q, 18N05B21J21K, 18N05B21J21A, 18N05B21J16A, 18N05B21J06Q, 18N05B21F21A, 18N05B21N16L, 18N05B21N11G, 18N05B21N06L, 18N05B21N01W, 18N05B21J16L, 18N05B21J16B, 18N05B21J06B, 18N05B21J01R, 18N05B21J01L, 18N05B21J01B, 18N05B21N11M, 18N05B21N01S, 18N05B21J21H, 18N05B21J21C, 18N05B21J16M, 18N05B21J11X, 18N05B21J06S, 18N05B21F21S, 18N05B21N16N, 18N05B21J16I, 18N05B21J11I, 18N05B21J06D, 18N05B21N16J, 18N05B21N11U, 18N05B21N06P, 18N05B21J21J, 18N05B21J16U, 18N05B21J11E, 18N05B21J01E, 18N05B21M16C, 18N05B21M11X, 18N05B21M11H, 18N05B21M06M, 18N05B21I16H, 18N05B21I16C, 18N05B21I06S, 18N05B21M16N, 18N05B21M11T, 18N05B21M11N, 18N05B21M06I, 18N05B21M01T, 18N05B21I21I, 18N05B21I16T, 18N05B21I06N, 18N05B21M11U, 18N05B21M06Z, 18N05B21M01U, 18N05B21M01J, 18N05B21I21J, 18N05B21I16J, 18N05B21I11J, 18N05B21I11E, 18N05B21I01J, 18N05B21M12Q, 18N05B21I17A, 18N05B21I07V, 18N05B21I02V, 18N05B21I02F, 18N05B21E22A, 18N05B21I17W, 18N05B21I02W, 18N05B21M07H, 18N05B21I07H, 18N05B21E22S, 18N05B21E22M, 18N05B21M17I, 18N05B21M12N, 18N05B21M02T, 18N05B21I17D, 18N05B21I12N, 18N05B21I07T, 18N05B21M02Z, 18N05B21I12Z, 18N05B21I12U, 18N05B21M08Q, 18N05B21M03A, 18N05B21I13Q, 18N05B21E23Q, 18N05B21E23F, 18N05B21M13S, 18N05B21M08R, 18N05B21M03M, 18N05B21I23X, 18N05B21I18W, 18N05B21I18S, 18N05B21I18H, 18N05B21I08S, 18N05B21E23R, 18N05B21M08N, 18N05B21M03I, 18N05B21I18N, 18N05B21I08I, 18N05B21M13P, 18N05B21M13J, 18N05B21M08Z, 18N05B21M08U, 18N05B21I18Z, 18N05B21I18U, 18N05B21I08U, 18N05B21I08J, 18N05B21I08E, 18N05B21E23E, 18N05B21M04Q, 18N05B21M04F, 18N05B21I24V, 18N05B21I24K, 18N05B21I19V, 18N05B21I04V, 18N05B21E24V, 18N05B21M09B, 18N05B21I19G, 18N05B21I14L, 18N05B21M19C, 18N05B21M09C, 18N05B21I14H, 18N05B21I04H, 18N05B21M14T, 18N05B21M09D, 18N05B21M04I, 18N05B21I24N, 18N05B21I14D, 18N05B21I04Y, 18N05B21E24Y, 18N05B21M14U, 18N05B21M09P, 18N05B21I14U, 18N05B21E24U, 18N05B21M20A, 18N05B21M15A, 18N05B21M05K, 18N05B21M05A, 18N05B21I20K, 18N05B21E25F, 18N05B21M05W, 18N05B21I25G, 18N05B21I15R, 18N05B21I15G, 18N05B21M20C, 18N05B21M15I, 18N05B21M15C, 18N05B21M10M, 18N05B21M05D, 18N05B21I25N, 18N05B21I25H, 18N05B21I10Y, 18N05B21I10S, 18N05B21I10T, 18N05B21E25M, 18N05B21M15P, 18N05B21M05J, 18N05B21I20U, 18N05B21I15J, 18N05B21N11Q, 18N05B21N11F, 18N05B21J16F, 18N05B21J06K, 18N05B21J21R, 18N05B21J06L, 18N05B21F21W, 18N05B21J21S, 18N05B21J16S, 18N05B21J11H, 18N05B21F21X, 18N05B21F21H, 18N05B21J01Y, 18N05B21F21N, 18N05B21N01Z, 18N05B21J11P, 18N05B21J01U, 18N05B21I21M, 18N05B21I11X, 18N05B21I11S, 18N05B21I06X, 18N05B21I06H, 18N05B21E21C, 18N05B21M06N, 18N05B21I01Y, 18N05B21E21N, 18N05B21M16P, 18N05B21M06P, 18N05B21I21Z, 18N05B21I11U, 18N05B21I06P, 18N05B21I06E, 18N05B21E21E, 18N05B21I12K, 18N05B21I07A, 18N05B21M07G, 18N05B21M02G, 18N05B21I17L, 18N05B21I17G, 18N05B21I12B, 18N05B21I07L, 18N05B21I02G, 18N05B21M02C, 18N05B21I17X, 18N05B21I17S, 18N05B21I07X, 18N05B21I02X, 18N05B21E22C, 18N05B21M07N, 18N05B21M07I, 18N05B21I17T, 18N05B21I12Y, 18N05B21I07D, 18N05B21M07U, 18N05B21M02U, 18N05B21I17Z, 18N05B21I17P, 18N05B21I17J, 18N05B21I02U, 18N05B21E22P, 18N05B21M18F, 18N05B21M13V, 18N05B21M08F, 18N05B21M03Q, 18N05B21I23V, 18N05B21I18F, 18N05B21I13K, 18N05B21I13A, 18N05B21M18G, 18N05B21M13M, 18N05B21M08M, 18N05B21M08C, 18N05B21I18C, 18N05B21I13R, 18N05B21I13G, 18N05B21I13H, 18N05B21I13B, 18N05B21I08L, 18N05B21I08G, 18N05B21I08B, 18N05B21E23S, 18N05B21E23H, 18N05B21E23B, 18N05B21M18D, 18N05B21M08T, 18N05B21M08I, 18N05B21I23T, 18N05B21I18T, 18N05B21I13T, 18N05B21I13N, 18N05B21I13I, 18N05B21I03T, 18N05B21M18J, 18N05B21M08J, 18N05B21M08E, 18N05B21M03P, 18N05B21I13U, 18N05B21I08Z, 18N05B21M19A, 18N05B21M14A, 18N05B21I24F, 18N05B21I24A, 18N05B21I19F, 18N05B21I04K, 18N05B21E24K, 18N05B21E24A, 18N05B21M19G, 18N05B21M14W, 18N05B21M09G, 18N05B21I24L, 18N05B21I09W, 18N05B21I09G, 18N05B21I09B, 18N05B21I04W, 18N05B21E24R, 18N05B21M19M, 18N05B21M19H, 18N05B21M14S, 18N05B21M04C, 18N05B21I24C, 18N05B21I19H, 18N05B21I09X, 18N05B21E24S, 18N05B21M09I, 18N05B21I24I, 18N05B21I19T, 18N05B21M14J, 18N05B21M09J, 18N05B21I19Z, 18N05B21I14Z, 18N05B21I09U, 18N05B21E24J, 18N05B21M10Q, 18N05B21M10A, 18N05B21M05F, 18N05B21I25F, 18N05B21I10K, 18N05B21E25V, 18N05B21E25A, 18N05B21M05R, 18N05B21I25W, 18N05B21I25B, 18N05B21I10W, 18N05B21I05R, 18N05B21I05L, 18N05B21E25G, 18N05B21E25B, 18N05B21M15S, 18N05B21M05S, 18N05B21M05H, 18N05B21I25T, 18N05B21I20S, 18N05B21I20D, 18N05B21I15Y, 18N05B21I10M, 18N05B21I10N, 18N05B21I05C, 18N05B21I05D, 18N05B21M15E, 18N05B21I20Z, 18N05B21I15Z, 18N05B21I10Z, 18N05B21I10U, 18N05B21I10J, 18N05B21I05E, 18N05B21E25P, 18N05B21N11A, 18N05B21J06V, 18N05B21J06A, 18N05B21F21V, 18N05B21F21K, 18N05B21F21F, 18N05B21N16B, 18N05B21J21B, 18N05B21J01W, 18N05B21J01G, 18N05B21N06M, 18N05B21N01H, 18N05B21J16H, 18N05B21J06X, 18N05B21J06C, 18N05B21J01X, 18N05B21J01C, 18N05B21N11N, 18N05B21N06N, 18N05B21J16Y, 18N05B21J11T, 18N05B21J11D, 18N05B21J06Y, 18N05B21J06T, 18N05B21J06N, 18N05B21J01T, 18N05B21N16P, 18N05B21N11E, 18N05B21N01J, 18N05B21N01E, 18N05B21J21U, 18N05B21J11Z, 18N05B21J11U, 18N05B21J11J, 18N05B21J06J, 18N05B21J01P, 18N05B21F21P, 18N05B21M11S, 18N05B21M06H, 18N05B21M01X, 18N05B21M01H, 18N05B21I16X, 18N05B21I11M, 18N05B21E21S, 18N05B21E21G, 18N05B21E21B, 18N05B21M11Y, 18N05B21M01Y, 18N05B21M01I, 18N05B21I21T, 18N05B21I21U, 18N05B21I21E, 18N05B21I16Z, 18N05B21I11Z, 18N05B21E21Z, 18N05B21E21J, 18N05B21I22Q, 18N05B21I17F, 18N05B21I12A, 18N05B21M12L, 18N05B21I12G, 18N05B21I07G, 18N05B21I02B, 18N05B21E22L, 18N05B21M17M, 18N05B21M12S, 18N05B21M07X, 18N05B21M02S, 18N05B21I12S, 18N05B21I12C, 18N05B21I07S, 18N05B21I02S, 18N05B21I02H, 18N05B21M17N, 18N05B21M12Y, 18N05B21I12T, 18N05B21I12I, 18N05B21I07N, 18N05B21I02I, 18N05B21I02D, 18N05B21E22D, 18N05B21M02P, 18N05B21I22Z, 18N05B21I22U, 18N05B21I17E, 18N05B21I12J, 18N05B21I12E, 18N05B21I02Z, 18N05B21E22J, 18N05B21I03F, 18N05B21E23K, 18N05B21M13C, 18N05B21M08H, 18N05B21M03X, 18N05B21M03C, 18N05B21I18R, 18N05B21I18B, 18N05B21I13X, 18N05B21I13C, 18N05B21I03R, 18N05B21I03S, 18N05B21I03L, 18N05B21M08Y, 18N05B21M03T, 18N05B21I13Y, 18N05B21I03D, 18N05B21E23Y, 18N05B21E23I, 18N05B21M13U, 18N05B21M13E, 18N05B21M03U, 18N05B21I23P, 18N05B21M19K, 18N05B21I14F, 18N05B21I09Q, 18N05B21M09R, 18N05B21I19W, 18N05B21I19L, 18N05B21E24G, 18N05B21M14X, 18N05B21M14M, 18N05B21M09X, 18N05B21I24S, 18N05B21I14X, 18N05B21I14C, 18N05B21I09M, 18N05B21I04C, 18N05B21E24C, 18N05B21M19N, 18N05B21M09Y, 18N05B21M04T, 18N05B21M04N, 18N05B21I14N, 18N05B21I09T, 18N05B21I09N, 18N05B21I04N, 18N05B21M09Z, 18N05B21M04J, 18N05B21I19U, 18N05B21I19E, 18N05B21I14J, 18N05B21I04Z, 18N05B21I04P, 18N05B21E24P, 18N05B21M15K, 18N05B21I20V, 18N05B21I10V, 18N05B21M20B, 18N05B21M15R, 18N05B21M15L, 18N05B21M10R, 18N05B21M10G, 18N05B21I20R, 18N05B21I20G, 18N05B21I10R, 18N05B21M20M, 18N05B21M20I, 18N05B21M15Y, 18N05B21M15M, 18N05B21M15N, 18N05B21M15H, 18N05B21M10H, 18N05B21M10I, 18N05B21M05M, 18N05B21I25D, 18N05B21I15X, 18N05B21I15M, 18N05B21I10D, 18N05B21I05Y, 18N05B21I05N, 18N05B21I25P, 18N05B21I20E, 18N05B21I10P, 18N05B21N16K, 18N05B21N16F, 18N05B21N01Q, 18N05B21N01F, 18N05B21J01F, 18N05B21N11W, 18N05B21N11R, 18N05B21N11B, 18N05B21N06B, 18N05B21N01R, 18N05B21N01L, 18N05B21N01B, 18N05B21J21W, 18N05B21J21L, 18N05B21J16W, 18N05B21J06W, 18N05B21N11C, 18N05B21J06H, 18N05B21J01S, 18N05B21J01M, 18N05B21J01H, 18N05B21F21C, 18N05B21N11D, 18N05B21N01Y, 18N05B21N01T, 18N05B21J16T, 18N05B21J16D, 18N05B21N16E, 18N05B21N11Z, 18N05B21J16Z, 18N05B21J01J, 18N05B21I21C, 18N05B21I16S, 18N05B21I16M, 18N05B21I11H, 18N05B21I01H, 18N05B21I01C, 18N05B21E21M, 18N05B21E21H, 18N05B21M06Y, 18N05B21I16D, 18N05B21I11T, 18N05B21I11D, 18N05B21I06D, 18N05B21I01D, 18N05B21M11J, 18N05B21M06J, 18N05B21M01P, 18N05B21I21P, 18N05B21M17A, 18N05B21M12V, 18N05B21M02V, 18N05B21E22V, 18N05B21E22K, 18N05B21M17L, 18N05B21I22R, 18N05B21I17R, 18N05B21I02L, 18N05B21M17H, 18N05B21M17C, 18N05B21M02X, 18N05B21I22S, 18N05B21I12H, 18N05B21I02M, 18N05B21E22H, 18N05B21I22Y, 18N05B21I22N, 18N05B21I17Y, 18N05B21I17I, 18N05B21E22N, 18N05B21E22I, 18N05B21M12J, 18N05B21I12P, 18N05B21E22Z, 18N05B21M18K, 18N05B21M13A, 18N05B21M03V, 18N05B21I18V, 18N05B21I13F, 18N05B21I08V, 18N05B21I03V, 18N05B21M03G, 18N05B21I23S, 18N05B21I23H, 18N05B21I13W, 18N05B21I08H, 18N05B21I08C, 18N05B21I03W, 18N05B21E23W, 18N05B21M03Y, 18N05B21M08P, 18N05B21M03E, 18N05B21I03P, 18N05B21E23Z, 18N05B21E23U, 18N05B21M09Q, 18N05B21I14K, 18N05B21I14A, 18N05B21I09V, 18N05B21I04F, 18N05B21M09W, 18N05B21M09L, 18N05B21M04L, 18N05B21I14B, 18N05B21I04G, 18N05B21E24L, 18N05B21M14C, 18N05B21M09H, 18N05B21M04S, 18N05B21I24M, 18N05B21I04S, 18N05B21E24M, 18N05B21I19N, 18N05B21I04T, 18N05B21M09E, 18N05B21I24E, 18N05B21I14E, 18N05B21I09J, 18N05B21I15A, 18N05B21E25K, 18N05B21M20L, 18N05B21M15G, 18N05B21M10W, 18N05B21I20B, 18N05B21M20N, 18N05B21M10T, 18N05B21M10N, 18N05B21M10D, 18N05B21M05X, 18N05B21M05I, 18N05B21I25Y, 18N05B21I25C, 18N05B21I20N, 18N05B21I20C, 18N05B21I15C, 18N05B21I15D, 18N05B21I10H, 18N05B21I05S, 18N05B21I05T, 18N05B21E25N, 18N05B21E25I, 18N05B21M10J, 18N05B21M05P, 18N05B21I25Z, 18N05B21I25J, 18N05B21I15U, 18N05B21N11K, 18N05B21N06V, 18N05B21N06Q, 18N05B21N06A, 18N05B21N01K, 18N05B21J21V, 18N05B21J21F, 18N05B21J16Q, 18N05B21J06F, 18N05B21N16G, 18N05B21N06W, 18N05B21J16R, 18N05B21J11L, 18N05B21N06X, 18N05B21J21X, 18N05B21J16C, 18N05B21J11M, 18N05B21N06Y, 18N05B21N01I, 18N05B21J21Y, 18N05B21J06I, 18N05B21F21D, 18N05B21N11P, 18N05B21N06E, 18N05B21N01P, 18N05B21J21Z, 18N05B21J21P, 18N05B21J06P, 18N05B21M01C, 18N05B21I21X, 18N05B21I01S, 18N05B21M01D, 18N05B21I16N, 18N05B21I11Y, 18N05B21I11N, 18N05B21I06Y, 18N05B21E21T, 18N05B21E21D, 18N05B21M16J, 18N05B21M16E, 18N05B21M11P, 18N05B21I16P, 18N05B21I11P, 18N05B21I06U, 18N05B21I01U, 18N05B21E21P, 18N05B21M12K, 18N05B21M07K, 18N05B21M07F, 18N05B21M07A, 18N05B21I22F, 18N05B21I12Q, 18N05B21I12F, 18N05B21I07K, 18N05B21I02Q, 18N05B21E22Q, 18N05B21M12G, 18N05B21M07W, 18N05B21M07B, 18N05B21M02R, 18N05B21I22W, 18N05B21I12R, 18N05B21E22G, 18N05B21M12X, 18N05B21M12H, 18N05B21M12C, 18N05B21M02H, 18N05B21I22C, 18N05B21I17M, 18N05B21I17H, 18N05B21I07C, 18N05B21I02C, 18N05B21M12I, 18N05B21M12D, 18N05B21M02N, 18N05B21I22T, 18N05B21I02T, 18N05B21E22T, 18N05B21M17P, 18N05B21M02E, 18N05B21I22P, 18N05B21E22U, 18N05B21M13Q, 18N05B21I23F, 18N05B21I18Q, 18N05B21I18K, 18N05B21I18A, 18N05B21I08Q, 18N05B21I08K, 18N05B21I08A, 18N05B21I03Q, 18N05B21I03A, 18N05B21M13X, 18N05B21M13G, 18N05B21M13H, 18N05B21M13B, 18N05B21M08W, 18N05B21M08S, 18N05B21M08G, 18N05B21M08B, 18N05B21I23M, 18N05B21I23C, 18N05B21I18L, 18N05B21I13S, 18N05B21I13L, 18N05B21I08X, 18N05B21I03G, 18N05B21I03B, 18N05B21E23C, 18N05B21M13D, 18N05B21I18Y, 18N05B21I03I, 18N05B21E23D, 18N05B21M03Z, 18N05B21M03J, 18N05B21I23E, 18N05B21I18E, 18N05B21I13J, 18N05B21I03U, 18N05B21I03J, 18N05B21E23P, 18N05B21E23J, 18N05B21M09V, 18N05B21M04K, 18N05B21I09K, 18N05B21I04A, 18N05B21M14R, 18N05B21M04B, 18N05B21I24R, 18N05B21I14W, 18N05B21M14H, 18N05B21I24H, 18N05B21I19S, 18N05B21I19M, 18N05B21I09S, 18N05B21I09H, 18N05B21I04M, 18N05B21M14Y, 18N05B21I14Y, 18N05B21I14I, 18N05B21I09Y, 18N05B21I09D, 18N05B21M19E, 18N05B21M14Z, 18N05B21M04Z, 18N05B21M04E, 18N05B21I24U, 18N05B21I19P, 18N05B21I14P, 18N05B21I09Z, 18N05B21I09P, 18N05B21I09E, 18N05B21I04J, 18N05B21I04E, 18N05B21M20K, 18N05B21M20F, 18N05B21M15Q, 18N05B21M10K, 18N05B21M05V, 18N05B21I25A, 18N05B21I20Q, 18N05B21I15Q, 18N05B21I10Q, 18N05B21I05V, 18N05B21E25Q, 18N05B21M20G, 18N05B21M15W, 18N05B21M10B, 18N05B21I20W, 18N05B21I15L, 18N05B21I05B, 18N05B21M20D, 18N05B21I25X, 18N05B21I15S, 18N05B21I15T, 18N05B21I15I, 18N05B21I10C, 18N05B21I05M, 18N05B21E25X, 18N05B21E25Y, 18N05B21E25H, 18N05B21M05E, 18N05B21I05U, 18N05B21E25Z, 18N05B21N06K, 18N05B21J16V, 18N05B21J16K, 18N05B21J11F, 18N05B21J01A, 18N05B21N11L, 18N05B21N06R, 18N05B21J16G, 18N05B21J11B, 18N05B21F21R, 18N05B21F21L, 18N05B21N11H, 18N05B21N06S, 18N05B21N01X, 18N05B21J11C, 18N05B21N11Y, 18N05B21N06T, 18N05B21N06D, 18N05B21J21N, 18N05B21J21I, 18N05B21J11Y, 18N05B21J01D, 18N05B21N06U, 18N05B21N06J, 18N05B21N01U, 18N05B21F21Z, 18N05B21M16M, 18N05B21M06S, 18N05B21I21H, 18N05B21I11C, 18N05B21I06M, 18N05B21I06C, 18N05B21I01X, 18N05B21M16D, 18N05B21M11I, 18N05B21M11D, 18N05B21I21N, 18N05B21I21D, 18N05B21M11Z, 18N05B21M01Z, 18N05B21M01E, 18N05B21I01E, 18N05B21M12F, 18N05B21I22K, 18N05B21I22A, 18N05B21I17V, 18N05B21I12V, 18N05B21M12R, 18N05B21M12B, 18N05B21M02W, 18N05B21I22G, 18N05B21I12W, 18N05B21M07S, 18N05B21M07C, 18N05B21I22X, 18N05B21I17C, 18N05B21M17D, 18N05B21M07T, 18N05B21M07D, 18N05B21M02Y, 18N05B21I07I, 18N05B21I02Y, 18N05B21I02N, 18N05B21M17E, 18N05B21M12Z, 18N05B21M02J, 18N05B21I02J, 18N05B21M18A, 18N05B21M03F, 18N05B21I23Q, 18N05B21I08F, 18N05B21I03K, 18N05B21M18L, 18N05B21M18M, 18N05B21M13W, 18N05B21M13L, 18N05B21M08L, 18N05B21M03W, 18N05B21M03R, 18N05B21I23L, 18N05B21I23G, 18N05B21I18G, 18N05B21I08W, 18N05B21M13Y, 18N05B21M13N, 18N05B21M13I, 18N05B21M08D, 18N05B21I23N, 18N05B21I18I, 18N05B21I13D, 18N05B21I08Y, 18N05B21I08N, 18N05B21I03N, 18N05B21E23N, 18N05B21M18E, 18N05B21I18P, 18N05B21I13P, 18N05B21I03Z, 18N05B21I03E, 18N05B21M14V, 18N05B21M14Q, 18N05B21M14K, 18N05B21M09K, 18N05B21M09F, 18N05B21I19Q, 18N05B21I19K, 18N05B21M19L, 18N05B21M04G, 18N05B21I19R, 18N05B21I04R, 18N05B21E24W, 18N05B21M09M, 18N05B21M04M, 18N05B21M04H, 18N05B21I24X, 18N05B21I19X, 18N05B21I19C, 18N05B21I14S, 18N05B21I09C, 18N05B21M14D, 18N05B21M09N, 18N05B21M04D, 18N05B21I24T, 18N05B21E24T, 18N05B21E24N, 18N05B21E24I, 18N05B21E24D, 18N05B21M19P, 18N05B21M14P, 18N05B21M04U, 18N05B21E24Z, 18N05B21I25K, 18N05B21I20A, 18N05B21I10A, 18N05B21I05F, 18N05B21I05A, 18N05B21M10L, 18N05B21I25L, 18N05B21I20L, 18N05B21E25L, 18N05B21M20H, 18N05B21M15X, 18N05B21M15T, 18N05B21M15D, 18N05B21M10S, 18N05B21M10Y, 18N05B21M05Y, 18N05B21I25M, 18N05B21I25I, 18N05B21I20X, 18N05B21I20M, 18N05B21I20H, 18N05B21I20I, 18N05B21I15H, 18N05B21I15N, 18N05B21I10X, 18N05B21I05H, 18N05B21I05I, 18N05B21M20J, 18N05B21M20E, 18N05B21M15J, 18N05B21M10Z, 18N05B21M10E, 18N05B21M05U, 18N05B21I25U, 18N05B21I20P, 18N05B21I15E, 18N05B21I10E, 18N05B21E25J, 18N05B21J11A, 18N05B21J21G, 18N05B21N16C, 18N05B21N11X, 18N05B21N06C, 18N05B21N01M, 18N05B21J21M, 18N05B21J16X, 18N05B21F21M, 18N05B21N06I, 18N05B21N01N, 18N05B21N01D, 18N05B21J21T, 18N05B21J16N, 18N05B21J01I, 18N05B21F21Y, 18N05B21F21I, 18N05B21N11J, 18N05B21N06Z, 18N05B21J21E, 18N05B21J16P, 18N05B21J16E, 18N05B21J06Z, 18N05B21J06U, 18N05B21J06E, 18N05B21F21U, 18N05B21F21E"],
                    77
                );
            }else if (Band == 3) {
                MonitorearAreas(
                    "",
                    1,
                    "",
                    [""],
                    77
                );
            }else if (Band == 4) {
                MonitorearAreas(
                    "",
                    1,
                    "",
                    [""],
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