'use strict'

let ApiMariaDBModel = require('../../models/apiMariaDBModel'),
    jwt = require('jsonwebtoken'),
    { config } = require('../../config'),
    { cookieToJson } = require('./cookieToJson'),
    bcrypt = require('bcryptjs')

//Funcion para traer Usuario Log In de MariaDB
async function logIn(rootValue, args, context) {

    let usuarioOEmail = args.usuarioOEmail,
        pass = args.password

    let promise

    if(usuarioOEmail && pass){
        promise = new Promise((resolve, reject) => {

            let cb = async (err, rows) => {
                if(err){
                    console.log(new Error('No hay registros de Usuarios'))
                    resolve({
                        conexion: false,
                        usuario: null
                    })
                }else if(rows && rows.length > 0){

                    //Validando la contraseña
                    let resultString = JSON.stringify(rows, null, 2).replace(/[\[\]]$/g,'').replace(/^[\[\]]/g,''),
                    resultJson = JSON.parse(resultString),
                    resultPass = bcrypt.compareSync(pass, resultJson.password);

                    //Validando Usuario o Correo
                    let usuarioOEmailRes = ((usuarioOEmail === resultJson.correo) || (usuarioOEmail === resultJson.usuario))

                    if( ( usuarioOEmailRes === true ) && (resultPass == true) ){

                        const token = jwt.sign({ sub: resultJson.usuario }, config.authJwtSecret);

                        context.res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) });

                        let res = {
                          conexion: true,
                          usuario: {
                            id: resultJson.id_usuario,
                            usuario: resultJson.usuario,
                            nombre: resultJson.nombre,
                            apellidos: resultJson.apellidos,
                            correo: resultJson.correo,
                            fecha_de_nacimiento: resultJson.fecha_de_nacimiento,
                            direccion: resultJson.direccion,
                            nacionalidad: resultJson.nacionalidad,
                            sexo: resultJson.sexo,
                            telefono: resultJson.telefono,
                            tipo: resultJson.tipo,
                            DPI: resultJson.DPI,
                            permisos: resultJson.permisos === null ? null : JSON.parse(resultJson.permisos),
                            colaborador: resultJson.id_colaborador === null ? null : {
                              id: resultJson.id_colaborador,
                              puesto: resultJson.puesto,
                              departamento: resultJson.departamento,
                              NIT: resultJson.NIT
                            },
                            suscription: resultJson.id_afiliado === null ? null : {
                              id: resultJson.id_afiliado,
                              firma_afiliado: `data:image/png;base64,${Buffer.from(resultJson.firma_afiliado).toString('base64')}`,
                              fecha_inicio: resultJson.fecha_inicio,
                              fecha_expiracion: resultJson.fecha_expiracion,
                              auto_renovacion: resultJson.auto_renovacion,
                              DPI_frontal: `data:image/png;base64,${Buffer.from(resultJson.DPI_frontal).toString('base64')}`,
                              DPI_posterior: `data:image/png;base64,${Buffer.from(resultJson.DPI_posterior).toString('base64')}`,
                              principalUser: resultJson.id_usuario === resultJson.FK_Principal_User ? true : false
                            }
                          }
                        }

                        resolve(res)

                    }else{
                        resolve({
                            conexion: false,
                            usuario: null
                        })
                    }

                }else{
                    resolve({
                        conexion: false,
                        usuario: null
                    }) 
                }
            }

            ApiMariaDBModel.dataLogInModel.logIn(cb, usuarioOEmail)

        });

    }else{

        promise = new Promise((resolve, reject) => {

            //take token from client
            let token = cookieToJson(context.req.headers.cookie)
            //take token from client finish
      
            let decoded
      
            try{
              if( token === undefined ){
                return null
              }else{
                decoded = jwt.verify(token.access_token, config.authJwtSecret);
              }
            }catch(err){
              console.error(err)
              resolve({
                conexion: false,
                usuario: null
              })
            }
      
            let usuario = decoded.sub
      
            let cb = async (err, rows) => {

              if(err){
      
                console.log(new Error('No hay registros de Usuarios'))

                resolve({
                    conexion: false,
                    usuario: null
                })
      
              }else if(rows && rows.length > 0){
      
                let resultString = JSON.stringify(rows, null, 2).replace(/[\[\]]$/g,'').replace(/^[\[\]]/g,''),
                    resultJson = JSON.parse(resultString);
      
                  if( usuario === resultJson.usuario ){

                    let res = {
                      conexion: true,
                      usuario: {
                        id: resultJson.id_usuario,
                        usuario: resultJson.usuario,
                        nombre: resultJson.nombre,
                        apellidos: resultJson.apellidos,
                        correo: resultJson.correo,
                        fecha_de_nacimiento: resultJson.fecha_de_nacimiento,
                        direccion: resultJson.direccion,
                        nacionalidad: resultJson.nacionalidad,
                        sexo: resultJson.sexo,
                        telefono: resultJson.telefono,
                        tipo: resultJson.tipo,
                        DPI: resultJson.DPI,
                        permisos: resultJson.permisos === null ? null : JSON.parse(resultJson.permisos),
                        colaborador: resultJson.id_colaborador === null ? null : {
                          id: resultJson.id_colaborador,
                          puesto: resultJson.puesto,
                          departamento: resultJson.departamento,
                          NIT: resultJson.NIT
                        },
                        suscription: resultJson.id_afiliado === null ? null : {
                          id: resultJson.id_afiliado,
                          firma_afiliado: `data:image/png;base64,${Buffer.from(resultJson.firma_afiliado).toString('base64')}`,
                          fecha_inicio: resultJson.fecha_inicio,
                          fecha_expiracion: resultJson.fecha_expiracion,
                          auto_renovacion: resultJson.auto_renovacion,
                          DPI_frontal: `data:image/png;base64,${Buffer.from(resultJson.DPI_frontal).toString('base64')}`,
                          DPI_posterior: `data:image/png;base64,${Buffer.from(resultJson.DPI_posterior).toString('base64')}`,
                          principalUser: resultJson.id_usuario === resultJson.FK_Principal_User ? true : false
                        }
                      }
                    }

                    resolve(res)
      
                  }else{
                    resolve({
                      conexion: false,
                      usuario: null
                    })
                    //res.send('Conexion Invalida')
                  }
      
              }else{
                  resolve({
                    conexion: false,
                    usuario: null
                  })
              }
      
            }
      
            ApiMariaDBModel.dataLogInModel.logIn(cb, usuario)
      
        });
    }

    let result = await promise; // wait till the promise resolves (*)

    //console.log(result); // "done!"

    return result

}
//Termina Funcion para traer Usuario Log In de MariaDB

//Funcion para Hacer un LogOut
async function logOut(args, context){
    //take token from client
    let token = cookieToJson(context.req.headers.cookie)
    //take token from client finish

    let promise = new Promise((resolve, reject) => {
        context.res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() - (1000 * 60)) });
        resolve({
        conexion: false,
        usuario: null
        })
    })

    return promise
}
//Termina Funcion para Hacer un LogOut

module.exports = { logIn, logOut }