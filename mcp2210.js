var hid = require('node-hid');
var parser = require('./src/parse-response');
var idlist = require('./src/idlist').list;

function toHex(i){
  return ('000' + Number(i).toString(16)).slice(-4);
};

function mcp2210(path, responseHandler){
  if(!responseHandler){
    responseHandler = console.log;
  }
  this.hid = new hid.HID(path);
  this.hid.on('data', parser.parseResponse(responseHandler));
  this.hid.on('error', function(error){responseHandler('HIDError', error)});
};

mcp2210.prototype = {
  hid: null
};

mcp2210.prototype.readStatus = function(){
  this.hid.write([0x10, 0x00, 0x00]);
};

mcp2210.prototype.cancelSPITransfer = function(){
  this.hid.write([0x11, 0x00, 0x00]);
};

mcp2210.prototype.readInterruptNum = function(reset){
  this.hid.write([0x12, reset ? 0x00 : 0x01]);
};

mcp2210.prototype.readChipConfig = function(){
  this.hid.write([0x20, 0x00, 0x00]);
};

mcp2210.prototype.readGPIOValue = function(){
  this.hid.write([0x31, 0x00, 0x00]);
};

mcp2210.prototype.readGPIODir = function(){
  this.hid.write([0x33, 0x00, 0x00]);
};

mcp2210.prototype.readSPIConfig = function(){
  this.hid.write([0x41, 0x00, 0x00]);
};

mcp2210.prototype.readEEPROM = function(address){
  this.hid.write([0x50, address & 0xff, 0x00, 0x00]);
};

mcp2210.prototype.readPowerUpSPIConfig = function(){
  this.hid.write([0x61, 0x10, 0x00]);
};

mcp2210.prototype.readPowerUpChipConfig = function(){
  this.hid.write([0x61, 0x20, 0x00]);
};

mcp2210.prototype.readUSBKeyParameters = function(){
  this.hid.write([0x61, 0x30, 0x00]);
};

mcp2210.prototype.readProductName = function(){
  this.hid.write([0x61, 0x40, 0x00]);
};

mcp2210.prototype.readManufacturerName = function(){
  this.hid.write([0x61, 0x50, 0x00]);
};

mcp2210.prototype.requestBusRelease = function(ack){
  this.hid.write([0x80, ack ? 0x01 : 0x00, 0x00]);
};

mcp2210.prototype.sendPassword = function(password){
  this.hid.write([0x70, 0x00, 0x00, 0x00].concat(password.concat([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])));
};

/*
    case 0x21:
      type = 'ChipConfigWrite';
      break;
    case 0x30:
      type = 'GPIOWrite';
      ret = parseGPIO(data);
      break;
    case 0x32:
      type = 'GPIODirWrite';
      break;
    case 0x40:
      type = 'SPIConfigWrite';
      ret = parseSPIConf(data);
      break;
    case 0x42:
      type = 'SPITransfer';
      ret = parseTransfer(data);
      break;
    case 0x51:
      type = 'EEPROMWrite';
      break;
    case 0x60:
      switch(data[2]){
        case 0x10:
          type = 'PowerUpSPIConfigWrite';
          break;
        case 0x20:
          type = 'PowerUpChipConfigWrite';
          break;
        case 0x30:
          type = 'USBKeyParametersWrite';
          break;
        case 0x40:
          type = 'USBProductNameWrite';
          break;
        case 0x50:
          type = 'USBManufactuererNameWrite';
          break;
        default:
          type = 'NVRAMWrite';
          break;
      }
      break;
*/




exports.mcp2210 = mcp2210;

exports.getDevices = function(){
  var devices = hid.devices();
  var ret = [];
  for(var i = 0; i < devices.length; i++){
    var devid = toHex(devices[i].vendorId) + ';' + toHex(devices[i].productId);
    if(idlist.indexOf(devid) > -1){
      devices[i].open = function(handler){
        return new mcp2210(this.path, handler);
      };
      ret.push(devices[i]);
    }
  }
  return ret;
};
