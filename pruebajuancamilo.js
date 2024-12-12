

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
const Empresa = "Anuel";
Correo(1,'Prueba', 'jijiji', EquipoActual)


function Correo(Tipo, Area, Celda, EquipoActual) {
    // 1. Liberada 2. radicada 3. Fecha reapertura
    var msg = "";
    var Color = "";
    var Texto = "";
    //Area = "Tranquilos area de prueba";
    if (Tipo == 1) {
        msg = "¡¡¡Posible Area Liberada!!! " + Empresa + " " + Area + " ¡¡¡Verificar!!!.";
        Color = "#4CAF50";
        Texto = "POSIBLE AREA LIBERADA";
    } else if (Tipo == 2) {
        msg = "¡¡¡Posible Area Radicada!!! " + Empresa + " " + Area + " ¡¡¡Verificar!!!.";
        Color = "#D4AF37";
        Texto = "POSIBLE AREA RADICADA";
    } else if (Tipo == 3) {
        msg = "¡¡¡Area Con fecha de Reapertura!!! " + Empresa + " " + Area + " ¡¡¡Verificar!!!.";
        Color = "#2196F3";
        Texto = "AREA CON REAPERTURA";
    } else if (Tipo == 4) {
        msg = `Proximo Pin A Vencerse -> ${Area}`;
        Color = "#FE7401";
        Texto = "PIN PRÓXIMO A VENCERSE";
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
            user: 'correomineria@ceere.net',
            pass: '1998Ceere*'
        }
    });

    var Subject = "";
    var Text = "";

    if (Tipo !== 4) {
        Subject = `LA AREA ES -> ${Area}`;
        Text = `LA AREA ES -> ${Area} CELDA -> ${Celda}`;
    } else {
        Subject = `¡¡PIN PRÓXIMO A VENCERSE!! EN EMPRESA -> ${Empresa}`;
        Text = `EL PIN ES -> ${Area}`;
    }

    var ContenidoHTMLDelCorreo = `
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
                    <ul>`;
                    if (Tipo !==4) {
                        ContenidoHTMLDelCorreo += `
                            <li><strong>Empresa: </strong><br>${Empresa}</li>
                            <li><strong>Area:</strong><br>${Area}</li>
                            <li><strong>Celda:</strong><br>${Celda}</li>
                            <li><strong>Equipo Actual:</strong><br>${EquipoActual}</li>


                        `;
                    } else {
                        ContenidoHTMLDelCorreo += `
                            <li><strong>Pin:</strong><br>${Area}</li>
                            <li><strong>Descripción: </strong><br>${Celda}</li>
                            <li><strong>Equipo Actual:</strong><br>${EquipoActual}</li>
                        `;
                    }
                    ContenidoHTMLDelCorreo += `
                    </ul>
                </div>
                <div class="footer">
                    <p>Creado por Ceere Software - © 2024 Todos los derechos reservados</p>
                </div>
            </div>
        </body>
    </html>
    `;

    var mailOptions = {
<<<<<<< HEAD
        from: msg + '"Ceere" <correomineria@ceere.net>', //Deje eso quieto Outlook porne demasiados problemas
=======
        from: msg + '"Ceere" <correomineria2@ceere.net>', //Deje eso quieto Outlook porne demasiados problemas
>>>>>>> f06983db5d7a61eec13dbc3f1c1aa8575390551a
        //to: 'jorgecalle@hotmail.com, jorgecaller@gmail.com, alexisaza@hotmail.com, camilodesarrollador@outlook.com, ceereweb@gmail.com, Fernando.pala.99@gmail.com, soportee4@gmail.com, soporte.ceere06068@gmail.com',
        to: 'soporte.ceere06068@gmail.com, Fernando.pala.99@gmail.com',
        subject: Subject,
        text: Text,
        html: ContenidoHTMLDelCorreo
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}







