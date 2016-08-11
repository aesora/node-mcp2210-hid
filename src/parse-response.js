exports.parseResponse = function(handler){
function toHex(i){
  return ('000' + Number(i).toString(16)).slice(-4);
}

function parseStatus(data){
  var ret = {};
  ret.pendingReleaseRequest = data[2] === 0x00;
  ret.busOwner = 'Unknown';
  switch(data[3]){
    case 0x00: ret.busOwner = 'None'; break;
    case 0x01: ret.busOwner = 'Bridge'; break;
    case 0x02: ret.busOwner = 'External'; break;
  }
  ret.passwordAttempts = data[4];
  ret.passwordGuessed = data[5] === 0x01;
  return ret;
}

function parseTransfer(data){
  var ret = {};
  if(data[1] === 0x00){
    switch(data[3]){
      case 0x10:
        ret.transferStatus = {cal: 0, message: 'SPI transfer finished - no more data to send'};
        break;
      case 0x20:
        ret.transferStatus = {val: 1, message: 'SPI transfer started - no data to receive'};
        break;
      case 0x30:
        ret.transferStatus = {val: 2, message: 'SPI transfer not finished - received data available'};
        break;
    }
    ret.data = [];
    for(i = 4; i < data[2] + 4 && i < data.length; i++){
      ret.data.push(data[i]);
    }
  }
  return ret;
}

function parseGPIO(data){
  var ret = {};
  ret.gpio0 = data[4] & 0x01;
  ret.gpio1 = (data[4] >> 1) & 0x01;
  ret.gpio2 = (data[4] >> 2) & 0x01;
  ret.gpio3 = (data[4] >> 3) & 0x01;
  ret.gpio4 = (data[4] >> 4) & 0x01;
  ret.gpio5 = (data[4] >> 5) & 0x01;
  ret.gpio6 = (data[4] >> 6) & 0x01;
  ret.gpio7 = (data[4] >> 7) & 0x01;
  ret.gpio8 = data[5] & 0x01;
  return ret;
}

function parseChipConf(data){
  var df = ['', '', 'USBSuspend', 'SPILED', 'USBLP', 'USBConf', 'Interrupt', 'SPIReleaseACK', 'SPIReleaseREQ'];
  var ret = {};
  for(var i = 0; i < 9; i++){
    var tmp = {};
    switch(data[i+4]){
      case 0x00: tmp.designation = 'GPIO'; break;
      case 0x01: tmp.designation = 'CS'; break;
      case 0x02: tmp.designation = df[i]; break;
      default: tmp.designation = 'Unknown'; break;
    }
    if(i === 8){
      tmp.defaultOut = data[14] & 1;
      tmp.defaultDir = data[16] & 1;
    }else{
      tmp.defaultOut = (data[13] >> i) & 1;
      tmp.defaultDir = (data[15] >> i) & 1;
    }
    ret['gpio' + i] = tmp;
  }
  ret.remoteWake = (data[17] >> 4) & 1;
  ret.interruptMode = {val: (data[17] >> 1) & 7};
  switch(ret.interruptMode.val){
    case 0: ret.interruptMode.message = 'Disabled'; break;
    case 1: ret.interruptMode.message = 'Falling'; break;
    case 2: ret.interruptMode.message = 'Rising'; break;
    case 3: ret.interruptMode.message = 'Low'; break;
    case 4: ret.interruptMode.message = 'High'; break;
    case 5: ret.interruptMode.message = 'Low'; break;
    case 6: ret.interruptMode.message = 'High'; break;
    default: ret.interruptMode.message = 'Reserved'; break;
  }
  ret.SPIReleaseEnabled = (data[17] & 1) === 0;
  switch(data[18]){
    case 0x00: ret.accessControl = 'Disabled'; break;
    case 0x40: ret.accessControl = 'Password'; break;
    case 0x80: ret.accessControl = 'Locked'; break;
  }
  return ret;
}

function parseSPIConf(data){
  var ret = {};
  ret.bitrate = data[4] + (data[5] << 8) + (data[6] << 16) + (data[7] << 24);
  for(var i = 0; i < 9; i++){
    var tmp = {};
    if(i === 8){
      tmp.idleCS = data[9] & 1;
      tmp.activeCS = data[11] & 1;
    }else{
      tmp.idleCS = (data[8] >> i) & 1;
      tmp.activeCS = (data[10] >> i) & 1;
    }
    ret['gpio' + i] = tmp;
  }
  ret.enCSDelay_us = (data[12] + (data[13] << 8)) * 100;
  ret.deCSDelay_us = (data[14] + (data[15] << 8)) * 100;
  ret.dataDelay_us = (data[16] + (data[17] << 8)) * 100;
  ret.transactionBytes = data[18] + (data[19] << 8);
  ret.mode = data[20];
  return ret;
}

function parseNVString(data){
  var ret = {};
  ret.descriptorID = data[5];
  ret.value = '';
  for(var i = 6; i < data[4] + 6 - 2 && i < data.length; i+= 2){
    ret.value += String.fromCharCode(data[i] + (data[i+1] << 8));
  }
  return ret;
}

function parseUKParams(data){
  var ret = {};
  ret.vid = toHex(data[12] + (data[13] << 8));
  ret.vid = toHex(data[14] + (data[15] << 8));
  ret.hostPowered = (data[29] >> 7) & 1 === 1;
  ret.selfPowered = (data[29] >> 6) & 1 === 1;
  ret.remoteWakeUp = (data[29] >> 5) & 1 === 1;
  ret.current_ma = (data[30] << 1);
  return ret;
}

return function(data){
  var ret = {},
      type = 'Unknown';
  if(data[1] !== 0xf9) switch(data[0]){
    case 0x10:
      type = 'Status';
      ret = parseStatus(data);
      break;
    case 0x11:
      type = 'SPICancel';
      ret = parseStatus(data);
      break;
    case 0x12:
      type = 'InterruptNum';
      ret.counter = data[4] + (data[5] << 8);
      break;
    case 0x20:
      type = 'ChipConfigRead';
      ret = parseChipConf(data);
      break;
    case 0x21:
      type = 'ChipConfigWrite';
      break;
    case 0x30:
      type = 'GPIOWrite';
      ret = parseGPIO(data);
      break;
    case 0x31:
      type = 'GPIORead';
      ret = parseGPIO(data);
      break;
    case 0x32:
      type = 'GPIODirWrite';
      break;
    case 0x33:
      type = 'GPIODirRead';
      ret = parseGPIO(data);
      break;
    case 0x40:
      type = 'SPIConfigWrite';
      ret = parseSPIConf(data);
      break;
    case 0x41:
      type = 'SPIConfigRead';
      ret = parseSPIConf(data);
      break;
    case 0x42:
      type = 'SPITransfer';
      ret = parseTransfer(data);
      break;
    case 0x50:
      type = 'EEPROMRead';
      ret.address = data[2];
      ret.data = data[3];
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
    case 0x61:
      switch(data[2]){
        case 0x10:
          type = 'PowerUpSPIConfigRead';
          ret = parseSPIConf(data);
          break;
        case 0x20:
          type = 'PowerUpChipConfigRead';
          ret = parseChipConf(data);
          break;
        case 0x30:
          type = 'USBKeyParametersRead';
          ret = parseUKParams(data);
          break;
        case 0x40:
          type = 'ProductNameRead';
          ret = parseNVString(data);
          break;
        case 0x50:
          type = 'ManufacturerNameRead';
          ret = parseNVString(data);
          break;
        default:
          type = 'NVRAMRead';
          break;
      }
      break;
    case 0x70:
      type = 'SendPassword';
      break;
    case 0x80:
      type = 'ReleaseRequest';
      break;
    default: ret = data;
  }
  switch(data[1]){
    case 0x00: ret.status = 'Success'; break;
    case 0xf7: ret.status = 'NoBus'; break;
    case 0xf8: ret.status = 'Fail'; break;
    case 0xf9: ret.status = 'Unknown'; break;
    case 0xfa: ret.status = 'EEPROMFail'; break;
    case 0xfb: // Almost same as 0xfd
    case 0xfc: // Almost same as 0xfd
    case 0xfd: ret.status = 'NoAccess'; break;
    default: ret.status = ''; break;
  }
  handler(type, ret);
};
}
