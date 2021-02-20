'use strict'

let ApiMariaDBModel = require('../../models/apiMariaDBModel'),
    ApiMongoDBModel = require('../../models/apiMongoDBModel'),
    jwt = require('jsonwebtoken'),
    { config } = require('../../config'),
    { cookieToJson } = require('./cookieToJson'),
    ObjectID = require('mongodb').ObjectID,
    bcrypt = require('bcryptjs'),
    assert = require('assert'),
    { guessMimeType, convertBase64ToBlob, convertBlobToBase64 } = require('./utilityBase64')

//Funcion para Registrar un Usuario en MariaDB
async function registerUser(rootValue, args, context) {

  //console.log(args.insertUser.permisos)

  let pass = args.registerUser.password,
      salt = bcrypt.genSaltSync(10),
      passCript = bcrypt.hashSync(pass, salt)

  //console.log(pass)

  //console.log(args.insertUser.empresa_asociada)

  let usuario = {
    nombre: args.registerUser.nombre,
    apellidos: args.registerUser.apellidos,
    usuario: args.registerUser.usuario,
    correo: args.registerUser.correo,
    fecha_de_nacimiento: args.registerUser.fecha_de_nacimiento,
    direccion: args.registerUser.direccion,
    nacionalidad: args.registerUser.nacionalidad,
    sexo: args.registerUser.sexo,
    telefono: args.registerUser.telefono,
    DPI: args.registerUser.DPI,
    tipo: args.registerUser.tipo,
    permisos: JSON.stringify(args.registerUser.permisos),
    foto_perfil: ((args.registerUser.foto_perfil === null) || (args.registerUser.foto_perfil === undefined) || (args.registerUser.foto_perfil === 'null')) ? null : convertBase64ToBlob(args.registerUser.foto_perfil),
    password: passCript
  }


  let promise = new Promise((resolve, reject) => {

    let cb = (err, results, fields) => {
  
      if (err) {
        console.log(new Error(err))
        //next( new Error(err) )
      }else{
  
        let usuario = {
          conexion: true,
          mensaje: `Se registró con exito un usuario nuevo`,
          usuario: {
              id: results.insertId,
              nombre: args.registerUser.nombre,
              apellidos: args.registerUser.apellidos,
              usuario: args.registerUser.usuario,
              correo: args.registerUser.correo,
              fecha_de_nacimiento: args.registerUser.fecha_de_nacimiento,
              direccion: args.registerUser.direccion,
              nacionalidad: args.registerUser.nacionalidad,
              sexo: args.registerUser.sexo,
              telefono: args.registerUser.telefono,
              DPI: args.registerUser.DPI,
              tipo: args.registerUser.tipo,
              foto_perfil: args.registerUser.foto_perfil,
              permisos: args.registerUser.permisos
          }
        }

        const token = jwt.sign({ sub: args.registerUser.usuario }, config.authJwtSecret);

        context.res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) });
  
        resolve(usuario)
  
      }

    }

    ApiMariaDBModel.dataUsuarioModel.registerUser(cb, usuario)

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Registrar un Usuario en MariaDB

//Funcion para Registrar un Usuario en MariaDB
async function registerMedico(rootValue, args, context) {

  //console.log(args.insertUser.permisos)

  let pass = args.registerMedico.password,
      salt = bcrypt.genSaltSync(10),
      passCript = bcrypt.hashSync(pass, salt)

  //console.log(pass)

  //console.log(args.insertUser.empresa_asociada)

  let usuario = {
    nombre: args.registerMedico.nombre,
    apellidos: args.registerMedico.apellidos,
    usuario: args.registerMedico.usuario,
    correo: args.registerMedico.correo,
    fecha_de_nacimiento: args.registerMedico.fecha_de_nacimiento,
    direccion: args.registerMedico.direccion,
    nacionalidad: args.registerMedico.nacionalidad,
    sexo: args.registerMedico.sexo,
    telefono: args.registerMedico.telefono,
    DPI: args.registerMedico.DPI,
    tipo: args.registerMedico.tipo,
    foto_perfil: ((args.registerMedico.foto_perfil === null) || (args.registerMedico.foto_perfil === undefined)) ? null : convertBase64ToBlob(args.registerMedico.foto_perfil),
    permisos: JSON.stringify(args.registerMedico.permisos),
    password: passCript,
    medico: {
      ...args.registerMedico.medico,
      financiero: {
        ...args.registerMedico.medico.financiero,
        documentos: {
          dpi_front: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.dpi_front),
          dpi_back: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.dpi_back),
          licencia_sanitaria: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.licencia_sanitaria),
          patente: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.patente),
          recibo_colegiado: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.recibo_colegiado),
          titulo_academico: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.titulo_academico),
          constancia_desechos_solidos: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.constancia_desechos_solidos),
          rtu: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.rtu),
          factura: convertBase64ToBlob(args.registerMedico.medico.financiero.documentos.factura)
        }
      },
      horario_atencion: JSON.stringify(args.registerMedico.medico.horario_atencion)
    }
  }


  let promise = new Promise((resolve, reject) => {

    let cb = (err, results, fields) => {
  
      if (err) {
        console.log(new Error(err))
        //next( new Error(err) )
      }else{

        usuario.id = results.insertId
        usuario.medico.FK_usuario = usuario.id

        let cbMedico = (err, results, fields) => {

          if(err){
            new Error('No Se pudo insertar un Medico')
          }else{

            if(results){

              usuario.medico.id = results.insertId

              let usuarioReturn = {
                conexion: true,
                mensaje: `Se registró con exito un medico nuevo`,
                usuario: {
                  ...usuario,
                  foto_perfil: args.registerMedico.foto_perfil,
                  permisos: args.registerMedico.permisos,
                  medico: {
                    ...args.registerMedico.medico,
                    financiero: {
                      ...args.registerMedico.medico.financiero,
                      documentos: {
                        dpi_front: args.registerMedico.medico.financiero.documentos.dpi_front,
                        dpi_back: args.registerMedico.medico.financiero.documentos.dpi_back,
                        licencia_sanitaria: args.registerMedico.medico.financiero.documentos.licencia_sanitaria,
                        patente: args.registerMedico.medico.financiero.documentos.patente,
                        recibo_colegiado: args.registerMedico.medico.financiero.documentos.recibo_colegiado,
                        titulo_academico: args.registerMedico.medico.financiero.documentos.titulo_academico,
                        constancia_desechos_solidos: args.registerMedico.medico.financiero.documentos.constancia_desechos_solidos,
                        rtu: args.registerMedico.medico.financiero.documentos.rtu,
                        factura: args.registerMedico.medico.financiero.documentos.factura
                      }
                    },
                    horario_atencion: args.registerMedico.medico.horario_atencion
                  }
                }
              }
      
              const token = jwt.sign({ sub: args.registerMedico.usuario }, config.authJwtSecret);
      
              context.res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) });
        
              resolve(usuarioReturn)

            }

          }

        }

        ApiMariaDBModel.dataUsuarioModel.insertMedico(cbMedico, usuario.medico);
  
      }

    }

    ApiMariaDBModel.dataUsuarioModel.registerUser(cb, usuario)

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Registrar un Usuario en MariaDB

