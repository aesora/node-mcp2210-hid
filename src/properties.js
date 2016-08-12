exports.gpio = require('./properties_gpio');
exports.config = require('./properties_config');

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
                         defaultDir: (data[15] >> i) & 1});
        }
        ret.gpio.push({designation: data[12],
                       defaultOutput: data[14] & 1,
                       defaultDir: data[16] & 1});
        ret.remoteWakeUp = (data[17] >> 4) & 1;
        ret.interruptMode = (data[17] >> 1) & 7;
        ret.autoRelease = data[17] & 1;
        ret.accessControl = data[18];
        return ret;
      }
      return undefined;

    },
    set: function(val){
      //TODO
    },
    enumerable: true
  };
};

exports.ram1 = function(read, write){
  return {
    get: function(){
      write([0x20, 0x00, 0x00]);
      var data = read();
      var ret = {};
      ret.gpio = [];
      if(data[0] === 0x20 && data[1] === 0x00){
        for(var i=0; i<8; i++){
          ret.gpio.push({designation: data[4+i],
                         defaultOutput: (data[13] >> i) & 1,
                         defaultDir: (data[15] >> i) & 1});
        }
        ret.gpio.push({designation: data[12],
                       defaultOutput: data[14] & 1,
                       defaultDir: data[16] & 1});
        ret.remoteWakeUp = (data[17] >> 4) & 1;
        ret.interruptMode = (data[17] >> 1) & 7;
        ret.autoRelease = data[17] & 1;
        ret.accessControl = data[18];
        return ret;
      }
      return undefined;

    },
    set: function(val){
      //TODO
    },
    enumerable: true
  };
};

exports.nvm2 = function(read, write){
  return {
    get: function(){
      write([0x61, 0x10, 0x00]);
      var data = read();
      var ret = {};
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x10){
        ret.bitRate = data[4] + (data[5] << 8) + (data[6] << 16) + (data[7] << 24);
        ret.idleCS = [];
        for(var i=0; i<8; i++){
          ret.idleCS.push((data[8] >> i) & 1);
        }
        ret.idleCS.push(data[9] & 1)
        ret.activeCS = [];
        for(var i=0; i<8; i++){
          ret.activeCS.push((data[10] >> i) & 1);
        }
        ret.activeCS.push(data[11] & 1)
        ret.delayCStoD = data[12] + (data[13] << 8);
        ret.delayDtoCS = data[14] + (data[15] << 8);
        ret.delayB = data[16] + (data[17] << 8);
        ret.bytesPerTransaction = data[12] + (data[13] << 8);
        ret.spiMode = data[20];
        return ret;
      }
      return undefined;
    },
    set: function(val){
      //TODO
    },
    enumerable: true
  };
};

exports.ram2 = function(read, write){
  return {
    get: function(){
      write([0x41, 0x00, 0x00]);
      var data = read();
      var ret = {};
      if(data[0] === 0x41 && data[1] === 0x00){
        ret.bitRate = data[4] + (data[5] << 8) + (data[6] << 16) + (data[7] << 24);
        ret.idleCS = [];
        for(var i=0; i<8; i++){
          ret.idleCS.push((data[8] >> i) & 1);
        }
        ret.idleCS.push(data[9] & 1)
        ret.activeCS = [];
        for(var i=0; i<8; i++){
          ret.activeCS.push((data[10] >> i) & 1);
        }
        ret.activeCS.push(data[11] & 1)
        ret.delayCStoD = data[12] + (data[13] << 8);
        ret.delayDtoCS = data[14] + (data[15] << 8);
        ret.delayB = data[16] + (data[17] << 8);
        ret.bytesPerTransaction = data[12] + (data[13] << 8);
        ret.spiMode = data[20];
        return ret;
      }
      return undefined;
    },
    set: function(val){
      //TODO
    },
    enumerable: true
  };
};
