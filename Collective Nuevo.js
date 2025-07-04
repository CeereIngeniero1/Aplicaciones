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

const Globales = {
    Empresa: 'Collective',
    Usuario: '76966',
    Contraseña: 'Collectivemining.2025.',
    Agente: '83955',
    ContraAgente: 'wX2*dQ3*cS',
    Operador: 0, // 0 Principal / 1 Agente
    EquipoActual: EquipoActual,
}

const contadores = {
    ContadorPestañas: 0,
    ContadorReapertura: 0
}
 const ElPin = () =>{
        try {
   
            let Pines = fs.readFileSync('Pin.txt', 'utf-8', prueba = (error, datos) => {
                if (error) {
                    throw error;
                } else {
                    // console.log(datos);
                }
            });
            for (let i = 0; i < Pines.length; i++) {
                if (Pines.substring(i + 1, i + 4) == 'Co:') {
                    // console.log(Pines.substring(i + 1, i + 4));
                    return Pines.substring(i + 4, i + 31);    
                }
            }
        } catch (error) {
            
        }
    }

    PIN = ElPin();
console.log(PIN);