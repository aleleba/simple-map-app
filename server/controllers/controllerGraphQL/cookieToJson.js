cookieToJson = (cookie) =>{

    if( cookie !== undefined){
      var output = {};
      cookie.split(/\s*;\s*/).forEach(function(pair) {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
      });
      //var json = JSON.stringify(output, null, 4);
      return output
    }else{
      return undefined
    }
  
  }
  
  module.exports = { cookieToJson }