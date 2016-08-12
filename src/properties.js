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
      return undefined;
    },
    enumerable: true
  };
};

exports.nvm1 = function(read, write){
  return {
    get: function(){
      write([0x61, 0x20, 0x00]);
      var data = read();
      var ret = {};
      ret.gpio = [];
      if(data[0] === 0x61 && data[1] === 0x00 & data[2] === 0x20){
        for(var i=0; i<8; i++){
          ret.gpio.push({designation: data[4+i],
                         defaultOutput: (data[13] >> i) & 1,
                         defaultDir: (data[15] >> i) & 1};
        }
        ret.gpio.push({designation: data[12],
                       defaultOutput: data[14] & 1,
                       defaultDir: data[16] & 1};
//TODO...
        return ret;
      }
      return undefined;

    },
    /*TODO: set*/
    enumerable: true
  };
};

exports.nvm2 = function(read, write){
  return {
    get: function(){
      return undefined;
    },
    /*TODO: set*/
    enumerable: true
  };
};
