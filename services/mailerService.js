'use strict'

const nodemailer = require('nodemailer')
const mailProvider = require('../util/mailProvider')

module.exports = (models) => {
  return {
    enviarMailCierreInforme: (informe_id) => {
      let promise = new Promise(async (resolve, reject)  => {
        models.sequelize.query('SELECT DISTINCT u.email,u.nombre FROM pregunta_consolidada pc INNER JOIN derivacion d ON d.pregunta_consolidada_id = pc.id INNER JOIN organismo o ON o.id = d.organismo_id INNER JOIN usuario u ON u.organismo_id = o.id where informe_id ="'+informe_id+'";').then(
          (data) => {
            let emails = data[0].map(row => {
              return (row.nombre + ' <' + row.email + '>')
            })
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport(mailProvider.getTransporter())
            // setup email data with unicode symbols
            models.Informe.findById(informe_id)
              .then((informe)=>{
                let mailOptions = mailProvider.emailCierreInformeWithOptions(emails, informe)
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    reject(error)
                  }else{
                    resolve(info)
                  }
                })
              })
          })
      }
      )
      return promise
    }
  }
}