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

exports.unlock = function(read, write){
  return {
    value: function(password){
      if(Array.isArray(password) && password.length > 0 && password.length < 9){
        write([0x70, 0x00, 0x00, 0x00].concat(password.concat([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
        var data = read();
        return data[0] === 0x70 && data[1] === 0x00;
      }
      return false;
    },
    enumerable: true
  };
};


exports.release = function(read, write){
  return {
    value: function(ack){
      write([0x80, ack ? 0x01 : 0x00, 0x00]);
      var data = read();
      return data[0] === 0x80 && data[1] === 0x00;      
    },
    enumerable: true
  };
};

exports.cancel = function(read, write){
  return {
    value: function(){
      write([0x11, 0x00, 0x00]);
      var data = read();
      return data[0] === 0x11 && data[1] === 0x00;
    },
    enumerable: true
  };
};

exports.interrupt = function(read, write){
  return {
    value: function(reset){
      write([0x12, reset ? 0x00 : 0x01]);
      var data = read();
      return data[0] === 0x12 && data[1] === 0x00 ? data[4] + (data[5] << 8) : undefined;
    },
    enumerable: true
  };
};

exports.eeprom = function(read, write, address){
  return {
    get: function(){
      write([0x50, address, 0x00]);
      var data = read();
      if(data[0] === 0x50 && data[1] === 0x00 && data[2] === address){
        return data[3];
      }
      return undefined;
    },
    set: function(val){
      if(typeof val === 'number'){
        val = val & 0xff;
        write([0x51, address, val]);
        var data = read();
        if(data[0] === 0x51 && data[1] === 0x00){
          return val;
        }
      }
      return undefined;
    },
    enumerable: true
  };
};

exports.password = function(read, write){
  return {
    value: function(password){
      if(Array.isArray(password) && password.length > 0 && password.length < 9){
        write([0x61, 0x20, 0x00, 0x00]);
        var data = read();
        if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x20){
          data[0] = 0x60;
          data[1] = 0x20;
          data[2] = 0x00;
          data[3] = 0x00;
          for(var i = 0; i < password.length; i++){
            data[19+i] = password[i];
          }
          write(data);
          var data = read();
          return data[0] === 0x60 && data[1] === 0x00 && data[2] === 0x20;
        }
      }
      return false;
    },
    enumerable: true
  };
};

exports.transfer = function(read, write){
  return {
    value: function(data, cb){
      if(Array.isArray(data)){
        var out = [0x42, Math.min(data.length, 60), 0x00, 0x00];
        for(var i = 0; i < data.length && i < 60; i++){
          if(typeof data[i] !== 'number'){
            cb('invalid data');
            return;
          }
          out[4+i] = data[i];
        }
        write(out);
        while(true){
          var input = read();
          if(input[0] === 0x42){
            if(input[1] === 0x00){
              var ret = [];
              for(var i = 0; i < input[2] && i < 60; i++){
                ret.push(input[4+i]);
              }
              switch(input[3]){
                case 0x10:
                  cb(null, 5, ret);
                  return;
                  break;
                case 0x20:
                  cb(null, 2, ret);
                  break;
                case 0x30:
                  cb(null, 4, ret);
                  break;
              }
            }else if(input[1] === 0xf8){
              cb('bus busy', 3);
              return;
            }else if(input[1] === 0xf7){
              cb('bus not available', 1);
              return;
            }
          }
          write([0x42, 0x00, 0x00, 0x00]);
        }
      }
      cb('invalid data');
      return;
    },
    enumerable: true
  };
};
