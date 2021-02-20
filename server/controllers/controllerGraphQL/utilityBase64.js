let guessMimeType = (data) => {
    if(data.charAt(0)=='/'){
      return "image/jpeg";
    }else if(data.charAt(0)=='R'){
      return "image/gif";
    }else if(data.charAt(0)=='i'){
      return "image/png";
    }else if(data.charAt(0)=='J'){
      return "application/pdf";
    }
}

let convertBase64ToBlob = (data) => {
    return Buffer.from(data.split(",")[1], "base64")
}

let convertBlobToBase64 = (data) => {

    let dataSinTipo = data.toString('base64'),
        dataTipo = guessMimeType(dataSinTipo),
        base64Construct = `data:${dataTipo};base64,${dataSinTipo}`

    return base64Construct

}

module.exports = { guessMimeType, convertBase64ToBlob, convertBlobToBase64 }