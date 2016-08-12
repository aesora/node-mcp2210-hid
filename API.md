# API

## `node-mcp2210-hid`
 - [mcp2210]
 - [pinDesignation]
 - [interruptMode]
 - [accessControl]
 - [powerOption]
 - [busOwner]
 - [transferStatus]
 - `getDevices()`: [deviceInfo] *returns array of hid devices filtered using [idList]*

## public

#### `mcp2210`
 - `gpio.nvm`: [gpioInfo]\[9\]
 - `gpio.ram`: [gpioInfo]\[9\]
 - `gpio.current`: boolean\[9\]
 - `config`: [baseConfig]
 - `config.nvm`: [config]
 - `config.ram`: [config]
 - `status`: [status]
 - `busy`: boolean
 - `init([password])` *reloads all values from the chip - usually not needed* ***`password` is an array of up to 8 bytes***
 - `cancel()` *cancel the current transfer (if `busy`)*
 - `transfer(data, cb)` *transfers data and calls `cb(err, status, data)` for each response*  (see [transferStatus])
 - `getInterruptCount([resetCounter])`: number
 - `getEEPROM(index)`: number
 - `setEEPROM(index, value)`: boolean *writes value to EEPROM and returns the success*
 - `unlock(password)`: boolean *returns success* ***`password` is an array of up to 8 bytes***
 - `setPassword(password)` ***`password` is an array of up to 8 bytes***

#### `pinDesignation`
> The function of a pin.

 - `GPIO` *general purpose I/O*
 - `CS` *chip select*
 - `DF` *dedicated function*

### `interruptMode`
> Which changes to count on the interrupt pin

 - `NONE`
 - `FALLING`
 - `RISING`
 - `LOW`
 - `HIGH`

#### `accessControl`
 - `UNPROTECTED` *not protected*
 - `PASSWORD` *protected by password*
 - `LOCKED` *permanently locked*

#### `powerOption`
 - `HOST` *host powered*
 - `SELF` *self-powered*
 - `REMOTECAPABLE` *remote wake-up capable*

#### `busOwner`
 - `NONE` *no owner*
 - `BRIDGE` *bus owned by USB bridge (MCP2210)*
 - `EXT` *bus owned by external master*

#### `transferStatus`
 - `NOTAVAILABLE` *bus is currently not available (controlled by external owner)*
 - `BUSY` *SPI transfer in progress (cannot accept new data)*
 - `SUCCESS` *transfer is done*
 - `STARTED` *transfer started*
 - `WAITING` *transfer is in progress*

### internal

#### `baseConfig`
 - `manufacturerName`: string ***shorter than 29 characters***
 - `productName`: string ***shorter than 29 characters***
 - `vendorId`: integer
 - `productId`: integer
 - `powerOption`: [powerOption]\[0-3\]
 - `requestCurrent`: integer *requested current in mA*

#### `config`
 - `remoteWakeUp`: boolean *whether remote wake-up is enabled*
 - `interruptMode`: [interruptMode]
 - `autoRelease`: boolean *whether to release the bus between transfers*
 - `accessControl`: [accessControl]
 - `bitRate`: integer *32 bit value  of bitrate*
 - `idleCS`: boolean\[9\]
 - `activeCS`: boolean\[9\]
 - `delayCStoD`: integer *16 bit value of delay between asserting CS and the first bit of data (in 100us)*
 - `delayDtoCS`: integer *16 bit value of delay between the last bit of data and de-asserting CS (in 100us)*
 - `delayB`: integer *16 bit value of delay between consecutive data bytes (in 100us)*
 - `bytesPerTransaction`: integer *16 bit value of how many bytes to send per transaction*
 - `spiMode`: integer *the SPI mode to use*

#### `deviceInfo`
> Device info copied from `node-hid` + `open()` function.

 - `vendorId`: integer
 - `productId`: integer
 - `path`: string
 - `open([password])`: [mcp2210] *opens the selected device (using password if one is supplied)* ***`password` is an array of up to 8 bytes***

#### `gpioInfo`
 - `designation`: [pinDesignation]
 - `defaultOutput`: boolean
 - `defaultDirection`: boolean

#### `gpioInfoShort`
 - `value`: boolean
 - `direction`: boolean

#### `status`
 - `extReqRelease`: boolean *pending external request for SPI bus release*
 - `currentOwner`: [busOwner] *current SPI bus owner*
 - `passwordCount`: integer *count of password tries*
 - `passwordGuessed`: boolean

#### `idList`
> A list of all VID/PID combinations that should be considered a MCP2210. See [idlist.js](src/idlist.js) for more info.

