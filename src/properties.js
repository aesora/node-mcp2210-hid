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
      var out = [0x60, 0x20, 0x00, 0x00];
      if(Array.isArray(val.gpio) && val.gpio.length === 9){
        out[13] = 0x00;
        out[15] = 0x00;
        for(var i = 0; i < 9; i++){
          if(typeof val.gpio[i].designation !== 'number') return;
          out[4+i] = val.gpio[i].designation & 0xff;
          val.gpio[i].defaultOutput = val.gpio[i].defaultOutput ? 1 : 0;
          val.gpio[i].defaultDir = val.gpio[i].defaultDir ? 1 : 0;
          if(i < 8){
            out[13] = out[13] | (val.gpio[i].defaultOutput << i);
            out[15] = out[15] | (val.gpio[i].defaultDir << i);
          }
          out[14] = val.gpio[8].defaultOutput;
          out[16] = val.gpio[8].defaultDir;
        }
        if(typeof val.accessControl !== 'number') return;
        if(typeof val.interruptMode !== 'number') return;
        val.remoteWakeUp = val.remoteWakeUp ? 1 : 0;
        val.autoRelease = val.autoRelease ? 1 : 0;
        out[17] = val.autoRelease | ((val.interruptMode & 7) << 1) | (val.remoteWakeUp << 4);
        out[18] = val.accessControl & 0xff;
        out[19] = 0x00;
        out[20] = 0x00;
        out[21] = 0x00;
        out[22] = 0x00;
        out[23] = 0x00;
        out[24] = 0x00;
        out[25] = 0x00;
        out[26] = 0x00;
        write(out);
        var data = read();
        if(data[0] === 0x60 && data[1] === 0x00 && data[2] === 0x20){
          return val;
        }
      }
      return undefined;
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
      var out = [0x21, 0x00, 0x00, 0x00];
      if(Array.isArray(val.gpio) && val.gpio.length === 9){
        out[13] = 0x00;
        out[15] = 0x00;
        for(var i = 0; i < 9; i++){
          if(typeof val.gpio[i].designation !== 'number') return;
          out[4+i] = val.gpio[i].designation & 0xff;
          val.gpio[i].defaultOutput = val.gpio[i].defaultOutput ? 1 : 0;
          val.gpio[i].defaultDir = val.gpio[i].defaultDir ? 1 : 0;
          if(i < 8){
            out[13] = out[13] | (val.gpio[i].defaultOutput << i);
            out[15] = out[15] | (val.gpio[i].defaultDir << i);
          }
          out[14] = val.gpio[8].defaultOutput;
          out[16] = val.gpio[8].defaultDir;
        }
        if(typeof val.accessControl !== 'number') return;
        if(typeof val.interruptMode !== 'number') return;
        val.remoteWakeUp = val.remoteWakeUp ? 1 : 0;
        val.autoRelease = val.autoRelease ? 1 : 0;
        out[17] = val.autoRelease | ((val.interruptMode & 7) << 1) | (val.remoteWakeUp << 4);
        out[18] = val.accessControl & 0xff;
        out[19] = 0x00;
        out[20] = 0x00;
        out[21] = 0x00;
        out[22] = 0x00;
        out[23] = 0x00;
        out[24] = 0x00;
        out[25] = 0x00;
        out[26] = 0x00;
        write(out);
        var data = read();
        if(data[0] === 0x21 && data[1] === 0x00){
          return val;
        }
      }
      return undefined;
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
        ret.bitRate = data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24);
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
        ret.delayCStoD = data[12] | (data[13] << 8);
        ret.delayDtoCS = data[14] | (data[15] << 8);
        ret.delayB = data[16] | (data[17] << 8);
        ret.bytesPerTransaction = data[18] | (data[19] << 8);
        ret.spiMode = data[20];
        return ret;
      }
      return undefined;
    },
    set: function(val){
      var out = [0x60, 0x10, 0x00, 0x00];
      if(typeof val.bitRate === 'number' && typeof val.delayCStoD === 'number' && typeof val.delayDtoCS === 'number' && typeof val.delayB === 'number' &&
         typeof val.bytesPerTransaction === 'number' && typeof val.spiMode === 'number' && Array.isArray(val.idleCS) && Array.isArray(val.activeCS) && val.idleCS.length === 9 &&
         val.activeCS.length === 9){
        out[4] = val.bitRate & 0xff;
        out[5] = (val.bitRate >> 8) & 0xff;
        out[6] = (val.bitRate >> 16) & 0xff;
        out[7] = (val.bitRate >> 24) & 0xff;
        out[8] = 0;
        out[10] = 0;
        for(var i = 0; i < 9; i++){
          val.idleCS[i] = val.idleCS[i] ? 1 : 0;
          val.activeCS[i] = val.activeCS[i] ? 1 : 0;
          if(i < 8){
            out[8] = out[8] | val.idleCS[i] << i;
            out[10] = out[10] | val.activeCS[i] << i;
          }
        }
        out[9] = val.idleCS[8];
        out[11] = val.activeCS[8];
        out[12] = val.delayCStoD & 0xff;
        out[13] = (val.delayCStoD >> 8) & 0xff;
        out[14] = val.delayDtoCS & 0xff;
        out[15] = (val.delayDtoCS >> 8) & 0xff;
        out[16] = val.delayB & 0xff;
        out[17] = (val.delayB >> 8) & 0xff;
        out[18] = val.bytesPerTransaction & 0xff;
        out[19] = (val.bytesPerTransaction >> 8) & 0xff;
        out[20] = val.spiMode & 0xff;
        write(out);
        var data = read();
        if(data[0] === 0x60 && data[1] === 0x00 && data[2] === 0x10){
          return val;
        }
      }
      return undefined;
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
        ret.bitRate = data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24);
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
        ret.delayCStoD = data[12] | (data[13] << 8);
        ret.delayDtoCS = data[14] | (data[15] << 8);
        ret.delayB = data[16] | (data[17] << 8);
        ret.bytesPerTransaction = data[18] | (data[19] << 8);
        ret.spiMode = data[20];
        return ret;
      }
      return undefined;
    },
    set: function(val){
      var out = [0x40, 0x00, 0x00, 0x00];
      if(typeof val.bitRate === 'number' && typeof val.delayCStoD === 'number' && typeof val.delayDtoCS === 'number' && typeof val.delayB === 'number' &&
         typeof val.bytesPerTransaction === 'number' && typeof val.spiMode === 'number' && Array.isArray(val.idleCS) && Array.isArray(val.activeCS) && val.idleCS.length === 9 &&
         val.activeCS.length === 9){
        out[4] = val.bitRate & 0xff;
        out[5] = (val.bitRate >> 8) & 0xff;
        out[6] = (val.bitRate >> 16) & 0xff;
        out[7] = (val.bitRate >> 24) & 0xff;
        out[8] = 0;
        out[10] = 0;
        for(var i = 0; i < 9; i++){
          val.idleCS[i] = val.idleCS[i] ? 1 : 0;
          val.activeCS[i] = val.activeCS[i] ? 1 : 0;
          if(i < 8){
            out[8] = out[8] | val.idleCS[i] << i;
            out[10] = out[10] | val.activeCS[i] << i;
          }
        }
        out[9] = val.idleCS[8];
        out[11] = val.activeCS[8];
        out[12] = val.delayCStoD & 0xff;
        out[13] = (val.delayCStoD >> 8) & 0xff;
        out[14] = val.delayDtoCS & 0xff;
        out[15] = (val.delayDtoCS >> 8) & 0xff;
        out[16] = val.delayB & 0xff;
        out[17] = (val.delayB >> 8) & 0xff;
        out[18] = val.bytesPerTransaction & 0xff;
        out[19] = (val.bytesPerTransaction >> 8) & 0xff;
        out[20] = val.spiMode & 0xff;
        write(out);
        var data = read();
        if(data[0] === 0x40 && data[1] === 0x00){
          return val;
        }
      }
      return undefined;
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
      return data[0] === 0x12 && data[1] === 0x00 ? data[4] | (data[5] << 8) : undefined;
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
