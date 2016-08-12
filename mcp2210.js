var hid = require('node-hid');
var deasync = require('deasync');

var properties = require('./src/properties');
var idlist = require('./src/idlist').list;


function toHex(i){
  return ('000' + Number(i).toString(16)).slice(-4);
};


function mcp2210(path){
  this.hid = new hid.HID(path);
  this.hid.readSync = deasync(this.hid.read);
  var read = this.hid.readSync;
  var write = this.hid.write;
  this.gpio = {};
  Object.defineProperties(this, {
    'status': properties.status(this.hid.readSync, this.hid.write),
    'nvm1': properties.nvm1(this.hid.readSync, this.hid.write),
    'nvm2': properties.nvm2(this.hid.readSync, this.hid.write)
  });
  Object.defineProperties(this.gpio, {
    'current': properties.gpio.current(this.hid.readSync, this.hid.write),
    'dir': properties.gpio.dir(this.hid.readSync, this.hid.write)
  });
};

/*
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
};*/

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

exports.pinDesignation = {
  GPIO: 0,
  CS: 1,
  DF: 2
};

exports.interruptMode = {
  NONE: 0,
  FALLING: 1,
  RISING: 2,
  LOW: 3,
  HIGH: 4
};

exports.accessControl = {
  UNPROTECTED: 0x00,
  PASSWORD: 0x40,
  LOCKED: 0x80
};

exports.powerOption = {
  HOST: 0x80,
  SELF: 0x40,
  REMOTECAPABLE: 0x20
};

exports.busOwner = {
  NONE: 0,
  BRIDGE: 1,
  EXT: 2
};

exports.transferStatus = {
  NOTAVAILABLE: 1,
  BUSY: 3,
  SUCCESS: 5,
  STARTED: 2,
  WAITING: 4
};

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
