
function getAyudaPreguntas(ayudasPreguntas, idPregunta){
    GIRSdata = JSON.parse(sessionStorage.getItem('GIRSdata'));


    switch(idPregunta) {
        case 7:
            if (GIRSdata.programaDeReciclaje !== ''){

                msg = `Se obtuvo que '${GIRSdata.programaDeReciclaje}' se ejecuta un programa de reciclaje que incluya la clasificación total 
                    o parcial de los residuos por parte de los ciudadanos.\n Información del cantón de ${GIRSdata.canton}`
                return msg
            }
            return ayudasPreguntas[idPregunta].ayuda;
        case 8:
            if (GIRSdata.ppc !== ''){
                msg = `Se obtuvo un per cápita de ${GIRSdata.ppc} .\n Información del cantón de ${GIRSdata.canton}`
                return msg
            }
            return ayudasPreguntas[idPregunta].ayuda;
        case 9:
            if (GIRSdata.gastoServicioRecoleccionResiduos !== '' && GIRSdata.unidadesHabitacionalesAtendidas !== ''){
                inversionAnualGIRS = GIRSdata.gastoServicioRecoleccionResiduos/GIRSdata.unidadesHabitacionalesAtendidas;
                var num = Math.round(inversionAnualGIRS * 100)/100;
                msg = `Se obtuvo que el presupuesto es de ₡${num}.\n Información del cantón de ${GIRSdata.canton}`
                return msg
            }
            return ayudasPreguntas[idPregunta].ayuda;
        case 10:
            if (GIRSdata.gastosServicioAseoDeVias !== '' && GIRSdata.unidadesHabitacionalesAtendidas !== ''){
                gastosRealesAseo_Personas =  GIRSdata.gastosServicioAseoDeVias/GIRSdata.unidadesHabitacionalesAtendidas;
                var num = Math.round(gastosRealesAseo_Personas * 100)/100;
                msg = `Se obtuvo que el presupuesto los gastos reales del sistema de aseo de vias / viendas atendidas durante un 
                año es de ₡${num}`
                return msg
            }
            return ayudasPreguntas[idPregunta].ayuda;
        default:
            return ayudasPreguntas[idPregunta].ayuda;
    }
}
