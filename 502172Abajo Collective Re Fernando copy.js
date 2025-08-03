const puppeteer = require("puppeteer");
const fs = require("fs");
const { Console } = require("console");
const { keyboard, mouse, Key, clipboard } = require("@nut-tree-fork/nut-js");
const colors = require("colors");

const os = require("os");
const NombreEquipo = os.hostname();
const EquiposGenerales = {
  HPGRIS: "EQUIPO CREADOR",
  "DESKTOP-6JICI9S": "ASUS OLD",
  "DESKTOP-SNSPTLM": "DELLC3",
  "LAPTOP-2VU2EBUO": "EQUIPO VALEN",
  HPRED240: "FER EQUIPO",
  "LAPTOP-JL0BL28F": "JORGE EQUIPO",
  MERCADEO: "MERCADEO",
  "DESKTOP-RF3NUO3": "PIXEL",
  HPRED241: "FERCHO ingeniero en sistemas best",
};

const EquipoActual = EquiposGenerales[NombreEquipo];
// Actualizado
var Empresa = "Collective";
var user1 = "76966";
var pass1 = "Collectivemining.2025.";
var user2 = "83955";
var pass2 = "wX2*dQ3*cS";
var Agente = 1;
var EnviarCorreosParaPestanas = 0;
var contreapertura = 0;
var ContadorVueltas = 0;

