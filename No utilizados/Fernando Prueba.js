const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require('console');
const { keyboard, mouse, Key, clipboard } = require('@nut-tree-fork/nut-js'); 
//Pruebas 2.2
var Empresa = 'Collective';
var user1 = '83955';
var pass1 = 'wX2*dQ3*cS';
var user2 = '83955';
var pass2 = 'wX2*dQ3*cS';
var Agente = 1;
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
        headless: false,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--start-maximized',
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`
        ],
        devtools: false
    });
        
       // Mineria(browser, 0, Pin);
       
       const page = await browser.newPage();
       await page.setViewport({ width: 1368, height: 620 });
       await page.goto('https://siaweb.itm.edu.co/ClaveAlumnos.asp');
}




async function Mineria(browser, Indicador, Pin) {



    console.log("Esta es la vuelta " + ContadorVueltas);
    if (false) {
        await browser.close();
        ContadorVueltas = 0;
        Pagina();
        if (Agente == 0) {
            Agente = 1;
        } else if (Agente == 1) {
            Agente = 0;
        }
    }
    const page = await browser.newPage();
    var exepcion = 0;
    let Primerpaso = setTimeout(() => {
        console.log("ENTRO EN EL PRIMERPASO")

        if (exepcion == 1) {
            Indicador = 1;
        } else {
            Indicador = 0;
        }
        page.close();
        Mineria(browser, Indicador, Pin);
        clearTimeout(Primerpaso);
    }, 20000);

console.log("estoy llegando aca");



    await page.setViewport({ width: 1368, height: 620 });
    await page.goto('https://annamineria.anm.gov.co/sigm/');

    let user = (Agente == 0) ? user1 : user2;
    let pass = (Agente == 0) ? pass1 : pass2;
    console.log("estoy llegando aca 2");
    console.log(Indicador);
    if (Indicador == 0) {
        try {
            Indicador = 1;
            console.log(user);
            console.log(pass);
            await page.type('#username', user);
            await page.type('#password', pass);

            page.click("#loginButton");


        } catch (ex) {
            exepcion = 1;
            console.log("Entro en el catch");
        }

    }


    console.log("El indicador es igual a " + Indicador);



    page.setDefaultTimeout(0);
    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
    validador = 0;
    clearTimeout(Primerpaso);
    let Segundopaso = setTimeout(() => {
        console.log("ENTRO EN EL Segundopaso")
        page.close();
        Mineria(browser, Indicador, Pin);
        clearTimeout(Segundopaso);
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
            // page.close();
            Mineria(browser, Indicador, Pin);
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
                "500946_1",//Nombre del area
                1, // aviso
                "18N05E04L17N", // ceda de correo
                ['18N05N14M12R'], // Celdas de area  
                0 // comas 
            )
        } else if (Band == 2) {
            MonitorearAreas(
                "841-17",//Nombre del area
                1, // aviso
                "18N05A24P08T", // ceda de correo
                ['18N05A24P08T, 18N05A24P08R, 18N05A24P07U, 18N05A24P08Q, 18N05A24P08S, 18N05A24P07T'], // Celdas de area  
                0 // comas 
            )
        } else if (Band == 3) {
            MonitorearAreas(
                "DLH-14451X",//Nombre del area
                1, // aviso
                "18N05A24Q24J", // ceda de correo
                ['18N05A24Q24J, 18N05A24Q24D, 18N05A24Q19Y, 18N05A24Q25A, 18N05A24Q24E, 18N05A24Q19N, 18N05A24Q25G, 18N05A24Q25H, 18N05A24Q20X, 18N05A24Q19Z, 18N05A24Q20K, 18N05A24Q25B, 18N05A24Q20W, 18N05A24Q20L, 18N05A24Q25C, 18N05A24Q25I, 18N05A24Q25E, 18N05A24Q24I, 18N05A24Q19U, 18N05A24Q19P, 18N05A24Q25F, 18N05A24Q20V, 18N05A24Q20Q, 18N05A24Q20M, 18N05A24Q20R, 18N05A24Q25D, 18N05A24Q20S, 18N05A24Q19T, 18N05A24Q25J'], // Celdas de area  
                46 // comas 
            )
        } else if (Band == 4) {
            MonitorearAreas(
                "Cag-141",//Nombre del area
                1, // aviso
                "18N05A25N06S", // ceda de correo
                ['18N05A25N06S, 18N05A25N06R, 18N05A25N06N, 18N05A25N06I, 18N05A25N06D, 18N05A25N06K, 18N05A25N06L, 18N05A25N06M, 18N05A25N06T, 18N05A25N06Q, 18N05A25N06H'], // Celdas de area  
                0 // comas 
            )
        } else if (Band == 5) {
            MonitorearAreas(
                "500946",//Nombre del area
                1, // aviso
                "18N05E04L17N", // ceda de correo
                ['18N05E04L17N, 18N05E04L17D, 18N05E04L07N, 18N05E04Q07J, 18N05E04Q07E, 18N05E04L17U, 18N05E04L12U, 18N05E04L12E, 18N05E04L07P, 18N05E04Q08F, 18N05E04L18Q, 18N05E04Q03G, 18N05E04L23L, 18N05E04L18R, 18N05E04L13W, 18N05E04L08S, 18N05E04Q03Y, 18N05E04L18Z, 18N05E04L13J, 18N05E04Q04K, 18N05E04L24V, 18N05E04L19R, 18N05E04L09V, 18N05E04L09Q, 18N05E04Q04H, 18N05E04L24H, 18N05E04L19C, 18N05E04L14M, 18N05E04L19N, 18N05E04L14Y, 18N05E04L14D, 18N05E04Q04Z, 18N05E04Q04P, 18N05E04L24Z, 18N05E04L24U, 18N05E04L24P, 18N05E04L14U, 18N05E04Q05W, 18N05E04L20L, 18N05E04L10R, 18N05E04Q02Y, 18N05E04L22I, 18N05E04L17I, 18N05E04L07T, 18N05E04L22Z, 18N05E04L17E, 18N05E04L12P, 18N05E04Q03V, 18N05E04Q03K, 18N05E04L13K, 18N05E04L13F, 18N05E04L08K, 18N05E04L23B, 18N05E04L18G, 18N05E04L18B, 18N05E04L13G, 18N05E04Q08C, 18N05E04Q03C, 18N05E04L23T, 18N05E04L13Y, 18N05E04Q03E, 18N05E04L23Z, 18N05E04Q09G, 18N05E04Q04Q, 18N05E04L24K, 18N05E04L09F, 18N05E04Q04X, 18N05E04L24M, 18N05E04L14H, 18N05E04Q09D, 18N05E04L24Y, 18N05E04L14P, 18N05E04L09Z, 18N05E04Q10A, 18N05E04L20K, 18N05E04L15Q, 18N05E04Q05B, 18N05E04L25W, 18N05E04L25B, 18N05E04L20R, 18N05E04L10W, 18N05E04L10L, 18N05E04Q07I, 18N05E04Q02N, 18N05E04L07I, 18N05E04Q02U, 18N05E04Q02J, 18N05E04Q02E, 18N05E04L22J, 18N05E04L12J, 18N05E04L23Q, 18N05E04L18K, 18N05E04Q03L, 18N05E04Q03B, 18N05E04L23G, 18N05E04L08L, 18N05E04Q03S, 18N05E04Q03M, 18N05E04L18M, 18N05E04L18H, 18N05E04L18C, 18N05E04L13C, 18N05E04L08X, 18N05E04L23Y, 18N05E04L23D, 18N05E04L18T, 18N05E04L08Y, 18N05E04L08T, 18N05E04L08N, 18N05E04Q03J, 18N05E04L18J, 18N05E04L08Z, 18N05E04Q04F, 18N05E04Q04B, 18N05E04L24R, 18N05E04L24G, 18N05E04L19W, 18N05E04L19Q, 18N05E04L19L, 18N05E04L14R, 18N05E04L14G, 18N05E04L09G, 18N05E04Q04S, 18N05E04Q04M, 18N05E04Q04C, 18N05E04L24X, 18N05E04L19S, 18N05E04L09S, 18N05E04L24N, 18N05E04L19Y, 18N05E04L14T, 18N05E04L09I, 18N05E04Q09J, 18N05E04L24E, 18N05E04L19U, 18N05E04L19P, 18N05E04L19E, 18N05E04L25V, 18N05E04L25Q, 18N05E04L25A, 18N05E04L15A, 18N05E04L20G, 18N05E04L15R, 18N05E04L22Y, 18N05E04L22T, 18N05E04L12T, 18N05E04L07Y, 18N05E04Q02P, 18N05E04L17Z, 18N05E04Q08A, 18N05E04Q03Q, 18N05E04Q03F, 18N05E04L18V, 18N05E04L18F, 18N05E04L08V, 18N05E04Q08G, 18N05E04Q03W, 18N05E04L23R, 18N05E04Q08H, 18N05E04L23M, 18N05E04L13M, 18N05E04Q08I, 18N05E04Q08D, 18N05E04Q03T, 18N05E04Q08E, 18N05E04Q03Z, 18N05E04L08J, 18N05E04Q09A, 18N05E04Q09B, 18N05E04Q04W, 18N05E04Q04R, 18N05E04Q04L, 18N05E04L24B, 18N05E04L19V, 18N05E04L19G, 18N05E04L19A, 18N05E04L19B, 18N05E04L14W, 18N05E04L09W, 18N05E04L09R, 18N05E04Q09C, 18N05E04L14S, 18N05E04Q04N, 18N05E04L24I, 18N05E04L09Y, 18N05E04L09N, 18N05E04Q04J, 18N05E04L24J, 18N05E04L14J, 18N05E04L09U, 18N05E04Q10F, 18N05E04L25K, 18N05E04L15F, 18N05E04Q10B, 18N05E04Q05G, 18N05E04L25R, 18N05E04Q07D, 18N05E04Q02T, 18N05E04Q02I, 18N05E04L17T, 18N05E04L12N, 18N05E04L12I, 18N05E04L07U, 18N05E04L23A, 18N05E04L18A, 18N05E04L13V, 18N05E04L08Q, 18N05E04L08F, 18N05E04L13R, 18N05E04L13L, 18N05E04L08R, 18N05E04L08G, 18N05E04Q03X, 18N05E04L08H, 18N05E04Q03N, 18N05E04Q03D, 18N05E04L23N, 18N05E04L18N, 18N05E04L18D, 18N05E04L13D, 18N05E04L13P, 18N05E04Q04V, 18N05E04L24Q, 18N05E04L24F, 18N05E04L14V, 18N05E04L19X, 18N05E04L19M, 18N05E04Q09I, 18N05E04L24D, 18N05E04L14I, 18N05E04Q04E, 18N05E04L19Z, 18N05E04L14E, 18N05E04Q05V, 18N05E04Q05Q, 18N05E04L25F, 18N05E04L20V, 18N05E04L20Q, 18N05E04Q10G, 18N05E04Q05R, 18N05E04L25G, 18N05E04L20W, 18N05E04L15B, 18N05E04L17Y, 18N05E04L12Y, 18N05E04L12D, 18N05E04L12Z, 18N05E04L07Z, 18N05E04Q03A, 18N05E04L23V, 18N05E04L13Q, 18N05E04Q03R, 18N05E04L18W, 18N05E04L13B, 18N05E04L18S, 18N05E04Q03I, 18N05E04L23I, 18N05E04L18I, 18N05E04L13I, 18N05E04Q03U, 18N05E04Q03P, 18N05E04L23E, 18N05E04L18E, 18N05E04L08U, 18N05E04Q04A, 18N05E04L24L, 18N05E04L24A, 18N05E04L14Q, 18N05E04L14K, 18N05E04L14L, 18N05E04L14F, 18N05E04L14A, 18N05E04L09K, 18N05E04Q09H, 18N05E04L24C, 18N05E04L09X, 18N05E04Q04Y, 18N05E04L24T, 18N05E04L09T, 18N05E04L19J, 18N05E04L09J, 18N05E04Q05K, 18N05E04Q05A, 18N05E04L15K, 18N05E04L10V, 18N05E04L10Q, 18N05E04L10F, 18N05E04L25L, 18N05E04L15W, 18N05E04Q02D, 18N05E04L22D, 18N05E04Q02Z, 18N05E04L17P, 18N05E04L07J, 18N05E04L23K, 18N05E04Q03H, 18N05E04L23C, 18N05E04L13X, 18N05E04L13S, 18N05E04L13H, 18N05E04L08M, 18N05E04L18Y, 18N05E04L13T, 18N05E04L13N, 18N05E04L08I, 18N05E04Q08J, 18N05E04L23U, 18N05E04L23P, 18N05E04L18U, 18N05E04L18P, 18N05E04L13Z, 18N05E04L13U, 18N05E04L13E, 18N05E04L08P, 18N05E04L24W, 18N05E04L19F, 18N05E04L24S, 18N05E04L19H, 18N05E04L14X, 18N05E04L09H, 18N05E04Q04T, 18N05E04Q04D, 18N05E04Q09E, 18N05E04L09P, 18N05E04Q05F, 18N05E04L20F, 18N05E04Q05L, 18N05E04L22N, 18N05E04L22U, 18N05E04L22P, 18N05E04L22E, 18N05E04L17J, 18N05E04L23F, 18N05E04L13A, 18N05E04Q08B, 18N05E04L23W, 18N05E04L18L, 18N05E04L08W, 18N05E04L23X, 18N05E04L23S, 18N05E04L23H, 18N05E04L18X, 18N05E04L23J, 18N05E04Q09F, 18N05E04Q04G, 18N05E04L19K, 18N05E04L14B, 18N05E04L09L, 18N05E04L14C, 18N05E04L09M, 18N05E04Q04I, 18N05E04L19T, 18N05E04L19I, 18N05E04L19D, 18N05E04L14N, 18N05E04Q04U, 18N05E04L14Z, 18N05E04L20A, 18N05E04L15V, 18N05E04L10K, 18N05E04L20B, 18N05E04L15L, 18N05E04L15G, 18N05E04L10G '], // Celdas de area  
                260 // comas 
            )
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
            if (Band == 6) {
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
        Mineria(browser, Indicador, Pin);
        clearTimeout(TimeNOpaso);

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
    if (SoloAviso == 1) {
        CorreoAlternativo(1, IdArea);
    }


    let RadiPrimero = setTimeout(() => {

        console.log("ENTRO EN EL RadiPrimero");
        page.close();
        Mineria(browser, Indicador, Pin);
        clearTimeout(RadiPrimero);


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
    await page.evaluate(() => {

        // Check
        document.querySelector('Input[id="declareIndId0"]').click();

        //Valores
        // document.getElementById('currentAssetId0').value = '42539369275' // OLD
        document.getElementById('currentAssetId0').value = '1725073000';

        angular.element(document.getElementById('currentAssetId0')).triggerHandler('change');

        // document.getElementById('currentLiabilitiesId0').value = '15184416062' // OLD
        document.getElementById('currentLiabilitiesId0').value = '6092064000';

        angular.element(document.getElementById('currentLiabilitiesId0')).triggerHandler('change');

        // document.getElementById('totalAssetId0').value = '48322540755' // OLD
        document.getElementById('totalAssetId0').value = '11551785000';

        angular.element(document.getElementById('totalAssetId0')).triggerHandler('change');

        // document.getElementById('totalLiabilitiesId0').value = '15401226207' // OLD
        document.getElementById('totalLiabilitiesId0').value = '6423743000';

        angular.element(document.getElementById('totalLiabilitiesId0')).triggerHandler('change');
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
        Mineria(browser, Indicador, Pin);
        clearTimeout(Radisegundo);


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

        let ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\Certificado_Ambiental.pdf`;

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
            "1. Certificado De Existencia Y Representacion Legal.pdf",
            "2. Documento De Identificacion.pdf",
            "3. Tarjeta Profesional Del Contador.pdf",
            "4. Tarjeta Profesional Del Geologo.pdf",
            "5. Certificado De Existencia Y Representacion Legal.pdf",
            "6. Estados Financieros Propios Certificados O Dictaminados Proponente.pdf",
            "7. RUT.pdf",
            "8. Declaracion De Renta.pdf"
        ];

        let ElementosFile = [
            "p_CaaCataMandatoryDocumentToAttachId0",
            "p_CaaCataMandatoryDocumentToAttachId1",
            "p_CaaCataMandatoryDocumentToAttachId2",
            "p_CaaCataMandatoryDocumentToAttachId3",
            "p_CaaCataMandatoryDocumentToAttachId5",
            "p_CaaCataMandatoryDocumentToAttachId6",
            "p_CaaCataMandatoryDocumentToAttachId7",
            "p_CaaCataMandatoryDocumentToAttachId8",
        ];

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
        } catch (error) {
            console.error('Error general al adjuntar archivos:', error);
        }

        console.log('================================================================');
        console.log('FINALIZA PROCESO DE ADJUNTAR DOCUMENTOS REGLAMENTARIOS');

        await page.waitForTimeout(2000);

    } catch (error) {
        console.log('BOTO ERROR');
    }


    //CAPTURA DE PANTALLA
    await CapturaPantalla(page);
    const continPag = await page.$x('//span[contains(.,"Continuar")]');
    // await continPag[1].click();


    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
    clearTimeout(Radisegundo);
    let RadiTercero = setTimeout(() => {

        console.log("ENTRO EN EL Radisegundo");
        //page.close();
        Mineria(browser, Indicador, Pin);
        clearTimeout(RadiTercero);


    }, 90000);
    //await page.waitForSelector('#recaptchaContainer');
    console.log("lo encontro");
    await page.waitForTimeout(2000);
    // // Obtener todos los iframes en la página
    // const frames = await page.frames();

    // // Encontrar el iframe que contiene el recaptcha
    // const recaptchaFrame = frames.find(frame => frame.url().includes('recaptcha'));

    // // Esperar a que el elemento con la clase 'recaptcha-checkbox-border' esté presente
    // // await page.waitForSelector('#recaptcha-anchor');
    // const recaptchaCheckbox = await recaptchaFrame.waitForSelector('#recaptcha-anchor');

    // // Hacer clic en el checkbox del recaptcha
    // await recaptchaCheckbox.click();

    // //CAPTURA DE PANTALLA
    
   
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
    clearTimeout(RadiTercero);

    await CapturaPantalla(page);
    //CORREO RADICACION
    Correo(2, IdArea, Celda);

    await page.waitForTimeout(180000);
    // Mineria(browser, Indicador, Pin);








}


