exports.current = function(read, write){
  return {
    get: function(){
      write([0x31, 0x00, 0x00]);
      var data = read();
      var ret = [];
      if(data[0] === 0x31 && data[1] === 0x00){
        for(var i=0; i<8; i++){
          ret.push((data[4] >> i) & 1);
        }
        ret.push(data[5] & 1)
        return ret;
      }
      return null;
    },
    set: function(val){
      var out = [0x30, 0x00, 0x00, 0x00, 0x00, 0x00]
      if(Array.isArray(val) && val.length === 9){
        for(var i=0; i<8; i++){
          out[4] = out[4] | ((val[i] ? 1 : 0) << i);
        }
        out[5] = val[8] ? 1 : 0;
        write(out);
        var data = read();
        var ret = [];
        if(data[0] === 0x30 && data[1] === 0x00){
          for(var i=0; i<8; i++){
            ret.push((data[4] >> i) & 1);
          }
          ret.push(data[5] & 1)
          return ret;
        }        
      }
      return null;
    },
    enumerable: true
  };
};

exports.dir = function(read, write){
  return {
    get: function(){
      write([0x33, 0x00, 0x00]);
      var data = read();
      var ret = [];
      if(data[0] === 0x33 && data[1] === 0x00){
        for(var i=0; i<8; i++){
          ret.push((data[4] >> i) & 1);
        }
        ret.push(data[5] & 1)
        return ret;
      }
      return null;
    },
    set: function(val){
      var out = [0x32, 0x00, 0x00, 0x00, 0x00, 0x00]
      if(Array.isArray(val) && val.length === 9){
        for(var i=0; i<8; i++){
          out[4] = out[4] | ((val[i] ? 1 : 0) << i);
        }
        out[5] = val[8] ? 1 : 0;
        write(out);
        var data = read();
        var ret = [];
        if(data[0] === 0x32 && data[1] === 0x00){
          return val;
        }        
      }
      return null;
    },
    enumerable: true
  };
};

exports.nvm = function(read, write){
  return {
    get: function(){
      
    },
    set: function(val){
    },
    enumerable: true
  };
};
