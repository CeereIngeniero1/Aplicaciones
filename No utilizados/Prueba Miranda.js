const { connect } = require('http2');
const puppeteer = require('puppeteer');
var mysql = require('mysql');
const fs = require('fs');
const { Console } = require('console');
const { spawn } = require('child_process');
//var Pin = "20220606144746, 06/JUL/2022";
var Empresa = 'Miranda';
//Originales
var user1 = '56679';
var pass1 = 'MSAColombia2024*';


//var user2 = '84928';
//var pass2 = 'C1000191991*';
var Agente = 0;
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
        if (Pines.substring(i + 1, i + 4) == 'Co:') {
            console.log(Pines.substring(i + 1, i + 4));
            Pin = Pines.substring(i + 4, i + 31);
            break
        }
    }


    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], devtools: false });

    Mineria(browser, 0, Pin);
}





function Mineria(browser, Indicador, Pin) {
    (async () => {
        //Solo se activa cuando el js tiene un agente
        console.log("Esta es la vuelta " + ContadorVueltas);
        /*if (ContadorVueltas > 3) {
            await    browser.close();
            ContadorVueltas = 0 ;
            Pagina();
            if(Agente == 0){
                Agente = 1;
            }else if(Agente == 1){
                Agente = 0;
            }
        } */
        const page = await browser.newPage();
        var exepcion = 0;
        let Primerpaso = setTimeout(() => {
            console.log("ENTRO EN EL PRIMERPASO")
            page.close();
            if (exepcion == 1) {
                Indicador = 1;
            } else {
                Indicador = 0;
            }

            Mineria(browser, Indicador, Pin);

        }, 20000);





        await page.setViewport({ width: 1368, height: 620 });
        await page.goto('https://annamineria.anm.gov.co/sigm/');

        let user = (Agente == 0) ? user1 : user2;
        let pass = (Agente == 0) ? pass1 : pass2;

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

        }, 35000);





        const solicitudes = await page.$x('//span[contains(.,"Solicitudes")]');
        await solicitudes[1].click();

        const lblRadicar = await page.$x('//a[contains(.,"Radicar solicitud de propuesta de contrato de concesión")]');
        await lblRadicar[0].click();
        if (Agente == 1) {
            await page.waitFor(2000);


            //await page.evaluate(() => document.getElementById("submitterPersonOrganizationNameId").value = "")
            await page.evaluate(() => document.getElementById("submitterPersonOrganizationNameId").value = "");

            //await page.waitForSelector('select[id="submitterPersonOrganizationNameId"]');
            //const Agente = await page.$('select[id=" submitterPersonOrganizationNameId"]');

            await page.type('#submitterPersonOrganizationNameId', '76966');
            //await page.type('#submitterPersonOrganizationNameId', '');

            await page.waitFor(3000);

            await page.keyboard.press("Enter");

            await page.waitFor(550);
        }



        await page.waitFor(2500)
        page.setDefaultTimeout(0);
        await page.waitForSelector('select[id="pinSlctId"]');
        const selectPin = await page.$('select[id="pinSlctId"]');
        await selectPin.type(Pin);
        console.log(Pin);

        await page.waitForXPath('//span[contains(.,"Continuar")]');
        const continPin = await page.$x('//span[contains(.,"Continuar")]');
        await continPin[1].click();
        await page.waitFor(1000);

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
                        //await page.waitFor(1000)
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
            document.querySelector('[ng-class="settings.buttonClasses"]').click();

            //document.getElementsByClassName('ng-binding ng-scope').item(178).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(162).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(194).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(177).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(161).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(193).click();

            //document.getElementsByClassName('ng-binding ng-scope').item(162).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(174).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(176).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(178).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(180).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(182).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(192).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(194).click();

            //document.getElementsByClassName('ng-binding ng-scope').item(161).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(173).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(175).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(177).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(179).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(181).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(191).click();
            //document.getElementsByClassName('ng-binding ng-scope').item(193).click();


            document.getElementsByClassName('ng-binding ng-scope').item(178).click();//Oro
            document.getElementsByClassName('ng-binding ng-scope').item(180).click();//PALATA
            document.getElementsByClassName('ng-binding ng-scope').item(182).click();//PLATINO

            document.getElementsByClassName('ng-binding ng-scope').item(181).click();//Oro
            document.getElementsByClassName('ng-binding ng-scope').item(177).click();//PALATA
            document.getElementsByClassName('ng-binding ng-scope').item(179).click();//PLATINO

        })

        clearTimeout(Segundopaso);



        //console.log(Area10);
        var Aviso = 0;
        var contador = 0;
        var Band = 1;
        var IdArea = '';
        var SoloAviso = 0;
        //Solo cuando tiene agente
        // ContadorVueltas++;
        while (Band != 99) {

            console.log("Inicia el timer");
            let TimeArea = setTimeout(() => {
                console.log("ENTRO EN EL TimeArea");
                page.close();
                Mineria(browser, Indicador, Pin);


            }, 20000);

            const selectArea = await page.$('select[name="areaOfConcessionSlct"]');
            await selectArea.type('Otro tipo de terreno');


            const continDetallesdelArea = await page.$x('//a[contains(.,"área")]');
            await continDetallesdelArea[4].click();

            const selectporCeldas = await page.$('select[id="selectedCellInputMethodSlctId"]');
            await selectporCeldas.type('Usando el mapa de selección para dibujar un polígono o ingresar celdas');
            contador++;
            if (contador >= 105) {
                page.close();
                Mineria(browser, Indicador, Pin);
                console.log("entro en los 105");
                clearTimeout(TimeArea);
            }

            console.log(contador);

            console.log("y este es la bandera = " + Band);
            if (Band == 1) {

                /////EL AREA ESTA ABAJO ///////
                IdArea = "Miranda";
                Aviso = 1;
                console.log(IdArea);
                //await page.waitFor(1500);
                page.evaluate(() => {
                    var Area19 = ['18N02J24A01S'];
                    // document.querySelector('[id="cellIdsTxtId"]').value = "";
                    for (let i = 0; i < Area19.length; i++) {
                        document.querySelector('[id="cellIdsTxtId"]').value = document.querySelector('[id="cellIdsTxtId"]').value + Area19[i];
                    }
                    angular.element(document.getElementById('cellIdsTxtId')).triggerHandler('change');
                });
            }
            /* else if (Band == 999) {
 
                 /////EL AREA ESTA ABAJO ///////
                 IdArea = "prueba";
                 Aviso = 1;
                 console.log(IdArea);
                 //await page.waitFor(1500);
                 page.evaluate(() => {
                     var Area19 = ['18N02J24A01S, 18N02J24A01C, 18N02J19M21X, 18N02J19M21Y, 18N02J19M16Y, 18N02J24A01E, 18N02J19M21J, 18N02J24A12A, 18N02J24A07K, 18N02J19M22V, 18N02J19M17A, 18N02J24A12B, 18N02J19M12W, 18N02J24A07C, 18N02J24A07Y, 18N02J24A07U, 18N02J24A07I, 18N02J24A02U, 18N02J19M22I, 18N02J19M17Z, 18N02J19M12Y, 18N02J19M23V, 18N02J19M23A, 18N02J19M18K, 18N02J19M13V, 18N02J24A13B, 18N02J24A08X, 18N02J24A08C, 18N02J19M23N, 18N02J24A03E, 18N02J19M18Z, 18N02J19M18U, 18N02J19M18E, 18N02J19M24K, 18N02J19M24L, 18N02J19M24G, 18N02J19M14R, 18N02J19M24X, 18N02J19M19C, 18N02J24A09T, 18N02J24A04N, 18N02J19M14T, 18N02J24A05V, 18N02J24A04J, 18N02J19M24Z, 18N02J19M14U, 18N02J24A10W, 18N02J19M25G, 18N02J19M20R, 18N02J24A10X, 18N02J24A05C, 18N02J24A05I, 18N02J24A05D, 18N02J19M25I, 18N02J19M20Y, 18N02J19M20I, 18N02J24A15E, 18N02J24A05J, 18N02J24A05E, 18N02J19N21V, 18N02J19N16F, 18N02J19N16B, 18N02J24B06X, 18N02J24B06H, 18N02J24B01X, 18N02J19N21S, 18N02J19N11S, 18N02J19N21D, 18N02J24B06E, 18N02J19N21Z, 18N02J19N21J, 18N02J19N16U, 18N02J19N16J, 18N02J24B12B, 18N02J24B07F, 18N02J24B02V, 18N02J24B02F, 18N02J19N22W, 18N02J19N17Q, 18N02J19N17A, 18N02J19N12R, 18N02J24B07S, 18N02J24B07M, 18N02J19N17X, 18N02J19N12Y, 18N02J24B07E, 18N02J19N22P, 18N02J24A06H, 18N02J19M21C, 18N02J19M16H, 18N02J19M11X, 18N02J19M21D, 18N02J19M16T, 18N02J19M11T, 18N02J19M21U, 18N02J19M22Q, 18N02J19M17K, 18N02J19M17F, 18N02J24A07B, 18N02J24A02W, 18N02J19M17B, 18N02J24A07S, 18N02J24A02S, 18N02J19M22E, 18N02J19M17T, 18N02J24A13A, 18N02J24A08Q, 18N02J24A03K, 18N02J24A03F, 18N02J24A08R, 18N02J24A08L, 18N02J19M13R, 18N02J24A13C, '+
                     '18N02J19M23H, 18N02J19M13X, 18N02J19M13S, 18N02J24A08Y, 18N02J24A08N, 18N02J24A03N, 18N02J19M23D, 18N02J19M18T, 18N02J24A08U, 18N02J24A08P, 18N02J24A03P, 18N02J19M23U, 18N02J19M23P, 18N02J19M23J, 18N02J19M23E, 18N02J24A04V, 18N02J24A04K, 18N02J19M19Q, 18N02J24A04G, 18N02J19M24B, 18N02J19M19B, 18N02J24A09M, 18N02J19M24H, 18N02J24A14D, 18N02J24A10Q, 18N02J24A09J, 18N02J19M25V, 18N02J19M25Q, 18N02J19M24E, 18N02J24A10G, 18N02J24A10B, 18N02J24A05B, 18N02J19M25L, 18N02J19M20G, 18N02J24A10C, 18N02J24A05M, 18N02J19M25H, 18N02J19M20X, 18N02J19M15X, 18N02J24A10T, 18N02J19M25N, 18N02J19M20T, 18N02J24A05Z, 18N02J19M20E, 18N02J19N21Q, 18N02J19N16A, 18N02J19N11V, 18N02J24B06G, 18N02J19N11W, 18N02J24B01S, 18N02J19N21C, 18N02J19N16S, 18N02J19N11X, 18N02J24B11D, 18N02J24B06T, 18N02J24B01T, 18N02J24B06Z, 18N02J24B01J, 18N02J19N21P, 18N02J24B07W, 18N02J24B02A, 18N02J19N22G, 18N02J19N17K, 18N02J19N22S, 18N02J19N12X, 18N02J24B07N, 18N02J24B02N, 18N02J19N22Y, 18N02J19N22T, 18N02J19N17Y, 18N02J24B12E, 18N02J19N22E, 18N02J19N12U, 18N02J24A06X, 18N02J24A06C, 18N02J19M21M, 18N02J19M16M, 18N02J19M16C, 18N02J24A06Y, 18N02J24A01I, 18N02J19M21T, 18N02J19M16I, 18N02J24A01U, 18N02J19M11U, 18N02J19M22K, 18N02J19M17G, 18N02J24A12C, 18N02J24A02H, 18N02J19M22M, 18N02J19M17X, 18N02J19M17C, 18N02J24A07E, 18N02J24A02T, 18N02J24A02N, 18N02J24A02E, 18N02J19M22Z, 18N02J19M22J, 18N02J19M17U, 18N02J19M17N, 18N02J19M23Q, 18N02J19M13Q, 18N02J19M23W, 18N02J19M18G, 18N02J19M18B, 18N02J19M13W, 18N02J24A08S, 18N02J24A03X, 18N02J24A03M, 18N02J24A03C, 18N02J19M23C, 18N02J19M18X, 18N02J24A13D, 18N02J24A08I, 18N02J19M18J, 18N02J24A14A, '+
                     '18N02J19M24V, 18N02J24A09G, 18N02J24A09H, 18N02J24A09C, 18N02J19M24I, 18N02J19M19Y, 18N02J24A09U, 18N02J24A09E, 18N02J24A04Z, 18N02J24A05A, 18N02J19M25A, 18N02J19M20Q, 18N02J19M19P, 18N02J19M20K, 18N02J19M20A, 18N02J19M14Z, 18N02J19M15Q, 18N02J19M25B, 18N02J19M15R, 18N02J24A05H, 18N02J19M25X, 18N02J19M25C, 18N02J19M20C, 18N02J19M15S, 18N02J24A10Y, 18N02J24A10N, 18N02J24A10I, 18N02J19M25Y, 18N02J19M25D, 18N02J19M20N, 18N02J24A10E, 18N02J19M25U, 18N02J19M25J, 18N02J24B01F, 18N02J19N21F, 18N02J19N16W, 18N02J19N16R, 18N02J19N16L, 18N02J24B11C, 18N02J19N16X, 18N02J24B01D, 18N02J24B01Z, 18N02J24B12A, 18N02J24B07A, 18N02J24B02G, 18N02J19N17L, 18N02J24B12C, 18N02J24B02C, 18N02J19N22X, 18N02J19N17S, 18N02J19N17H, 18N02J24B02D, 18N02J19N17T, 18N02J24B02U, 18N02J19N22J, 18N02J24A06S, 18N02J24A01M, 18N02J24A01H, 18N02J24A06N, 18N02J24A06D, 18N02J24A01D, 18N02J19M21I, 18N02J19M11Y, 18N02J19M16Z, 18N02J24A07F, 18N02J19M22A, 18N02J19M17Q, 18N02J24A07L, 18N02J19M22R, 18N02J19M22L, 18N02J19M22B, 18N02J24A07H, 18N02J24A02X, 18N02J19M22C, 18N02J19M12S, 18N02J24A07N, 18N02J24A07J, 18N02J24A02Z, 18N02J24A02P, 18N02J19M22N, 18N02J19M22D, 18N02J19M17D, 18N02J19M12T, 18N02J24A08V, 18N02J24A03W, 18N02J24A03R, 18N02J24A03B, 18N02J19M23L, 18N02J24A03H, 18N02J19M18S, 18N02J24A03T, 18N02J19M23Y, 18N02J19M18D, 18N02J24A08J, 18N02J19M18P, 18N02J19M13Z, 18N02J24A04Q, 18N02J24A04A, 18N02J19M19V, 18N02J19M19K, 18N02J19M19A, 18N02J24A09R, 18N02J24A09B, 18N02J19M19R, 18N02J19M19G, 18N02J24A09S, 18N02J19M19M, 18N02J24A04Y, 18N02J19M24Y, 18N02J19M19I, 18N02J24A05Q, 18N02J24A05F, 18N02J19M24U, 18N02J19M25F, 18N02J19M19J, '+
                     '18N02J24A10R, 18N02J24A10L, 18N02J19M25R, 18N02J24A10M, 18N02J24A10H, 18N02J19M25M, 18N02J24A15D, 18N02J24A10D, 18N02J19M15Y, 18N02J19M15T, 18N02J24A10J, 18N02J19M25E, 18N02J19M20Z, 18N02J19M15U, 18N02J24B11A, 18N02J24B06Q, 18N02J24B06K, 18N02J24B06A, 18N02J19N21A, 18N02J24B06W, 18N02J24B06R, 18N02J24B06L, 18N02J24B06B, 18N02J19N21W, 18N02J19N11R, 18N02J24B06C, 18N02J19N21X, 18N02J19N16H, 18N02J24B01I, 18N02J19N21N, 18N02J19N16Y, 18N02J19N16T, 18N02J24B07Q, 18N02J24B07G, 18N02J24B07B, 18N02J19N22K, 18N02J19N22A, 18N02J19N22B, 18N02J19N17F, 18N02J19N17G, 18N02J24B02M, 18N02J24B07Y, 18N02J24B02Y, 18N02J19N17N, 18N02J24B02Z, 18N02J19N17J, 18N02J24A11C, 18N02J24A06M, 18N02J24A06I, 18N02J24A01Y, 18N02J24A06P, 18N02J24A06J, 18N02J24A06E, 18N02J24A01P, 18N02J19M16U, 18N02J19M16P, 18N02J19M16E, 18N02J24A02K, 18N02J24A02R, 18N02J24A02G, 18N02J19M17W, 18N02J19M17L, 18N02J19M22X, 18N02J19M22H, 18N02J24A07Z, 18N02J19M17E, 18N02J19M12Z, 18N02J19M12U, 18N02J24A08F, 18N02J24A08G, 18N02J19M23R, 18N02J19M23B, 18N02J19M18W, 18N02J24A03S, 18N02J19M23S, 18N02J19M18C, 18N02J24A08T, 18N02J19M18Y, 18N02J19M18N, 18N02J24A08Z, 18N02J24A03Z, 18N02J24A03U, 18N02J19M24Q, 18N02J19M24F, 18N02J19M19F, 18N02J24A14B, 18N02J24A04R, 18N02J24A04X, 18N02J19M24S, 18N02J19M19S, 18N02J19M14X, 18N02J24A04I, 18N02J24A04D, 18N02J24A09P, 18N02J19M19Z, 18N02J24A15C, 18N02J24A05S, 18N02J19M25S, 18N02J24A05Y, 18N02J24A10U, 18N02J19M15Z, 18N02J24B06F, 18N02J24B01L, 18N02J19N21R, 18N02J19N16G, 18N02J19N21M, 18N02J19N21H, 18N02J19N16M, 18N02J19N21T, 18N02J19N16N, 18N02J24B11E, 18N02J24B06P, 18N02J24B01U, 18N02J24B01E, 18N02J19N21E, 18N02J19N16P, 18N02J19N11U, 18N02J24B07L, 18N02J24B02Q, 18N02J24B02R, 18N02J24B02B, 18N02J19N22L, '+
                     '18N02J19N12S, 18N02J19N12T, 18N02J24B07Z, 18N02J24B02E, 18N02J19N17U, 18N02J19N17E, 18N02J19N12Z, 18N02J24A01X, 18N02J24A11D, 18N02J24A06T, 18N02J24A01T, 18N02J24A01N, 18N02J19M21N, 18N02J19M21P, 18N02J19M16J, 18N02J24A07Q, 18N02J24A07A, 18N02J24A02Q, 18N02J24A02F, 18N02J24A02A, 18N02J19M22F, 18N02J19M17V, 18N02J24A02B, 18N02J19M22W, 18N02J24A02M, 18N02J24A02C, 18N02J19M17S, 18N02J19M17M, 18N02J24A07P, 18N02J24A02J, 18N02J19M17Y, 18N02J24A03V, 18N02J19M23K, 18N02J19M18A, 18N02J24A08W, 18N02J19M23G, 18N02J24A08M, 18N02J19M23X, 18N02J19M18M, 18N02J19M18H, 18N02J19M23T, 18N02J19M13T, 18N02J19M13U, 18N02J19M24A, 18N02J24A09W, 18N02J24A04B, 18N02J19M19W, 18N02J19M19L, 18N02J19M14W, 18N02J24A09I, 18N02J19M24T, 18N02J19M24D, 18N02J19M19D, 18N02J24A04E, 18N02J19M24P, 18N02J19M25K, 18N02J19M24J, 18N02J19M19U, 18N02J19M15V, 18N02J24A05R, 18N02J24A05L, 18N02J24A05G, 18N02J19M20W, 18N02J19M20L, 18N02J19M20B, 18N02J19M20H, 18N02J24A05T, 18N02J24A10P, 18N02J19M25Z, 18N02J19M20J, 18N02J24B01K, 18N02J19N16V, 18N02J24B01B, 18N02J19N21L, 18N02J24B06S, 18N02J24B06M, 18N02J24B01M, 18N02J24B06I, 18N02J24B06D, 18N02J19N16I, 18N02J19N16D, 18N02J24B06J, 18N02J19N16E, 18N02J19N11Z, 18N02J24B07K, 18N02J24B02W, 18N02J24B02L, 18N02J19N22V, 18N02J19N17W, 18N02J19N12W, 18N02J24B02H, 18N02J19N22M, 18N02J19N22C, 18N02J24B07D, 18N02J24B02I, 18N02J19N22N, 18N02J19N22D, 18N02J19N22U, 18N02J19N17Z, 18N02J19M21S, 18N02J19M11S, 18N02J19M16D, 18N02J24A11E, 18N02J24A06Z, 18N02J24A06U, 18N02J19M21E, 18N02J24A07V, 18N02J24A02V, 18N02J24A07W, 18N02J24A07R, 18N02J24A07G, 18N02J24A02L, 18N02J19M22G, 18N02J19M12R, 18N02J24A07M, 18N02J19M17H, 18N02J24A12D, 18N02J24A07T, 18N02J24A07D, 18N02J24A02I, 18N02J24A02D, 18N02J19M22Y, 18N02J19M22T, 18N02J19M17P, 18N02J24A08K, 18N02J24A08A, 18N02J24A03A, 18N02J24A03L, 18N02J19M18R, 18N02J24A03Y, 18N02J24A03D, 18N02J19M18I, 18N02J24A13E, 18N02J24A09V, 18N02J24A09Q, 18N02J24A09A, 18N02J19M14V, 18N02J19M14Q, 18N02J24A09L, 18N02J24A04L, 18N02J19M24W, 18N02J19M24R, 18N02J24A14C, 18N02J24A09X, 18N02J24A04S, 18N02J24A04H, 18N02J24A04C, 18N02J19M24C, '+
                     '18N02J19M19X, 18N02J24A09Y, 18N02J19M19T, 18N02J19M19N, 18N02J19M14Y, 18N02J24A14E, 18N02J24A15A, 18N02J24A09Z, 18N02J24A10V, 18N02J24A10F, 18N02J24A04U, 18N02J19M20F, 18N02J24A15B, 18N02J24A05W, 18N02J19M15W, 18N02J24A05X, 18N02J19M20M, 18N02J19M20D, 18N02J24A05U, 18N02J19M25P, 18N02J19M20P, 18N02J24B01V, 18N02J24B01Q, 18N02J24B01A, 18N02J19N16Q, 18N02J24B01G, 18N02J19N21G, 18N02J24B06Y, 18N02J24B06N, 18N02J19N21Y, 18N02J19N21I, 18N02J19N11T, 18N02J24B01P, 18N02J19N21U, 18N02J24B07R, 18N02J19N22F, 18N02J19N17V, 18N02J19N12V, 18N02J19N12Q, 18N02J24B07X, 18N02J19N17M, 18N02J19N17C, 18N02J24B07T, 18N02J24B07I, 18N02J24B02T, 18N02J19N17D, 18N02J24B07J, 18N02J24B02P, 18N02J24B02J, 18N02J19N22Z, 18N02J19M21H, 18N02J19M16X, 18N02J19M16S, 18N02J19M16N, 18N02J24A01Z, 18N02J24A01J, 18N02J19M21Z, 18N02J19M11Z, 18N02J19M12V, 18N02J19M12Q, 18N02J19M17R, 18N02J24A07X, 18N02J19M22S, 18N02J19M12X, 18N02J24A12E, 18N02J24A02Y, 18N02J19M22U, 18N02J19M22P, 18N02J19M17I, 18N02J19M17J, 18N02J24A03Q, 18N02J19M23F, 18N02J19M18V, 18N02J19M18Q, 18N02J19M18F, 18N02J24A08B, 18N02J24A03G, 18N02J19M18L, 18N02J24A08H, 18N02J19M23M, 18N02J24A08D, 18N02J24A03I, 18N02J19M23I, 18N02J19M13Y, 18N02J24A08E, 18N02J24A03J, 18N02J19M23Z, 18N02J24A09K, 18N02J24A09F, 18N02J24A04F, 18N02J24A04W, 18N02J24A04M, 18N02J19M24M, 18N02J19M19H, 18N02J19M14S, 18N02J24A09N, 18N02J24A09D, 18N02J24A04T, 18N02J19M24N, 18N02J24A10K, 18N02J24A10A, 18N02J24A04P, 18N02J24A05K, 18N02J19M20V, 18N02J19M19E, 18N02J19M25W, 18N02J24A10S, 18N02J19M20S, 18N02J24A05N, 18N02J19M25T, 18N02J24A10Z, 18N02J24A05P, 18N02J19M20U, 18N02J24B06V, 18N02J19N21K, 18N02J19N16K, 18N02J19N11Q, 18N02J24B11B, 18N02J24B01W, 18N02J24B01R, 18N02J19N21B, 18N02J24B01H, 18N02J24B01C, 18N02J19N16C, 18N02J24B01Y, 18N02J24B01N, 18N02J19N11Y, 18N02J24B06U, 18N02J19N16Z, 18N02J24B07V, 18N02J24B02K, 18N02J19N22Q, 18N02J19N22R, 18N02J19N17R, 18N02J19N17B, 18N02J24B07H, 18N02J24B07C, 18N02J24B02X, 18N02J24B02S, 18N02J19N22H, 18N02J24B12D, 18N02J19N22I, 18N02J19N17I, 18N02J24B07U, 18N02J24B07P'];
 
 
                     
                     // document.querySelector('[id="cellIdsTxtId"]').value = "";
                     for (let i = 0; i < Area19.length; i++) {
                         document.querySelector('[id="cellIdsTxtId"]').value = document.querySelector('[id="cellIdsTxtId"]').value + Area19[i];
                     }
                     angular.element(document.getElementById('cellIdsTxtId')).triggerHandler('change');
                 });
             }*/


            const continCeldas = await page.$x('//span[contains(.,"Continuar")]');
            await continCeldas[1].click();

            await page.waitFor(3000);

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
                        //Correo(3, IdArea);
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
            clearTimeout(TimeArea);
        }

        console.log("ahhh se salio Y_Y ");
        var bandera = 0;
        var Fin = 0;
        let TimeNOpaso = setTimeout(() => {
            bandera = 99;
            console.log("ENTRO EN EL TimeNOpaso");
            page.close();
            Mineria(browser, Indicador, Pin);
            Fin = 1;
        }, 40000);
        //await page.waitForSelector('select[id="submitterPersonOrganizationNameId"]');
        //await page.waitForSelector('//a[contains(.,"área")]');
        console.log(page.url());
        /* await page.waitForNavigation({
             waitUntil: 'networkidle0',
         });*/
        //await page.waitFor(2000);

        if (Aviso = 0) {
            await page.waitForNavigation({
                waitUntil: 'networkidle0',
            });
        } else {
            //clearTimeout(TimeNOpaso);

            while (bandera != 99) {

                // Fin++;
                await page.waitFor(500);
                console.log(page.url());
                if (page.url() == 'https://annamineria.anm.gov.co/sigm/index.html#/p_CaaIataInputTechnicalEconomicalDetails') {
                    bandera = 99;
                    Fin = 0;
                    console.log("Si cargo la pagina  ");
                } else {

                    console.log("Nada no la carga ");
                }

                /*if(Fin==30){
                    bandera = 99;
                    console.log("ENTRO EN EL TimeNOpaso");
                    page.close();
                    Mineria(browser, Indicador, Pin);
                    break;
                }*/

            }
        }


        clearTimeout(TimeNOpaso);


        if (Fin != 1) {
            var radicacion = '0';
            let RadiPrimero = setTimeout(() => {
                if (radicacion == '0') {
                    console.log("ENTRO EN EL RadiPrimero");
                    page.close();
                    Mineria(browser, Indicador, Pin);
                }

            }, 40000);
        }



        const continDetallesdelArea2 = await page.$x('//a[contains(.,"área")]');
        await continDetallesdelArea2[4].click();

        const grupoEtnicoYN = await page.$('input[value="N"]');
        await grupoEtnicoYN.click();


        const btnInfoTecnica = await page.$x('//a[contains(.,"Información t")]');
        await btnInfoTecnica[0].click();

        //CORREO LIBERADA
        Correo(1, IdArea);
        if (SoloAviso == 1) {
            CorreoAlternativo(1, IdArea);
        }



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

        const selectTipoprofesion = await page.$('select[id="techProfessionalDesignationId"]');
        await selectTipoprofesion.type('Geólogo');
        const selectprofesional = await page.$('select[id="techApplicantNameId"]');
        await selectprofesional.type('OSCAR DARIO VILLADA AGUILAR (73002)');
        await page.waitFor(100);
        const addProfesional = await page.$x('//span[contains(.,"Agregar")]');
        await addProfesional[0].click();

        await page.click('#technicalCheckboxId');

        const btnInfoEconomica = await page.$x('//a[contains(.,"Información eco")]');
        await btnInfoEconomica[0].click();

        console.log('48. Selección de contador');

        const selectContador = await page.$('select[id="ecoProfessionalDesignationId"]');
        await selectContador.type('Contador');
        const selectprofContador = await page.$('select[id="ecoApplicantNameId"]');
        await selectprofContador.type('Daniela Celeste Bracho Raleigh (88876)');
        await page.waitFor(100);
        const addContador = await page.$x('//span[contains(.,"Agregar")]');
        await addContador[1].click();

        console.log('49. Selección de valores');

        await page.evaluate(() => {

            // Check
            document.querySelector('Input[id="declareIndId0"]').click();

            //Valores
            document.getElementById('currentAssetId0').value = '2169714000'

            angular.element(document.getElementById('currentAssetId0')).triggerHandler('change');

            document.getElementById('currentLiabilitiesId0').value = '2841387000'

            angular.element(document.getElementById('currentLiabilitiesId0')).triggerHandler('change');

            document.getElementById('totalAssetId0').value = '48141880000'

            angular.element(document.getElementById('totalAssetId0')).triggerHandler('change');

            document.getElementById('totalLiabilitiesId0').value = '7716101000'

            angular.element(document.getElementById('totalLiabilitiesId0')).triggerHandler('change');


        });



        const btncenti = await page.$x('//a[contains(.,"Certificac")]');
        await btncenti[0].click();


        const anjunPag4 = await page.$x('//span[contains(.,"Adjuntar")]');
        await anjunPag4[0].click();

        // Cuando se complete el código de Node.js, ejecuta el código de Python
        const pythonProcess = spawn('python', ['CONTROLTECLADOMOUSE.py', 'C:\\Aplicaciones\\Sheips\\' + IdArea + '.Zip']);
        pythonProcess.stdout.on('data', (data) => {
        });
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error en el proceso de Python: ${data}`);
        });
        pythonProcess.on('close', (code) => {
            console.log(`El proceso de Python ha findsfalizado con el código de salida ${code}`);
        });



        await page.waitFor(2000);


        const anjunPag2 = await page.$x('//span[contains(.,"Adjuntar")]');
        await anjunPag2[1].click();

        // Cuando se complete el código de Node.js, ejecuta el código de Python
        //Condicion para area con pdf diferente
        try {

            const pythonProcess2 = spawn('python', ['CONTROLTECLADOMOUSE.py', 'C:\\Aplicaciones\\Sheips\\Certificado_Ambiental_' + Empresa + '.pdf']);
            pythonProcess2.stdout.on('data', (data) => {
            });
            pythonProcess2.stderr.on('data', (data) => {
                console.error(`Error en el proceso de Python: ${data}`);
            });
            pythonProcess2.on('close', (code) => {
                console.log(`El proceso de Python ha findsfalizado con el código de salida ${code}`);
            });


        } catch (error) {

        }





        // document.querySelector('[id="acceptanceOfTermsId"]').selected = true;
        await page.waitFor(5000);
        await page.click('#acceptanceOfTermsId');
        await page.waitFor(1000);
        console.log("si llego");



        const continPag4 = await page.$x('//span[contains(.,"Continuar")]');
        await continPag4[1].click();

        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });
        console.log(" si navego ");

        //try {
        console.log('51. Bóton Radicar');

        await page.waitFor(50000000);
        const btnRadicar1 = await page.$x('//span[contains(.,"Radicar")]');
        console.log("Este es el boton radicar : " + btnRadicar1);

        //await page.waitFor(4000);
        console.log("Le di click");
        // await page.waitFor(4000);
        
        radicacion = '1';
        //CORREO RADICACION
        Correo(2, IdArea);



        clearTimeout(RadiPrimero);
        await page.waitFor(20000);
        Mineria(browser, Indicador, Pin);







    })();
}
function Correo(Tipo, Area) {
    // 1. Liberada 2. radicada 3. Fecha reapertura
    var msg = "";
    if (Tipo == 1) {
        msg = "Posible Area Liberada!!!!! " + Empresa + " " + Area + " .Verificar!!!!.";
    } else if (Tipo == 2) {
        msg = "Posible Area Radicada!!!!! " + Empresa + " " + Area + " .Verificar!!!!.";
    } else if (Tipo == 3) {
        msg = "Area Con fecha de Reapertura!!!!! " + Empresa + " " + Area + " .Verificar!!!!.";
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
        from: mensaje + '"Our Code World " <pruebacitas@ceere.net>', //Deje eso quieto Outlook porne demasiados problemas 
        //to: 'jorgecalle@hotmail.com, jorgecaller@gmail.com, alexisaza@hotmail.com, gmcalle@yahoo.com, ceereweb@gmail.com, Fernando.pala.99@gmail.com, soportee4@gmail.com, soporte.ceere06068@gmail.com ',
        to: ' ceereweb@gmail.com, Fernando.pala.99@gmail.com',
        subject: 'LA AREA ES --> ' + Area,
        text: 'LA AREA ES -->  ' + Area,
        html: 'LA AREA ES -->  ' + Area // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(errorWW);
        }

        console.log('Message sent: ' + info.response);
    });




}



/*
    Fj Suarez


    //////////////////		/////////////////////			
    /////			             /////	
    //////////////		        /////	
    /////			           /////	
    /////		        ////  /////	
    /////		        //// /////	
    /////                //////      


*/