// FUNCIÓN PARA ENVÍO DE CORREO SEGÚN LA SITUACIÓN
function Correo(Tipo, Area, Celda) {
    // 1. Liberada 2. radicada 3. Fecha reapertura
    var msg = "";
    var Color = "";
    var Texto = "";
    //Area = "Tranquilos area de prueba";
    if (Tipo == 1) {
        msg = "¡¡¡Posible Area Liberada!!! Prueba¡¡¡Verificar!!!.";
        Color = "#4CAF50";
        Texto = "POSIBLE AREA LIBERADA";
    } else if (Tipo == 2) {
        msg = "¡¡¡Posible Area Radicada!!!Prueba ¡¡¡Verificar!!!.";
        Color = "#D4AF37";
        Texto = "POSIBLE AREA RADICADA";
    } else if (Tipo == 3) {
        msg = "¡¡¡Area Con fecha de Reapertura!!! Prueba  ¡¡¡Verificar!!!.";
        Color = "#2196F3";
        Texto = "AREA CON REAPERTURA";
    } else if (Tipo == 4) {
        msg = Area + " " + Empresa + " ¡¡¡Verificar!!!!.";
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
            user: 'pruebacitas@ceere.net',
            pass: '1998Ceere*'
        }
    });
    var mensaje = msg;
    var mailOptions = {
        from: msg + '"Ceere" <pruebacitas@ceere.net>', //Deje eso quieto Outlook porne demasiados problemas 
        //to: 'jorgecalle@hotmail.com, jorgecaller@gmail.com, alexisaza@hotmail.com, camilodesarrollador@outlook.com, ceereweb@gmail.com, Fernando.pala.99@gmail.com, soportee4@gmail.com, soporte.ceere06068@gmail.com',
        to: 'Fernando.pala.99@gmail.com, soporte.ceere06068@gmail.com',
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
                await addProfesional[1].click();
            }

        }
    }
}