Pagina();
async function Pagina() {
  var Pines = fs.readFileSync(
    "Pin.txt",
    "utf-8",
    (prueba = (error, datos) => {
      if (error) {
        throw error;
      } else {
        console.log(datos);
      }
    })
  );
  for (let i = 0; i < Pines.length; i++) {
    if (Pines.substring(i + 1, i + 4) == "C1:") {
      console.log(Pines.substring(i + 1, i + 4));
      Pin = Pines.substring(i + 4, i + 31);
      break;
    }
  }

  const pathToExtension = "C:\\Aplicaciones\\Exte\\0.2.1_0";

  const browser = await puppeteer.launch({
    //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    executablePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    // Reemplaza con la ruta real a tu Google Chrome
    headless: false,
    args: [
      "--start-maximized",
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
    devtools: false,
  });

  Mineria(browser, Pin);
}

function Mineria(browser, Pin) {
  (async () => {
    console.log("Esta es la vuelta " + ContadorVueltas);
    const page = await browser.newPage();

    let Primerpaso = setTimeout(() => {
      console.log("ENTRO EN EL PRIMERPASO");

      page.close();
      Mineria(browser, Pin);
    }, 20000);

    await page.setViewport({ width: 1368, height: 620 });
    await page.goto("https://annamineria.anm.gov.co/sigm/");

    let user = Agente == 0 ? user1 : user2;
    let pass = Agente == 0 ? pass1 : pass2;

    try {
      console.log(user);
      console.log(pass);
      await page.type("#username", user);
      await page.type("#password", pass);

      page.click("#loginButton");
    } catch (ex) {
      console.log("Entro en el catch");
    }

    page.setDefaultTimeout(0);
    try {
      await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 5000, // 5 segundos en milisegundos
      });
    } catch (error) {
      if (error instanceof puppeteer.errors.TimeoutError) {
        console.log("La navegación tardó más de 5 segundos.");
        // Aquí puedes manejar la situación cuando se supera el tiempo de espera
      } else {
        throw error; // Lanzar el error si no es un TimeoutError
      }
    }
    validador = 0;
    clearTimeout(Primerpaso);

    const solicitudes = await page.$x('//span[contains(.,"Solicitudes")]');
    await solicitudes[1].click();

    const lblRadicar = await page.$x(
      '//a[contains(.,"Radicar solicitud de propuesta de contrato de concesión")]'
    );
    await lblRadicar[0].click();
    if (Agente == 1) {
      await page.waitForTimeout(2000);

      //await page.evaluate(() => document.getElementById("submitterPersonOrganizationNameId").value = "")
      await page.evaluate(
        () =>
          (document.getElementById("submitterPersonOrganizationNameId").value =
            "")
      );

      //await page.waitForSelector('select[id="submitterPersonOrganizationNameId"]');
      //const Agente = await page.$('select[id=" submitterPersonOrganizationNameId"]');

      await page.type("#submitterPersonOrganizationNameId", "76966");
      //await page.type('#submitterPersonOrganizationNameId', '');

      await page.waitForTimeout(3000);

      await page.keyboard.press("Enter");

      await page.waitForTimeout(550);
    }

    await page.waitForTimeout(2500);
    page.setDefaultTimeout(0);
    await page.waitForSelector('select[id="pinSlctId"]');
    const selectPin = await page.$('select[id="pinSlctId"]');
    await selectPin.type(Pin);
    console.log(Pin);

    /* VALIDAR SI EL PIN ESTÁ PRÓXIMO A VENCERSE */
    // Capturar todas las opciones de un select
    const allOptions = await page.evaluate((select) => {
      const options = Array.from(select.options); // Convierte las opciones a un array
      return options.map((option) => option.textContent); // Retorna un array con el texto de cada opción
    }, selectPin);

    console.log("Todas las opciones:", allOptions);

    const closestDateOption = await page.evaluate(() => {
      const select = document.querySelector("select");

      const monthMap = {
        ENE: "01",
        FEB: "02",
        MAR: "03",
        ABR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AGO: "08",
        SEP: "09",
        OCT: "10",
        NOV: "11",
        DIC: "12",
      };

      const options = Array.from(select.options).map((option) => {
        const text = option.textContent; // Ejemplo: "20241108074024, 08/DIC/2024"
        const dateText = text.split(", ")[1]; // Extraer la fecha: "08/DIC/2024"

        const [day, monthName, year] = dateText.split("/");
        const month = monthMap[monthName];
        const formattedDate = new Date(`${year}-${month}-${day}`);

        return { text, date: formattedDate };
      });

      const now = new Date();

      const differences = options.map((option) => {
        const diff = Math.abs(option.date - now);
        return { text: option.text, diff }; // Retornar la diferencia y el texto
      });

      console.log("Diferencias calculadas:", differences);

      // Reducir para encontrar la fecha más cercana
      const closest = options.reduce((prev, curr) => {
        return Math.abs(curr.date - now) < Math.abs(prev.date - now)
          ? curr
          : prev;
      });

      return closest.text;
    });

    console.log("Opción más cercana a la fecha actual:", closestDateOption);
    const input = closestDateOption;
    /* FIN => VALIDACIÓN SI EL PIN ESTÁ PRÓXIMO A VENCERSE */

    await page.waitForXPath('//span[contains(.,"Continuar")]');
    const continPin = await page.$x('//span[contains(.,"Continuar")]');
    // await continPin[1].click();

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });

    await page.waitForSelector('button[ng-class="settings.buttonClasses"]');
    page.evaluate(() => {
      /* SELECCIONAR MINERALES POR NOMBRE */
      document.querySelector('[ng-class="settings.buttonClasses"]').click();

      // SE OBTIENEN LOS ELEMENTOS QUE TIENEN LA CLASE 'ng-binding ng-scope'
      var elementos = document.getElementsByClassName("ng-binding ng-scope");

      let Minerales = [
        "COBRE",
        "cobre",
        "MOLIBDENO",
        "molibdeno",
        "NIQUEL",
        "niquel",
        "ORO",
        "oro",
        "PLATA",
        "plata",
        "PLATINO",
        "platino",
        "WOLFRAMIO",
        "wolframio",
        "ZINC",
        "zinc",
      ];
      let elementosConMinerales = [];

      // ITERA SOBRE TODOS LOS ELEMENTOS CON CLASE (ng-binding ng-scope)
      for (let i = 0; i < elementos.length; i++) {
        let elemento = elementos[i];
        let agregarElemento = false;

        // ITERA SOBRE TODOS LOS VALORES DE LA LISTA MINERALES
        for (let c = 0; c < Minerales.length; c++) {
          // VERIFICA SI EL TEXTO DEL ELEMENTO CONTIENE EXACTAMENTE EL MINERAL EN PROCESO DE LA LISTA DE MINERALES
          if (
            elemento.textContent.includes(Minerales[c]) &&
            elemento.textContent.split(/\s+/).includes(Minerales[c])
          ) {
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

    //console.log(Area10);
    var Aviso = 0;
    var contador = 0;
    var Band = 1;
    var IdArea = "";
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
        console.log("Aviso");
        Filtrado = `${areaFiltrado.join(", ")}`;
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
      await selectArea.type("Otro tipo de terreno");

      const continDetallesdelArea = await page.$x('//a[contains(.,"área")]');
      await continDetallesdelArea[4].click();

      const selectporCeldas = await page.$(
        'select[id="selectedCellInputMethodSlctId"]'
      );
      await selectporCeldas.type(
        "Usando el mapa de selección para dibujar un polígono o ingresar celdas"
      );
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
        const AreaCeldas = Area[0].split(",").map((celda) => celda.trim());
        console.log(Area);
        page.evaluate(
          ({ Area }) => {
            document.querySelector('[id="cellIdsTxtId"]').value = Area.join("");
            angular
              .element(document.getElementById("cellIdsTxtId"))
              .triggerHandler("change");
          },
          { Area }
        );

        DetallesCompletos = {
          IdArea: IdArea,
          Aviso: Aviso,
          Celda: Celda,
          Area: Area,
          Comas: Comas,
          ComparacionCeldas: AreaCeldas, // Usa el array de celdas limpio
        };

        return DetallesCompletos;
      }
      if (Band == 1) {
        MonitorearAreas(
          "502172", //Nombre del area
          1, // aviso
          "18N05E04D03F", // ceda de correo
          [
            " 18N05E04D03C, 18N05E04D02U, 18N05N14M12R, 18N05E04D03A, 18N05E04D02J, 18N05E04D02E, 18N05E04D03D, 18N05E04D03E, 18N05E04D04B, 18N05E04D03L, 18N05E04D04A, 18N05E04D04C, 18N05E04D03G, 18N05E04D02P, 18N05E04D03K, 18N05E04D03H ",
          ], // Celdas de area
          0 // comas
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

      const Todoslosparametros = await page.$$eval("span", (links) =>
        links.map((link) => link.textContent)
      );
      var cont = 1;
      for (let i = 0; i < Todoslosparametros.length; i++) {
        const elemento = Todoslosparametros[i];
        if (
          elemento == "Vea los errores a continuación (dentro de las pestañas):"
        ) {
          cont = 0;
        }
      }

      /* CODIGO PARA REORGANIZAR AREA CON CELDAS NO DISPONIBLES, INFERIOR A LA INICIAL */
      // Extraer celdas no disponibles del DOM
      const celdasNoDisponibles = await page.$$eval("a.errorMsg", (links) => {
        return links
          .filter((link) =>
            link.textContent.includes(
              "Las siguientes celdas de selección no están disponibles:"
            )
          )
          .map((link) =>
            link.textContent
              .split(": ")[1]
              .split(",")
              .map((celda) => celda.trim())
          ); // Extrae las celdas y las limpia
      });

      console.log(
        `===============================================================================================`
          .cyan.bold
      );
      // console.log(`AREA COMPLETA => ${Area}`);
      // console.log(`CELDAS NO DISPONIBLES => ${celdasNoDisponibles}`);

      console.log(`ÁREA COMPLETA => `.magenta.bold);
      console.log(`[${Area}]`);
      console.log(`CELDAS NO DISPONIBLES => `.red.bold);
      console.log(`[${celdasNoDisponibles}]`);

      if (celdasNoDisponibles.length > 0) {
        // Tipo, Area, Celda

        // Crear una lista de celdas no disponibles (eliminando espacios innecesarios)
        const celdasNoDisponiblesLimpias = celdasNoDisponibles[0].map((celda) =>
          celda.trim()
        );

        // Asegurarse de que 'ComparacionCeldas' esté correctamente dividido en celdas
        const areaCeldas = ComparacionCeldas;

        // Filtrar el arreglo 'areaCeldas' para excluir las celdas no disponibles
        areaFiltrado = areaCeldas.filter(
          (celda) => !celdasNoDisponiblesLimpias.includes(celda)
        );

        ////Correo(1, Area, areaFiltrado);

        // Mostrar el nuevo arreglo que no contiene las celdas no disponibles
        // console.log('ÁREA MONTADA EXCLUYENDO LAS CELDAS QUE NO ESTÁN DISPONIBLES => ', areaFiltrado);
        // console.log(`ÁREA MONTADA EXCLUYENDO LAS CELDAS QUE NO ESTÁN DISPONIBLES => `.green.bold);
        console.log(`CELDAS DISPONIBLES => `.green.bold);
        console.log(`["${areaFiltrado.join(", ")}"],`);
        console.log(
          `===============================================================================================`
            .cyan.bold
        );

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
        console.log("No se encontraron celdas no disponibles.");
        console.log(
          `===============================================================================================`
            .cyan.bold
        );
      }
      /* FIN FIN FIN */

      // await page.waitForTimeout(2000000);
      const FechaReapertura = await page.$$eval("a", (links) =>
        links.map((link) => link.textContent)
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
      if (
        page.url() ==
        "https://annamineria.anm.gov.co/sigm/index.html#/p_CaaIataInputTechnicalEconomicalDetails"
      ) {
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
    //Correo(1, IdArea, Celda);

    let RadiPrimero = setTimeout(() => {
      // console.log("ENTRO EN EL RadiPrimero");
      // page.close();
      // Mineria(browser,  Pin);
    }, 30000);

    await page.evaluate(() => {
      document.querySelector('[id="yearOfExecutionId0"]').value = "number:1";

      angular
        .element(document.getElementById("yearOfExecutionId0"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId0"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId0"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId0"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId0"))
        .triggerHandler("change");

      //Contactos con la comunidad y enfoque social

      document.querySelector('[id="yearOfExecutionId1"]').value = "number:1";

      angular
        .element(document.getElementById("yearOfExecutionId1"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId1"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId1"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId1"]').value = "TSCA";

      angular
        .element(document.getElementById("laborSuitabilityId1"))
        .triggerHandler("change");

      //Base topográfica del área

      document.querySelector('[id="yearOfExecutionId2"]').value = "number:1";

      angular
        .element(document.getElementById("yearOfExecutionId2"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId2"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId2"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId2"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId2"))
        .triggerHandler("change");

      //Cartografía geológica

      document.querySelector('[id="yearOfExecutionId3"]').value = "number:1";

      angular
        .element(document.getElementById("yearOfExecutionId3"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId3"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId3"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId3"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId3"))
        .triggerHandler("change");

      //Excavación de trincheras y apiques

      document.querySelector('[id="yearOfExecutionId4"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId4"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId4"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId4"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId4"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId4"))
        .triggerHandler("change");

      //Geoquímica y otros análisis

      document.querySelector('[id="yearOfExecutionId5"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId5"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId5"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId5"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId5"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId5"))
        .triggerHandler("change");

      //Geofísica

      document.querySelector('[id="yearOfExecutionId6"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId6"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId6"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId6"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId6"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId6"))
        .triggerHandler("change");

      //Estudio de dinámica fluvial del cauce

      document.querySelector('[id="yearOfExecutionId7"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId7"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId7"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId7"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId7"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId7"))
        .triggerHandler("change");

      // Características hidrológicas y sedimentológicas del cauce

      document.querySelector('[id="yearOfExecutionId8"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId8"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId8"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId8"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId8"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId8"))
        .triggerHandler("change");

      //Pozos y Galerías Exploratorias

      document.querySelector('[id="yearOfExecutionId9"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId9"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId9"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId9"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId9"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId9"))
        .triggerHandler("change");

      //Perforaciones profundas

      document.querySelector('[id="yearOfExecutionId10"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId10"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId10"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId10"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId10"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId10"))
        .triggerHandler("change");

      //Muestreo y análisis de calidad

      document.querySelector('[id="yearOfExecutionId11"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId11"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId11"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId11"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId11"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId11"))
        .triggerHandler("change");

      //Estudio geotécnico

      document.querySelector('[id="yearOfExecutionId12"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId12"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId12"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId12"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId12"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId12"))
        .triggerHandler("change");

      //Estudio Hidrológico

      document.querySelector('[id="yearOfExecutionId13"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId13"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId13"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId13"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId13"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId13"))
        .triggerHandler("change");

      //Estudio Hidrogeológico

      document.querySelector('[id="yearOfExecutionId14"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfExecutionId14"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId14"]').value = "number:2";

      angular
        .element(document.getElementById("yearOfDeliveryId14"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId14"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId14"))
        .triggerHandler("change");

      //Evaluación del modelo geológico

      document.querySelector('[id="yearOfExecutionId15"]').value = "number:3";

      angular
        .element(document.getElementById("yearOfExecutionId15"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId15"]').value = "number:3";

      angular
        .element(document.getElementById("yearOfDeliveryId15"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId15"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId15"))
        .triggerHandler("change");

      //Actividades exploratorias adicionales (Se describe en el anexo Tecnico que se allegue)

      document.querySelector('[id="yearOfExecutionId16"]').value = "number:3";

      angular
        .element(document.getElementById("yearOfExecutionId16"))
        .triggerHandler("change");

      document.querySelector('[id="yearOfDeliveryId16"]').value = "number:3";

      angular
        .element(document.getElementById("yearOfDeliveryId16"))
        .triggerHandler("change");

      document.querySelector('[id="laborSuitabilityId16"]').value = "IIG";

      angular
        .element(document.getElementById("laborSuitabilityId16"))
        .triggerHandler("change");

      // Actividades Ambientales etapa de exploración

      //Selección optima de Sitios de Campamentos y Helipuertos

      angular
        .element(document.getElementById("envYearOfDeliveryId0"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId0"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId0"))
        .triggerHandler("change");

      //Manejo de Aguas Lluvias

      angular
        .element(document.getElementById("envYearOfDeliveryId1"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId1"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId1"))
        .triggerHandler("change");

      //Manejo de Aguas Residuales Domesticas

      angular
        .element(document.getElementById("envYearOfDeliveryId2"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId2"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId2"))
        .triggerHandler("change");

      //Manejo de Cuerpos de Agua

      angular
        .element(document.getElementById("envYearOfDeliveryId3"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId3"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId3"))
        .triggerHandler("change");

      //Manejo de Material Particulado y Gases

      angular
        .element(document.getElementById("envYearOfDeliveryId4"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId4"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId4"))
        .triggerHandler("change");

      //Manejo del Ruido

      angular
        .element(document.getElementById("envYearOfDeliveryId5"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId5"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId5"))
        .triggerHandler("change");

      // Manejo de Combustibles

      angular
        .element(document.getElementById("envYearOfDeliveryId6"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId6"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId6"))
        .triggerHandler("change");

      //Manejo de Taludes

      angular
        .element(document.getElementById("envYearOfDeliveryId7"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId7"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId7"))
        .triggerHandler("change");

      //Manejo de Accesos

      angular
        .element(document.getElementById("envYearOfDeliveryId8"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId8"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId8"))
        .triggerHandler("change");

      // Manejo de Residuos Solidos

      angular
        .element(document.getElementById("envYearOfDeliveryId9"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId9"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId9"))
        .triggerHandler("change");

      //Adecuación y Recuperación de Sitios de Uso Temporal

      angular
        .element(document.getElementById("envYearOfDeliveryId10"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId10"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId10"))
        .triggerHandler("change");

      //Manejo de Fauna y Flora

      angular
        .element(document.getElementById("envYearOfDeliveryId11"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId11"]').value = "IFEB";

      angular
        .element(document.getElementById("envLaborSuitabilityId11"))
        .triggerHandler("change");

      //Plan de Gestión Social

      angular
        .element(document.getElementById("envYearOfDeliveryId12"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId12"]').value = "TSCA";

      angular
        .element(document.getElementById("envLaborSuitabilityId12"))
        .triggerHandler("change");

      //capacitación de Personal

      angular
        .element(document.getElementById("envYearOfDeliveryId13"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId13"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId13"))
        .triggerHandler("change");

      //Contratación de Mano de Obra no Calificada

      angular
        .element(document.getElementById("envYearOfDeliveryId14"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId14"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId14"))
        .triggerHandler("change");

      //Rescate Arqueológico

      angular
        .element(document.getElementById("envYearOfDeliveryId15"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId15"]').value = "ARQ";

      angular
        .element(document.getElementById("envLaborSuitabilityId15"))
        .triggerHandler("change");

      //Manejo de Hundimientos

      angular
        .element(document.getElementById("envYearOfDeliveryId16"))
        .triggerHandler("change");

      document.querySelector('[id="envLaborSuitabilityId16"]').value = "MULT";

      angular
        .element(document.getElementById("envLaborSuitabilityId16"))
        .triggerHandler("change");
    });

    // SELECCIÓN DE PROFESIONALES => CONTADOR(ES), GEÓLOGO(S), INGENIERO(S) GEÓLOGO(S), INGENIERO(S) DE MINAS
    // ==============================================================================
    console.log("INICIA LA SELECCIÓN DE LOS PROFESIONALES");
    console.log(
      "================================================================"
    );
    let profesionales = [
      { tipo: "Geólogo", nombres: ["Oscar Javier Pinilla Reyes (73619)"] },
      //  { tipo: "Ingeniero Geólogo", nombres: [""]},
      //  { tipo: "Ingeniero de Minas", nombres: [""]}
    ];

    await seleccionar_Profesional(profesionales, page, 1);

    // Hacer clic en el botón "Agregar"
    const addProfesional = await page.$x('//span[contains(.,"Agregar")]');
    await addProfesional[0].click();

    console.log(
      "================================================================"
    );
    console.log("FIN DE LA SELECCIÓN DE LOS PROFESIONALES");
    // =============================================================================

    // Acepta terminos y da clic en continuar
    await page.click("#technicalCheckboxId");
    const btnInfoEconomica = await page.$x(
      '//a[contains(.,"Información eco")]'
    );
    await btnInfoEconomica[0].click();

    // SELECCIÓN DEL CONTADOR
    // ==============================================================================
    console.log("INICIA LA SELECCIÓN DE CONTADOR(ES)");
    console.log(
      "================================================================"
    );
    let Contador_es = [
      { tipo: "Contador", nombres: ["PABLO ESTEBAN MONTOYA MONTOYA (91124)"] },
    ];

    await seleccionar_Profesional(Contador_es, page, 2);

    console.log(
      "================================================================"
    );
    console.log("FIN DE LA SELECCIÓN DE CONTADOR(ES)");
    // ==============================================================================

    // SELECCIÓN DE LOS VALORES
    // ==============================================================================
    await page.waitForSelector("#personClassificationId0");
    await page.select("#personClassificationId0", "PJ");
    await page.evaluate(() => {
      // Check
      // document.querySelector('Input[id="declareIndId0"]').click();

      //Valores
      // document.getElementById('currentAssetId0').value = '42539369275' // OLD
      document.getElementById("activoCorrienteId0").value = "31049615000";

      angular
        .element(document.getElementById("activoCorrienteId0"))
        .triggerHandler("change");

      // document.getElementById('currentLiabilitiesId0').value = '15184416062' // OLD
      document.getElementById("pasivoCorrienteId0").value = "7024772000";

      angular
        .element(document.getElementById("pasivoCorrienteId0"))
        .triggerHandler("change");

      // document.getElementById('totalAssetId0').value = '48322540755' // OLD
      document.getElementById("activoTotalId0").value = "193966804000";

      angular
        .element(document.getElementById("activoTotalId0"))
        .triggerHandler("change");

      // document.getElementById('totalLiabilitiesId0').value = '15401226207' // OLD
      document.getElementById("pasivoTotalId0").value = "7345458000";

      angular
        .element(document.getElementById("pasivoTotalId0"))
        .triggerHandler("change");
    });
    // ==============================================================================

    const continPag4 = await page.$x('//span[contains(.,"Continuar")]');
    await continPag4[1].click();
    // Esperar la navegación
    await page.waitForNavigation({
      waitUntil: "networkidle0",
      // timeout: 2000 // Ajusta el timeout según tus necesidades
    });
    clearTimeout(RadiPrimero);
    let Radisegundo = setTimeout(() => {
      console.log("ENTRO EN EL Radisegundo");
      //page.close();
      Mineria(browser, Pin);
    }, 30000);

    console.timeEnd("Deteccion a adjuntar");
    const btncenti = await page.$x('//a[contains(.,"Certificac")]');
    await btncenti[0].click();

    // await page.waitForTimeout(200);
    console.log("Vamos aca");

    // await page.waitForTimeout(200);

    await page.waitForSelector(`#p_CaaCataEnvMandatoryDocumentToAttachId0`);
    const RutaDelArchivoo = `C:\\Aplicaciones\\Documentos\\${Empresa}\\Sheips\\${IdArea}.zip`;
    const ElementoControladorDeCargaaa = await page.$(
      `#p_CaaCataEnvMandatoryDocumentToAttachId0`
    );
    await ElementoControladorDeCargaaa.uploadFile(RutaDelArchivoo);

    console.log("YA ESCRIBIO a");

    // await page.waitForTimeout(1000);

    try {
      let ArchivoAmbiental;
      if (IdArea == "509188") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509188.pdf`;
      } else if (IdArea == "503239") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\503239.pdf`;
      } else if (IdArea == "RFE_08211") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08211.pdf`;
      } else if (IdArea == "RFE_08A") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08A.pdf`;
      } else if (IdArea == "RFE_08B") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\RFE_08B.pdf`;
      } else if (
        IdArea == "Riosucio598" ||
        IdArea == "supia" ||
        IdArea == "supiaincompleto"
      ) {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\QCO-08032.pdf`;
      } else if (IdArea == "507948sincelda") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\507948sincelda.pdf`;
      } else if (IdArea == "509136") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\509136.pdf`;
      } else if (IdArea == "CollectiveCAG_141") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\CollectiveCAG_141.pdf`;
      } else if (IdArea == "697_17") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\697_17.pdf`;
      } else if (IdArea == "502172") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\502172.pdf`;
      } else if (IdArea == "671_17") {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\671_17.pdf`;
      } else {
        ArchivoAmbiental = `C:\\Aplicaciones\\Documentos\\${Empresa}\\CertificadoAmbiental\\Certificado_Ambiental.pdf`;
      }

      await page.waitForSelector(`#p_CaaCataEnvMandatoryDocumentToAttachId1`);
      const RutaDelArchivoo = ArchivoAmbiental;
      const ElementoControladorDeCargaaa = await page.$(
        `#p_CaaCataEnvMandatoryDocumentToAttachId1`
      );
      await ElementoControladorDeCargaaa.uploadFile(RutaDelArchivoo);

      // await page.waitForTimeout(300);
      await page.click("#acceptanceOfTermsId");
      console.log("Ahora Vamos aca 3333333");
      // await page.waitForTimeout(300);

      const btnDocuSopor = await page.$x('//a[contains(.,"Documentac")]');
      await btnDocuSopor[0].click();
      console.log("si llego");
      await page.waitForTimeout(300);

      console.log("INICIA PROCESO DE ADJUNTAR DOCUMENTOS REGLAMENTARIOS");
      console.log(
        "================================================================"
      );

      let Documentos = [
        "1. Aceptacion Del Profesional Para Refrendar Documentos Tecnicos.pdf", //1
        "2. Fotocopia Tarjeta Profesional.pdf", //2
        "4. Declaracion De Renta Proponente 1 Anio 1.pdf", //3
        "5. Declaracion De Renta Proponente 1 Anio 2.pdf", //4
        "6. Estados Financieros Propios Certificados Y O Dictaminados Proponente 1 Anio 1.pdf", //5
        "7. Estados Financieros Propios Certificados Y O Dictaminados Proponente 1 Anio 2.pdf", //6
        "8. Extractos Bancarios Proponente 1.pdf", //7
        "9. RUT.pdf", //8
        "10. Fotocopia Documento De Identificacion.pdf", //9
        "11. Certificado De Composicion Accionaria De La Sociedad.pdf", //10
        "12. Certificado De Existencia Y Representacion Legal.pdf", //11
        "13. Certificado Vigente De Antecedentes Disciplinarios.pdf", //12
        "14. Fotocopia Tarjeta Profesional Del Contador Revisor Fiscal.pdf", //13
      ];

      let ElementosFile = [
        "p_CaaCataMandatoryDocumentToAttachId0", //1
        "p_CaaCataMandatoryDocumentToAttachId1", //2
        "p_CaaCataMandatoryDocumentToAttachId3", //3
        "p_CaaCataMandatoryDocumentToAttachId4", //4
        "p_CaaCataMandatoryDocumentToAttachId5", //5
        "p_CaaCataMandatoryDocumentToAttachId6", //6
        "p_CaaCataMandatoryDocumentToAttachId7", //7
        "p_CaaCataMandatoryDocumentToAttachId8", //8
        "p_CaaCataMandatoryDocumentToAttachId9", //9
        "p_CaaCataMandatoryDocumentToAttachId10", //10
        "p_CaaCataMandatoryDocumentToAttachId11", //11
        "p_CaaCataMandatoryDocumentToAttachId12", //12
        "p_CaaCataMandatoryDocumentToAttachId13", //13
        // "p_CaaCataMandatoryDocumentToAttachId14"//14
      ];
      console.log(ElementosFile.length);
      try {
        for (let i = 0; i < ElementosFile.length; i++) {
          try {
            await page.waitForSelector(`#${ElementosFile[i]}`);
            const RutaDelArchivo = `C:\\Aplicaciones\\Documentos\\${Empresa}\\DocumentosReglamentarios\\${Documentos[i]}`;
            const ElementoControladorDeCarga = await page.$(
              `#${ElementosFile[i]}`
            );
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
        console.error("Error general al adjuntar archivos:", error);
      }

      console.log(
        "================================================================"
      );
      console.log("FINALIZA PROCESO DE ADJUNTAR DOCUMENTOS REGLAMENTARIOS");

      // await page.waitForTimeout(2000);
    } catch (error) {
      console.log("BOTO ERROR");
    }

    const continPag = await page.$x('//span[contains(.,"Continuar")]');

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    console.log(" si navego ");

    clearTimeout(Radisegundo);
    await page.waitForTimeout(180000);
    Mineria(browser, Pin);
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
      selectTipoProfesion = await page.$(
        'select[id="techProfessionalDesignationId"]'
      );
    } else {
      selectTipoProfesion = await page.$(
        'select[id="ecoProfessionalDesignationId"]'
      );
    }

    await selectTipoProfesion.type(tipoProfesional);

    // Iterar sobre los nombres y seleccionar cada uno en el segundo select
    for (const nombre of nombres) {
      console.log(
        "Tipo Profesional: " +
          tipoProfesional +
          " - " +
          "Nombres: " +
          "(" +
          nombre +
          ")"
      );
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
          console.log(`Bro manito sabe que  pilke -> ${error}`);
        }
        try {
          await addProfesional[1].click();
        } catch (error) {
          console.log("ERR 1");
          console.log(`Bro manito sabe que  pilke -> ${error}`);
        }
        try {
          await addProfesional[2].click();
        } catch (error) {
          console.log("ERR 2");
          console.log(`Bro manito sabe que  pilke -> ${error}`);
        }
        try {
          await addProfesional[3].click();
        } catch (error) {
          console.log("ERR 3");
          console.log(`Bro manito sabe que  pilke -> ${error}`);
        }
        try {
          await addProfesional[4].click();
        } catch (error) {
          console.log("ERR 4");
          console.log(`Bro manito sabe que  pilke -> ${error}`);
        }
      }
    }
  }
}
