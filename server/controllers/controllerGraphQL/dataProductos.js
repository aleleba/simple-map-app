'use strict'

let ApiMongoDBModel = require('../../models/apiMongoDBModel'),
    jwt = require('jsonwebtoken'),
    { config } = require('../../config'),
    { cookieToJson } = require('./cookieToJson'),
    ObjectID = require('mongodb').ObjectID,
    bcrypt = require('bcryptjs')

//Funcion para traer todos los Usuarios
async function getAllProductos(rootValue, args, context) {

    let promise = new Promise((resolve, reject) => {
  
      //take token from client
      /*let token = cookieToJson(context.req.headers.cookie)
      //take token from client finish
  
      let decoded
  
      //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGVsZWJhIiwiaWF0IjoxNTYwMjY2ODAzfQa.huGSbHhXDvJvplIAPGMNPk9rGnw71_ViPRiNgagYKJQ"
  
      try{
        if( token === undefined ){
          console.error(`No puedes ver los usuarios porque no tienes un token que validar`)
          resolve(null)
        }else{
          decoded = jwt.verify(token.access_token, config.authJwtSecret);
        }
      }catch(err){
        console.error(err)
        resolve(null)
      }
  
      let usuario = decoded.sub
  
      if(usuario){*/
  
        let cb = (err, res, disconnect) => {
            if(err){
              new Error('No hay registros de Productos')
            }else{
  
                let data = res.map( producto => {

                    let productoReturn = {
                        ...producto,
                        id: producto._id,
                        precio: parseInt(producto.precio),
                        descFamGT: parseFloat(producto.descFamGT)
                    }

                    delete productoReturn["_id"]

                    return productoReturn

                })

                resolve(data)

            }
        }
  
        ApiMongoDBModel.dataProductosaModel.getAllProductos(cb);
  
      //}
  
    });
  
    let result = await promise; // wait till the promise resolves (*)
  
    //console.log(result); // "done!"
  
    return result
}
//Termina Funcion para traer todos los Usuarios

  module.exports = { getAllProductos }