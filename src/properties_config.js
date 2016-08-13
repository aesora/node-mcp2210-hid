exports.manufacturer = function(read, write){
  return {
    get: function(){
      write([0x61, 0x50, 0x00]);
      var data = read();
      var ret = '';
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x50){
        for(var i = 6; i < data[4] + 6 - 2 && i < data.length; i+= 2){
          ret += String.fromCharCode(data[i] + (data[i+1] << 8));
        }
        return ret;
      }
      return undefined;
    },
    set: function(val){
      var out = [0x60, 0x50, 0x00, 0x00, 0x00, 0x03];
      if(typeof val === 'string'){
        val = val.substr(0,29);
        out[4] = val.length * 2 + 2;
        for(var i = 0; i < val.length; i++){
          out.push(val.charCodeAt(i) & 0xff);
          out.push((val.charCodeAt(i) >> 8) & 0xff);
        }
        write(out);
        var data = read();
        if(data[0] === 0x60 && data[1] === 0x00 && data[2] === 0x50){
          return val;
        }
      }
      return undefined;
    },
    enumerable: true
  };
};

exports.product = function(read, write){
  return {
    get: function(){
      write([0x61, 0x40, 0x00]);
      var data = read();
      var ret = '';
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x40){
        for(var i = 6; i < data[4] + 6 - 2 && i < data.length; i+= 2){
          ret += String.fromCharCode(data[i] + (data[i+1] << 8));
        }
        return ret;
      }
      return undefined;
    },
    set: function(val){
      var out = [0x60, 0x40, 0x00, 0x00, 0x00, 0x03];
      if(typeof val === 'string'){
        val = val.substr(0,29);
        out[4] = val.length * 2 + 2;
        for(var i = 0; i < val.length; i++){
          out.push(val.charCodeAt(i) & 0xff);
          out.push((val.charCodeAt(i) >> 8) & 0xff);
        }
        write(out);
        var data = read();
        if(data[0] === 0x60 && data[1] === 0x00 && data[2] === 0x40){
          return val;
        }
      }
      return undefined;
    },
    enumerable: true
  };
};

exports.vid = function(read, write){
  return {
    get: function(){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30){
        return data[12] + (data[13] << 8);
      }
      return undefined;
    },
    set: function(val){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30 && typeof val === 'number'){
        var ret = [0x60, 0x30, 0x00, 0x00, val & 0xff, (val >> 8) & 0xff, data[14], data[15], data[29], data[30]];
        if(data[0] === 60 && data[1] === 0x00 && data[2] === 0x30){
          return val;
        }
      }
      return undefined;
    },
    enumerable: true
  };
};

exports.pid = function(read, write){
  return {
    get: function(){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30){
        return data[14] + (data[15] << 8);
      }
      return undefined;
    },
    set: function(val){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30 && typeof val === 'number'){
        write([0x60, 0x30, 0x00, 0x00, data[12], data[13], val & 0xff, (val >> 8) & 0xff, data[29], data[30]]);
        if(data[0] === 60 && data[1] === 0x00 && data[2] === 0x30){
          return val;
        }
      }
      return undefined;
    },
    enumerable: true
  };
};

exports.power = function(read, write){
  return {
    get: function(){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30){
        return data[29];
      }
      return undefined;
    },
    set: function(val){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30 & typeof val === 'number'){
        val = val & 0xff;
        write([0x60, 0x30, 0x00, 0x00, data[12], data[13], data[14], data[15], val, data[30]]);
        if(data[0] === 60 && data[1] === 0x00 && data[2] === 0x30){
          return val;
        }
      }
      return undefined;
    },
    enumerable: true
  };
};

exports.current = function(read, write){
  return {
    get: function(){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30){
        return data[30] << 1;
      }
      return undefined;
    },
    set: function(val){
      write([0x61, 0x30, 0x00]);
      var data = read();
      if(data[0] === 0x61 && data[1] === 0x00 && data[2] === 0x30 && typeof val === 'number'){
        val = (val >> 1) & 0xff;
        write([0x60, 0x30, 0x00, 0x00, data[12], data[13], data[14], data[15], data[29], val]);
        var data = read();
        if(data[0] === 60 && data[1] === 0x00 && data[2] === 0x30){
          return val << 1;
        }
      }
      return undefined;
    },
    enumerable: true
  };
};