//Funcion para Eliminar un Usuario en MariaDB
async function updateMedicoState(rootValue, args, context) {

  let medicoId = args.medicoId

  let newState = args.newState

  let promise = new Promise((resolve, reject) => {

    //take token from client
    let token = cookieToJson(context.req.headers.cookie)
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

    if(usuario){

        let cb = (err, res) => {
  
            if(err){
              new Error('No hay registros de Medico')
            }else{
  
              if(res){
  
                resolve({
                  mensaje: `Se ha actualizado el estado del medico con id: ${medicoId}`,
                  medicoId,
                  newState
                })
  
              }
  
            }
        }
  
        ApiMariaDBModel.dataUsuarioModel.updateMedicoState(cb, medicoId, newState);

    }

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Eliminar un Usuario en MariaDB

//Funcion para Insertar un Usuario en MariaDB
async function insertUser(rootValue, args, context) {

  let pass = args.insertUser.password,
      salt = bcrypt.genSaltSync(10),
      passCript = bcrypt.hashSync(pass, salt)

  let user = {
    nombre: args.insertUser.nombre,
    apellidos: args.insertUser.apellidos,
    usuario: args.insertUser.usuario,
    correo: args.insertUser.correo,
    fecha_de_nacimiento: args.insertUser.fecha_de_nacimiento,
    direccion: args.insertUser.direccion,
    nacionalidad: args.insertUser.nacionalidad,
    sexo: args.insertUser.sexo,
    telefono: args.insertUser.telefono,
    DPI: args.insertUser.DPI,
    tipo: args.insertUser.tipo,
    foto_perfil: ((args.insertUser.foto_perfil === null) || (args.insertUser.foto_perfil === undefined)) ? null : convertBase64ToBlob(args.insertUser.foto_perfil),
    permisos: JSON.stringify(args.insertUser.permisos),
    password: passCript
  }

  let colaborador = args.insertUser.colaborador
  let medico = args.insertUser.medico === undefined ? undefined : {
    ...args.insertUser.medico,
    financiero: ((args.insertUser.medico.financiero === null) || (args.insertUser.medico.financiero === undefined)) ? null : {
      ...args.insertUser.medico.financiero,
      documentos: {
        dpi_front: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.dpi_front),
        dpi_back: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.dpi_back),
        licencia_sanitaria: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.licencia_sanitaria),
        patente: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.patente),
        recibo_colegiado: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.recibo_colegiado),
        titulo_academico: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.titulo_academico),
        constancia_desechos_solidos: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.constancia_desechos_solidos),
        rtu: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.rtu),
        factura: convertBase64ToBlob(args.insertUser.medico.financiero.documentos.factura)
      }
    },
    horario_atencion: ( ((args.insertUser.medico === undefined) || (args.insertUser.medico === null)) || ((args.insertUser.medico.horario_atencion === null) || (args.insertUser.medico.horario_atencion === undefined))) ? null : JSON.stringify(args.insertUser.medico.horario_atencion)
  }

  let promise = new Promise((resolve, reject) => {

    //take token from client
    let token = cookieToJson(context.req.headers.cookie)
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

    if(usuario){

      let cb = (err, results, fields) => {

          if(err){
            new Error('No Se pudo insertar un Usuario')
          }else{

            if(results){

              let fecha_de_nacimiento = new Date(user.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                  fecha_de_nacimiento = new Date(fecha_de_nacimiento)

                  user.fecha_de_nacimiento = fecha_de_nacimiento

                  user.permisos = ((user.permiso === "") || (user.permiso === undefined)) ? null : JSON.parse(user.permisos)
                  user.id = results.insertId

              if( (user.tipo === "colaborador") && (colaborador !== undefined) ){

                colaborador.FK_usuario = user.id

                let cbColaborador = (err, results, fields) => {

                  if(err){
                    new Error('No Se pudo insertar un Usuario')
                  }else{

                    if(results){

                      colaborador.id = results.insertId

                      resolve({
                        usuario: {
                          ...user,
                          foto_perfil: args.insertUser.foto_perfil,
                          permisos: args.insertUser.permisos,
                          colaborador
                        },
                        mensaje: "Se ha insertado un usuario y un colaborador."
                      })

                    }

                  }

                }

                ApiMariaDBModel.dataUsuarioModel.insertColaborador(cbColaborador, colaborador);

              }else if( (user.tipo === "medico") && (medico !== undefined) ){

                medico.FK_usuario = user.id

                let cbMedico = (err, results, fields) => {

                  if(err){
                    new Error('No Se pudo insertar un Usuario')
                  }else{

                    if(results){

                      medico.id = results.insertId

                      resolve({
                        usuario: {
                          ...user,
                          foto_perfil: args.insertUser.foto_perfil,
                          permisos: args.insertUser.permisos,
                          medico: {
                            ...args.insertUser.medico,
                            financiero: {
                              ...args.insertUser.medico.financiero,
                              documentos: {
                                dpi_front: args.insertUser.medico.financiero.documentos.dpi_front,
                                dpi_back: args.insertUser.medico.financiero.documentos.dpi_back,
                                licencia_sanitaria: args.insertUser.medico.financiero.documentos.licencia_sanitaria,
                                patente: args.insertUser.medico.financiero.documentos.patente,
                                recibo_colegiado: args.insertUser.medico.financiero.documentos.recibo_colegiado,
                                titulo_academico: args.insertUser.medico.financiero.documentos.titulo_academico,
                                constancia_desechos_solidos: args.insertUser.medico.financiero.documentos.constancia_desechos_solidos,
                                rtu: args.insertUser.medico.financiero.documentos.rtu,
                                factura: args.insertUser.medico.financiero.documentos.factura
                              }
                            },
                            horario_atencion: args.insertUser.medico.horario_atencion
                          }
                        },
                        mensaje: "Se ha insertado un usuario y un medico."
                      })

                    }

                  }

                }

                ApiMariaDBModel.dataUsuarioModel.insertMedico(cbMedico, medico);

              } else {
                resolve({
                  usuario: {
                    ...user,
                    foto_perfil: args.insertUser.foto_perfil,
                    permisos: args.insertUser.permisos,
                  },
                  mensaje: "Se ha insertado un usuario"
                })
              }

            }

          }
      }

      ApiMariaDBModel.dataUsuarioModel.insertUser(cb, user);

    }

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Insertar un Usuario en MariaDB

//Funcion para Insertar un Usuario en MariaDB
async function suscriptionUser(rootValue, args, context) {

  let idUser = args.suscriptionUser.idUser

  let suscription = {
    firma_afiliado: Buffer.from(args.suscriptionUser.firma_afiliado.split(",")[1],"base64"),
    fecha_inicio: args.suscriptionUser.fecha_inicio,
    fecha_expiracion: args.suscriptionUser.fecha_expiracion,
    auto_renovacion: args.suscriptionUser.auto_renovacion,
    DPI_frontal: Buffer.from(args.suscriptionUser.DPI_frontal.split(",")[1],"base64"),
    DPI_posterior: Buffer.from(args.suscriptionUser.DPI_posterior.split(",")[1],"base64"),
    principalUser: args.suscriptionUser.idUser
  }

  let promise = new Promise((resolve, reject) => {

    //take token from client
    let token = cookieToJson(context.req.headers.cookie)
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

    if(usuario){

      let cb = (err, results, fields) => {

          if(err){
            new Error(err)
          }else{

            if(results){

              let fecha_inicio = new Date(suscription.fecha_inicio).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                  fecha_inicio = new Date(fecha_inicio)
              let fecha_expiracion = new Date(suscription.fecha_expiracion).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                  fecha_expiracion = new Date(fecha_expiracion)

                  suscription.fecha_inicio = fecha_inicio
                  suscription.fecha_expiracion = fecha_expiracion
                  suscription.id = results.insertId
                  suscription.firma_afiliado = `data:image/png;base64,${suscription.firma_afiliado.toString('base64')}`
                  suscription.DPI_frontal = `data:image/png;base64,${suscription.DPI_frontal.toString('base64')}`
                  suscription.DPI_posterior = `data:image/png;base64,${suscription.DPI_posterior.toString('base64')}`
                  suscription.principalUser = suscription.principalUser === idUser ? true : false

              
              let cbAddSuscriptionToUser = (err, results) => {
                if(err){
                  new Error(err)
                }else{
                  if(results){
                    resolve({
                      suscription,
                      mensaje: "Se ha afiliado satisfactoriamente"
                    })
                  }
                }
              }

              ApiMariaDBModel.dataUsuarioModel.addSuscriptionToUser(cbAddSuscriptionToUser, idUser, results.insertId)

            }

          }
      }

      ApiMariaDBModel.dataUsuarioModel.subscriptionUser(cb, suscription);

    }

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Insertar un Usuario en MariaDB

//Funcion para traer todas las solicitudes de Mensajeria en MongoDB
async function getAllEspecialidadesMedico(rootValue, args, context) {

  let promise = new Promise((resolve, reject) => {

    //take token from client
    /*let token = cookieToJson(context.req.headers.cookie)
    //take token from client finish

    let decoded

    //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGVsZWJhIiwiaWF0IjoxNTYwMjY2ODAzfQa.huGSbHhXDvJvplIAPGMNPk9rGnw71_ViPRiNgagYKJQ"

    try{
      if( token === undefined ){
        console.error(`No se Insertó la solicitud porque no tienes un token que validar`)
        resolve({
          id: null,
          mensaje: `No se Insertó la solicitud porque no tienes un token que validar`
        })
      }else{
        decoded = jwt.verify(token.access_token, config.authJwtSecret);
      }
    }catch(err){
      console.error(err)
      resolve({
        id: null,
        mensaje: `No se Insertó la solicitud porque no tienes un token válido`
      })
    }

    let usuario = decoded.sub

    if(usuario){*/
      
    let cb = (err, res, disconnect) => {
        assert.equal(err, null);
        //console.log("Found the following records");
      
        var data = res.map(data => {
          let dataArray = {
            id: ObjectID(data._id).toString(),
            nombre: data.nombre,
            tipo: data.tipo
          }
          return dataArray
        })
        //console.log(data)
      
        resolve(data)
        
        disconnect()
        
      }

      ApiMongoDBModel.dataMedicosModel.getAllEspecialidades(cb)

    //}


  });

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result

}
//Termina Funcion para traer todas las solicitudes de Mensajeria en MongoDB

//Funcion para Insertar un Usuario en MariaDB
async function insertEspecialidadMedico(rootValue, args, context) {

  let data = {
    nombre: args.nombre,
    tipo: args.tipo
  }

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

      let cb = (res, disconnect) => {

        if(res){
          resolve({
            id: res.ops[0]._id.toString(),
            ...data
          })
          assert.equal(1, res.insertedCount);
        }
        disconnect()

      }

      ApiMongoDBModel.dataMedicosModel.insertEspecialidad(cb, data);

    //}

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Insertar un Usuario en MariaDB

//Funcion para traer todos los Usuarios
async function getAllUsers(rootValue, args, context) {

  let promise = new Promise((resolve, reject) => {

    //take token from client
    let token = cookieToJson(context.req.headers.cookie)
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

    
    if(usuario){
      
      
      let cb = (err, rows) => {

        if(err){
          new Error('No hay registros de Texto')
        }else{

            //console.log(rows)

            var data = rows.map( (row) => {

                let fecha_de_nacimiento = row.fecha_de_nacimiento.toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                    fecha_de_nacimiento = new Date(fecha_de_nacimiento)

                //console.log(row.observacionesMedico)

                let dataArray = {
                  id: row.id_usuario,
                  nombre: row.nombre,
                  apellidos: row.apellidos,
                  usuario: row.usuario,
                  foto_perfil: row.foto_perfil !== null ? convertBlobToBase64(row.foto_perfil) : null,
                  correo: row.correo,
                  fecha_de_nacimiento,
                  direccion: row.direccion,
                  nacionalidad: row.nacionalidad,
                  sexo: row.sexo,
                  telefono: row.telefono,
                  DPI: row.DPI,
                  tipo: row.tipo,
                  permisos: row.permiso === "" ? null : JSON.parse(row.permisos),
                  FK_Afiliado: row.FK_Afiliado,
                  colaborador: ((row.id_colaborador === null) || (row.id_colaborador === undefined)) ? null : {
                    id: row.id_colaborador,
                    puesto: row.puesto,
                    departamento: row.departamento,
                    NIT: row.NITColaborador
                  },
                  medico: ((row.id_medico === null) || (row.id_medico === undefined)) ? null : {
                    id: row.id_medico,
                    numero_colegiado: row.numero_colegiado,
                    NIT: row.NITMedico,
                    nombre_clinica: row.nombre_clinica,
                    departamento_clinica: row.departamento_clinica,
                    municipalidad_clinica: row.municipalidad_clinica,
                    direccion_clinica: row.direccion_clinica,
                    telefono_clinica: row.telefono_clinica,
                    correo_clinica: row.correo_clinica,
                    especialidad: row.especialidad,
                    sub_especialidad: row.sub_especialidad,
                    atencion_emergencias: row.atencion_emergencias === 1 ? true : false,
                    financiero: {
                      cuenta_numero: row.cuenta_numero,
                      cuenta_nombre: row.cuenta_nombre,
                      cuenta_tipo: row.cuenta_tipo,
                      banco_nombre: row.banco_nombre,
                      factura_nombre: row.factura_nombre,
                      documentos: {
                        dpi_front: row.dpi_front !== null ? convertBlobToBase64(row.dpi_front) : null,
                        dpi_back: row.dpi_back !== null ? convertBlobToBase64(row.dpi_back) : null,
                        licencia_sanitaria: row.licencia_sanitaria !== null ? convertBlobToBase64(row.licencia_sanitaria) : null,
                        patente: row.patente !== null ? convertBlobToBase64(row.patente) : null,
                        recibo_colegiado: row.recibo_colegiado !== null ? convertBlobToBase64(row.recibo_colegiado) : null,
                        titulo_academico: row.titulo_academico !== null ? convertBlobToBase64(row.titulo_academico) : null,
                        constancia_desechos_solidos: row.constancia_desechos_solidos !== null ? convertBlobToBase64(row.constancia_desechos_solidos) : null,
                        rtu: row.rtu !== null ? convertBlobToBase64(row.rtu) : null,
                        factura: row.factura !== null ? convertBlobToBase64(row.factura) : null
                      }
                    },
                    horario_atencion: JSON.parse(row.horario_atencion),
                    observaciones: row.observacionesMedico,
                    observaciones_emergencias: row.observaciones_emergencias,
                    estado: row.estado,
                    social_media: {
                      fb_link: row.medicoFBLink,
                      ins_link: row.medicoINSLink
                    }
                  }
                }
                return dataArray
            })
            //console.log(data)
            resolve(data)
          }
      }

      ApiMariaDBModel.dataUsuarioModel.getAllUsers(cb);

    }

  });

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
}
//Termina Funcion para traer todos los Usuarios

//Funcion para Editar un Usuario en MariaDB
async function editUser(rootValue, args, context) {

  let usuarioEdit = {
    id: args.editUser.id,
    nombre: args.editUser.nombre,
    apellidos: args.editUser.apellidos,
    usuario: args.editUser.usuario,
    correo: args.editUser.correo,
    fecha_de_nacimiento: args.editUser.fecha_de_nacimiento,
    direccion: args.editUser.direccion,
    nacionalidad: args.editUser.nacionalidad,
    sexo: args.editUser.sexo,
    telefono: args.editUser.telefono,
    DPI: args.editUser.DPI,
    tipo: args.editUser.tipo,
    foto_perfil: convertBase64ToBlob(args.editUser.foto_perfil),
    permisos: JSON.stringify(args.editUser.permisos)
  }

  let colaborador = args.editUser.colaborador

  let medico = args.editUser.medico === undefined ? undefined : {
    ...args.editUser.medico,
    financiero: ((args.editUser.medico.financiero === null) || (args.editUser.medico.financiero === undefined)) ? null : {
      ...args.editUser.medico.financiero,
      documentos: {
        dpi_front: convertBase64ToBlob(args.editUser.medico.financiero.documentos.dpi_front),
        dpi_back: convertBase64ToBlob(args.editUser.medico.financiero.documentos.dpi_back),
        licencia_sanitaria: convertBase64ToBlob(args.editUser.medico.financiero.documentos.licencia_sanitaria),
        patente: convertBase64ToBlob(args.editUser.medico.financiero.documentos.patente),
        recibo_colegiado: convertBase64ToBlob(args.editUser.medico.financiero.documentos.recibo_colegiado),
        titulo_academico: convertBase64ToBlob(args.editUser.medico.financiero.documentos.titulo_academico),
        constancia_desechos_solidos: convertBase64ToBlob(args.editUser.medico.financiero.documentos.constancia_desechos_solidos),
        rtu: convertBase64ToBlob(args.editUser.medico.financiero.documentos.rtu),
        factura: convertBase64ToBlob(args.editUser.medico.financiero.documentos.factura)
      }
    },
    horario_atencion: ( ((args.editUser.medico === undefined) || (args.editUser.medico === null)) || ((args.editUser.medico.horario_atencion === null) || (args.editUser.medico.horario_atencion === undefined))) ? null : JSON.stringify(args.editUser.medico.horario_atencion)
  }


  let promise = new Promise((resolve, reject) => {

    //take token from client
    let token = cookieToJson(context.req.headers.cookie)
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

    if(usuario){

      let cbGetUser = (err, rows) => {

        if(err){
          new Error('No hay registros de Usuario')
        }else{

          if(rows){

            let suscription =  rows[0].id_afiliado === null ? null : {
              id: rows[0].id_afiliado,
              firma_afiliado: `data:image/png;base64,${rows[0].firma_afiliado.toString('base64')}`,
              fecha_inicio: rows[0].fecha_inicio,
              fecha_expiracion: rows[0].fecha_expiracion,
              auto_renovacion: rows[0].auto_renovacion,
              DPI_frontal: `data:image/png;base64,${rows[0].DPI_frontal.toString('base64')}`,
              DPI_posterior: `data:image/png;base64,${rows[0].DPI_posterior.toString('base64')}`,
              principalUser: rows[0].id_usuario === rows[0].FK_Principal_User ? true : false
            }
            
            if( (rows[0].id_colaborador === null) && colaborador !== null ) {

              colaborador.FK_usuario = parseInt(usuarioEdit.id)

              let cbInsertColaborador = (err, results, fields) => {

                if(err){
                  new Error('No Se pudo insertar un Colaborador')
                }else{

                  if(results){

                    colaborador.id = results.insertId

                    let cb = (err, res) => {

                      if(err){
                        new Error('No hay registros de Usuario')
                      }else{
            
                        if(res){
            
                          let fecha_de_nacimiento = new Date(usuarioEdit.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                              fecha_de_nacimiento = new Date(fecha_de_nacimiento)
            
                              usuarioEdit.fecha_de_nacimiento = fecha_de_nacimiento
            
                              usuarioEdit.permisos = usuarioEdit.permiso === "" ? null : JSON.parse(usuarioEdit.permisos)
                        
                          if(rows[0].id_medico !== null){

                            let cbMedico = (err,res) => {

                              if(err){
                                new Error('No hay registros de Medico')
                              }else{
                    
                                if(res){
                    
                                  resolve({
                                    mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id} y se ha agregado un nuevo colaborador con id: ${colaborador.id} y se ha eliminado el medico con ${rows[0].id_medico}`,
                                    usuario: {
                                      ...usuarioEdit,
                                      foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                      suscription,
                                      colaborador
                                    }
                                  })
                    
                                }
                    
                              }
                            }
                    
                            ApiMariaDBModel.dataUsuarioModel.deleteMedico(cbMedico, rows[0].id_medico);
            
                          }else{
                            resolve({
                              mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id} y se ha agregado un nuevo colaborador con id: ${colaborador.id}`,
                              usuario: {
                                ...usuarioEdit,
                                foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                suscription,
                                colaborador
                              }
                            })
                          }
            
            
                        }
            
                      }
                  }
            
                  ApiMariaDBModel.dataUsuarioModel.editUser(cb, usuarioEdit);

                    /*colaborador.id_colaborador = results.insertId

                    resolve({
                      usuario: {
                        ...user,
                        colaborador
                      },
                      mensaje: "Se ha editado un usuario y se ha insertado un colaborador."
                    })*/

                  }

                }

              }

              ApiMariaDBModel.dataUsuarioModel.insertColaborador(cbInsertColaborador, colaborador);
              
            }else if( (rows[0].id_colaborador !== null) && colaborador !== null ){

              colaborador.id = rows[0].id_colaborador

              let cbEditColaborador = (err, res) => {

                if(err){
                  new Error('No hay registros de Colaborador')
                }else{
                  if(res){
                    let cb = (err, res) => {

                      if(err){
                        new Error('No hay registros de Usuario')
                      }else{
            
                        if(res){
            
                          let fecha_de_nacimiento = new Date(usuarioEdit.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                              fecha_de_nacimiento = new Date(fecha_de_nacimiento)
            
                              usuarioEdit.fecha_de_nacimiento = fecha_de_nacimiento
            
                              usuarioEdit.permisos = usuarioEdit.permiso === "" ? null : JSON.parse(usuarioEdit.permisos),
            
                          resolve({
                            mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id} y se ha editado el colaborador con id: ${colaborador.id}`,
                            usuario: {
                              ...usuarioEdit,
                              foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                              suscription,
                              colaborador
                            }
                          })
            
                        }
            
                      }
                    }
            
                    ApiMariaDBModel.dataUsuarioModel.editUser(cb, usuarioEdit);

                  }
                }

              }

              ApiMariaDBModel.dataUsuarioModel.editColaborador(cbEditColaborador, colaborador);

            }else if( (rows[0].id_colaborador !== null) && colaborador === null ){

              let idColaborador = rows[0].id_colaborador

              let cbDeleteColaborador = (err,res) => {
                if(err){
                  new Error('No hay registros de Colaborador')
                }else{

                  if(res){

                    let cb = (err, res) => {

                      if(err){
                        new Error('No hay registros de Usuario')
                      }else{
            
                        if(res){
            
                          let fecha_de_nacimiento = new Date(usuarioEdit.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                              fecha_de_nacimiento = new Date(fecha_de_nacimiento)
            
                              usuarioEdit.fecha_de_nacimiento = fecha_de_nacimiento
            
                              usuarioEdit.permisos = usuarioEdit.permiso === "" ? null : JSON.parse(usuarioEdit.permisos)

                          if(medico !== null){

                            medico.FK_usuario = parseInt(usuarioEdit.id)

                            let cbInsertMedico = (err, results, fields) => {
              
                              if(err){
                                new Error('No Se pudo insertar un Colaborador')
                              }else{
              
                                if(results){
              
                                  medico.id = results.insertId

                                  resolve({
                                    mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id}, se ha eliminado el colaborador con id: ${idColaborador} y se ha creado el medico con id: ${medico.id}`,
                                    usuario: {
                                      ...usuarioEdit,
                                      foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                      suscription,
                                      medico
                                    }
                                  })
              
                                }
              
                              }
              
                            }
              
                            ApiMariaDBModel.dataUsuarioModel.insertMedico(cbInsertMedico, medico);

                          }else{

                            resolve({
                              mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id} y se ha eliminado el colaborador con id: ${idColaborador}`,
                              usuario: {
                                ...usuarioEdit,
                                foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                suscription
                              }
                            })

                          }
            
            
                        }
            
                      }
                    }
            
                    ApiMariaDBModel.dataUsuarioModel.editUser(cb, usuarioEdit);

                  }

                }
              }


              ApiMariaDBModel.dataUsuarioModel.deleteColaborador(cbDeleteColaborador, idColaborador);
              
            }else if( (rows[0].id_medico === null) && medico !== null ) {

              medico.FK_usuario = parseInt(usuarioEdit.id)

              let cbInsertMedico = (err, results, fields) => {

                if(err){
                  new Error('No Se pudo insertar un Colaborador')
                }else{

                  if(results){

                    medico.id = results.insertId

                    let cb = (err, res) => {

                      if(err){
                        new Error('No hay registros de Usuario')
                      }else{
            
                        if(res){
            
                          let fecha_de_nacimiento = new Date(usuarioEdit.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                              fecha_de_nacimiento = new Date(fecha_de_nacimiento)
            
                              usuarioEdit.fecha_de_nacimiento = fecha_de_nacimiento
            
                              usuarioEdit.permisos = usuarioEdit.permiso === "" ? null : JSON.parse(usuarioEdit.permisos)

                          if(rows[0].id_colaborador !== null){

                            let cbDeleteColaborador = (err,res) => {
                              if(err){
                                new Error('No hay registros de Colaborador')
                              }else{
              
                                if(res){

                                  resolve({
                                    mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id}, se ha agregado un nuevo medico con id: ${medico.id} y se ha eliminado el colaborador con id ${rows[0].id_colaborador}`,
                                    usuario: {
                                      ...usuarioEdit,
                                      foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                      suscription,
                                      medico: {
                                        ...args.editUser.medico,
                                        financiero: {
                                          ...args.editUser.medico.financiero,
                                          documentos: {
                                            dpi_front: args.editUser.medico.financiero.documentos.dpi_front,
                                            dpi_back: args.editUser.medico.financiero.documentos.dpi_back,
                                            licencia_sanitaria: args.editUser.medico.financiero.documentos.licencia_sanitaria,
                                            patente: args.editUser.medico.financiero.documentos.patente,
                                            recibo_colegiado: args.editUser.medico.financiero.documentos.recibo_colegiado,
                                            titulo_academico: args.editUser.medico.financiero.documentos.titulo_academico,
                                            constancia_desechos_solidos: args.editUser.medico.financiero.documentos.constancia_desechos_solidos,
                                            rtu: args.editUser.medico.financiero.documentos.rtu,
                                            factura: args.editUser.medico.financiero.documentos.factura
                                          }
                                        },
                                        horario_atencion: args.editUser.medico.horario_atencion
                                      }
                                    }
                                  })

                                }

                              }
                            }

                            ApiMariaDBModel.dataUsuarioModel.deleteColaborador(cbDeleteColaborador, rows[0].id_colaborador);

                          }else{
                            resolve({
                              mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id} y se ha agregado un nuevo medico con id: ${medico.id}`,
                              usuario: {
                                ...usuarioEdit,
                                foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                suscription,
                                medico: {
                                  ...args.editUser.medico,
                                  financiero: {
                                    ...args.editUser.medico.financiero,
                                    documentos: {
                                      dpi_front: args.editUser.medico.financiero.documentos.dpi_front,
                                      dpi_back: args.editUser.medico.financiero.documentos.dpi_back,
                                      licencia_sanitaria: args.editUser.medico.financiero.documentos.licencia_sanitaria,
                                      patente: args.editUser.medico.financiero.documentos.patente,
                                      recibo_colegiado: args.editUser.medico.financiero.documentos.recibo_colegiado,
                                      titulo_academico: args.editUser.medico.financiero.documentos.titulo_academico,
                                      constancia_desechos_solidos: args.editUser.medico.financiero.documentos.constancia_desechos_solidos,
                                      rtu: args.editUser.medico.financiero.documentos.rtu,
                                      factura: args.editUser.medico.financiero.documentos.factura
                                    }
                                  },
                                  horario_atencion: args.editUser.medico.horario_atencion
                                }
                              }
                            })
                          }
            
            
                        }
            
                      }
                  }
            
                  ApiMariaDBModel.dataUsuarioModel.editUser(cb, usuarioEdit);

                    /*colaborador.id_colaborador = results.insertId

                    resolve({
                      usuario: {
                        ...user,
                        colaborador
                      },
                      mensaje: "Se ha editado un usuario y se ha insertado un colaborador."
                    })*/

                  }

                }

              }

              ApiMariaDBModel.dataUsuarioModel.insertMedico(cbInsertMedico, medico);
              
            }else if( (rows[0].id_medico !== null) && medico !== null ){

              medico.id = rows[0].id_medico

              let cbEditMedico = (err, res) => {

                if(err){
                  new Error('No hay registros de Colaborador')
                }else{
                  if(res){
                    let cb = (err, res) => {

                      if(err){
                        new Error('No hay registros de Usuario')
                      }else{
            
                        if(res){
            
                          let fecha_de_nacimiento = new Date(usuarioEdit.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                              fecha_de_nacimiento = new Date(fecha_de_nacimiento)
            
                              usuarioEdit.fecha_de_nacimiento = fecha_de_nacimiento
            
                              usuarioEdit.permisos = usuarioEdit.permiso === "" ? null : JSON.parse(usuarioEdit.permisos)
            
                          resolve({
                            mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id} y se ha editado el medico con id: ${medico.id}`,
                            usuario: {
                              ...usuarioEdit,
                              foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                              suscription,
                              medico: {
                                ...args.editUser.medico,
                                financiero: {
                                  ...args.editUser.medico.financiero,
                                  documentos: {
                                    dpi_front: args.editUser.medico.financiero.documentos.dpi_front,
                                    dpi_back: args.editUser.medico.financiero.documentos.dpi_back,
                                    licencia_sanitaria: args.editUser.medico.financiero.documentos.licencia_sanitaria,
                                    patente: args.editUser.medico.financiero.documentos.patente,
                                    recibo_colegiado: args.editUser.medico.financiero.documentos.recibo_colegiado,
                                    titulo_academico: args.editUser.medico.financiero.documentos.titulo_academico,
                                    constancia_desechos_solidos: args.editUser.medico.financiero.documentos.constancia_desechos_solidos,
                                    rtu: args.editUser.medico.financiero.documentos.rtu,
                                    factura: args.editUser.medico.financiero.documentos.factura
                                  }
                                },
                                horario_atencion: args.editUser.medico.horario_atencion
                              }
                            }
                          })
            
                        }
            
                      }
                    }
            
                    ApiMariaDBModel.dataUsuarioModel.editUser(cb, usuarioEdit);

                  }
                }

              }

              ApiMariaDBModel.dataUsuarioModel.editMedico(cbEditMedico, medico);

            }else if( (rows[0].id_medico !== null) && medico === null ){

              let idMedico = rows[0].id_medico

              let cbDeleteMedico = (err,res) => {
                if(err){
                  new Error('No hay registros de Colaborador')
                }else{

                  if(res){

                    let cb = (err, res) => {

                      if(err){
                        new Error('No hay registros de Usuario')
                      }else{
            
                        if(res){
            
                          let fecha_de_nacimiento = new Date(usuarioEdit.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                              fecha_de_nacimiento = new Date(fecha_de_nacimiento)
            
                              usuarioEdit.fecha_de_nacimiento = fecha_de_nacimiento
            
                              usuarioEdit.permisos = usuarioEdit.permiso === "" ? null : JSON.parse(usuarioEdit.permisos)

                          if(colaborador !== null){

                            colaborador.FK_usuario = parseInt(usuarioEdit.id)

                            let cbInsertColaborador = (err, results, fields) => {
              
                              if(err){
                                new Error('No Se pudo insertar un Colaborador')
                              }else{
              
                                if(results){
              
                                  colaborador.id = results.insertId

                                  resolve({
                                    mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id}, se ha eliminado el medico con id: ${idMedico} y se ha creado el colaborador con id: ${colaborador.id}`,
                                    usuario: {
                                      ...usuarioEdit,
                                      foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                      suscription,
                                      colaborador
                                    }
                                  })
              
                                }
              
                              }
              
                            }
              
                            ApiMariaDBModel.dataUsuarioModel.insertColaborador(cbInsertColaborador, colaborador);

                          }else{

                            resolve({
                              mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id} y se ha eliminado el medico con id: ${idMedico}`,
                              usuario: {
                                ...usuarioEdit,
                                foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                                suscription
                              }
                            })

                          }
            
            
                        }
            
                      }
                    }
            
                    ApiMariaDBModel.dataUsuarioModel.editUser(cb, usuarioEdit);

                  }

                }
              }


              ApiMariaDBModel.dataUsuarioModel.deleteMedico(cbDeleteMedico, idMedico);
              
            } else {

              let cb = (err, res) => {

                if(err){
                  new Error('No hay registros de Usuario')
                }else{
      
                  if(res){
      
                    let fecha_de_nacimiento = new Date(usuarioEdit.fecha_de_nacimiento).toString().replace(/GMT\+.*$|GMT\-.*$/g,'GMT-0600')
                        fecha_de_nacimiento = new Date(fecha_de_nacimiento)
      
                        usuarioEdit.fecha_de_nacimiento = fecha_de_nacimiento
      
                        usuarioEdit.permisos = usuarioEdit.permiso === "" ? null : JSON.parse(usuarioEdit.permisos)
      
                    resolve({
                      mensaje: `Se ha actualizado el usuario con id: ${usuarioEdit.id}`,
                      usuario: {
                        ...usuarioEdit,
                        foto_perfil: ((usuarioEdit.foto_perfil === null) || (usuarioEdit.foto_perfil === undefined)) ? null : convertBlobToBase64(usuarioEdit.foto_perfil),
                        suscription
                      }
                    })
      
                  }
      
                }
              }
      
              ApiMariaDBModel.dataUsuarioModel.editUser(cb, usuarioEdit);

            }

          }

        }

      }

      ApiMariaDBModel.dataUsuarioModel.getUser(cbGetUser, usuarioEdit.id);

    }

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Editar un Usuario en MariaDB

//Funcion para Eliminar un Usuario en MariaDB
async function deleteUser(rootValue, args, context) {

  let idUsuario = args.idUsuario

  let idColaborador = args.idColaborador

  let idMedico = args.idMedico

  let promise = new Promise((resolve, reject) => {

    //take token from client
    let token = cookieToJson(context.req.headers.cookie)
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

    if(usuario){

      if(idColaborador !== null){

        let cbColaborador = (err,res) => {
          if(err){
            new Error('No hay registros de Colaborador')
          }else{

            if(res){

              let cb = (err, res) => {
  
                if(err){
                  new Error('No hay registros de Usuario')
                }else{
      
                  if(res){
      
                    resolve({
                      mensaje: `Se ha eliminado el usuario con id: ${idUsuario} y el colaborador con id: ${idColaborador}`,
                      idUsuario
                    })
      
                  }
      
                }
              }
      
              ApiMariaDBModel.dataUsuarioModel.deleteUser(cb, idUsuario);

            }

          }
        }

        ApiMariaDBModel.dataUsuarioModel.deleteColaborador(cbColaborador, idColaborador);

      }else if(idMedico !== null){

        let cbMedico = (err,res) => {
          if(err){
            new Error('No hay registros de Medico')
          }else{

            if(res){

              let cb = (err, res) => {
  
                if(err){
                  new Error('No hay registros de Usuario')
                }else{
      
                  if(res){
      
                    resolve({
                      mensaje: `Se ha eliminado el usuario con id: ${idUsuario} y el medico con id: ${idMedico}`,
                      idUsuario
                    })
      
                  }
      
                }
              }
      
              ApiMariaDBModel.dataUsuarioModel.deleteUser(cb, idUsuario);

            }

          }
        }

        ApiMariaDBModel.dataUsuarioModel.deleteMedico(cbMedico, idMedico);

      } else {

        let cb = (err, res) => {
  
            if(err){
              new Error('No hay registros de Usuario')
            }else{
  
              if(res){
  
                resolve({
                  mensaje: `Se ha eliminado el usuario con id: ${idUsuario}`,
                  idUsuario
                })
  
              }
  
            }
        }
  
        ApiMariaDBModel.dataUsuarioModel.deleteUser(cb, idUsuario);

      }


    }

  })

  

  let result = await promise; // wait till the promise resolves (*)

  //console.log(result); // "done!"

  return result
  
}
//Termina Funcion para Eliminar un Usuario en MariaDB


module.exports = { registerUser, getAllEspecialidadesMedico, registerMedico, updateMedicoState, insertEspecialidadMedico, insertUser, suscriptionUser, editUser, deleteUser, getAllUsers }