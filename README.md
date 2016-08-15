# node-mcp2210-hid
MCP2210 API using node-hid

## Installation
Simply run `npm install node-mcp2210-hid`. Make sure that your current user has proper access to the HID device.

## Examples
### Openening the device
This example opens the first MCP2210 found on your computer 
```
var mcp2210 = require('node-mcp2210-hid'),
    devices = mcp2210.getDevices();
if(devices.length > 0){
  var dev = devices[0].open();
  console.log('Successfully opened ' + dev.config.productName + ' by ' + dev.config.manufacturerName);
}
```

### GPIO
The following example sets GP2 to the input of GP1 and toggles GP0 every 500ms.
```
var mcp2210 = require('node-mcp2210-hid'),
    devices = mcp2210.getDevices();
if(devices.length > 0){
  var dev = devices[0].open(),
      ram1 = dev.ram1;
  ram1.gpio[0].designation = mcp2210.pinDesignation.GPIO;
  ram1.gpio[1].designation = mcp2210.pinDesignation.GPIO;
  ram1.gpio[2].designation = mcp2210.pinDesignation.GPIO;
  ram1.gpio[0].defaultDirection = mcp2210.pinDir.OUT;
  ram1.gpio[1].defaultDirection = mcp2210.pinDir.IN;
  ram1.gpio[2].defaultDirection = mcp2210.pinDir.OUT;
  dev.ram1 = ram1;

  var interval = setInterval(function(){
    var curr = dev.gpio.current;
    curr[2] = curr[1];
    curr[0] = (curr[0] + 1) % 2;
    dev.gpio.current = curr;
  }, 500);
}
```

### Transfer
This example transfers some bytes. By adding a jumper between MOSI and MISO, you get a very simple loopback test.
```
var mcp2210 = require('node-mcp2210-hid'),
    devices = mcp2210.getDevices();
if(devices.length > 0){
  var dev = devices[0].open(),
      ram2 = dev.ram2,
      buffer = [];

  // set number of bytes to transmit
  ram2.bytesPerTransaction = 11;
  dev.ram2 = ram2;

  // start transfer
  dev.transfer([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(err, status, data){
    if(err){
      console.log(err);
    }
    Array.prototype.push.apply(buffer, data);
    if(status === mcp2210.transferStatus.SUCCESS){
      console.log('transfer done, received the following data:', buffer);
    }
  });
}
```

## [API](./API.md)
The full API is documented in [API.md](./API.md).

## License
This library is licensed under the [MIT license](./LICENSE).
