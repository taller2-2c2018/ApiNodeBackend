'use strict'

const moment = require('moment')
moment.locale('es')


const getTransporter = () => {
  return {
    service: process.env.MAIL_SERVICE,
    // Before sending your email using gmail you have to allow non secure apps to access gmail you can do this by going to your gmail settings here (https://myaccount.google.com/lesssecureapps?pli=1).
    // Otra conf puede ser
    // host: 'smtp.ethereal.email',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USR, // generated ethereal user
      pass: process.env.MAIL_PWD // generated ethereal password
    }
  }
}

const emailCierreInformeWithOptions = (receivers,informe) => {
  let mailOptions = {
    from: '"Informe JGM C&S" <informejgm.cys@gmail.com>', // sender address
    to: receivers.toString(), // list of receivers
    bcc: 'Nicolas Araya <naraya@cys.com.ar>',
    subject: 'INFORME ' + informe.id + ' - PLAZOS', // Subject line
    html: emailCierreInforme(informe)// html body
  }
  return mailOptions
}

const emailCierreInforme = (informe) => {
  let fecha_rederivacion = informe.fecha_rederivacion
  let fecha_recepcion_respuestas = informe.fecha_recepcion_respuestas
  let diaRederivaciones = moment(fecha_rederivacion).format('dddd LL')
  let diaRecepcionRespuestas = moment(fecha_recepcion_respuestas).format('dddd LL')
  diaRederivaciones = diaRederivaciones.charAt(0).toUpperCase() + diaRederivaciones.substr(1)
  diaRecepcionRespuestas = diaRecepcionRespuestas.charAt(0).toUpperCase() + diaRecepcionRespuestas.substr(1)  
  let email = ''
  email += 'Estimados enlaces, los plazos previstos para este nuevo informe son:'
  email += '<br>'
  email += '<br>'
  email += '<b>' + diaRederivaciones + ' a las 14hs. VENCE EL PLAZO PARA EFECTUAR REDERIVACIONES</b>'
  email += '<br>'
  email += '<br>'
  email += '<b>' + diaRecepcionRespuestas + ' a las 14hs. VENCE EL PLAZO PARA LA RECEPCIÓN DE RESPUESTAS</b>'
  email += '<br>'
  email += '<br>'
  email += 'Podrán acceder a las preguntas que están subidas a la aplicación a traveés el siguiente link:'
  email += '<br>'
  email += '<br>'
  email += '<a href="'+process.env.URL_FRONT+'">'+process.env.URL_FRONT+'</a>'
  email += '<br>'
  email += '<br>'
  email += 'Ante cualquier dificultad con el mismo comunicarse al 4343-0181 al 89 int. 5610 (Santiago Loitegui)'
  email += '<br>'
  email += '<br>'
  email += 'Quedamos a su disposición ante cualquier consulta '
  email += '<br>'
  email += '<br>'
  email += 'Saludos '
  email += '<br>'
  return email
}

exports.getTransporter = getTransporter
exports.emailCierreInformeWithOptions = emailCierreInformeWithOptions
exports.emailCierreInforme = emailCierreInforme
