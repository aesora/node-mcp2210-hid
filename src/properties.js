exports.gpio = require('./properties_gpio');

exports.status = function(read, write){
  return {
    get: function(){
      write([0x10, 0x00, 0x00]);
      var data = read();
      var ret = {};
      if(data[0] === 0x10 && data[1] === 0x00){
        ret.extReqRelease = data[2] === 0x00;
        ret.busOwner = data[3];
        ret.passwordCount = data[4];
        ret.passwordGuessed = data[5] === 0x01;
        return ret;
      }
      return null;
    },
    enumerable: true
  };
};

