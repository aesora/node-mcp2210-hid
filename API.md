# API

## `node-mcp2210-hid`
 - [`mcp2210`](#mcp2210)
 - [`pinDesignation`](#pindesignation)
 - [`pinDir`](#pindir)
 - [`interruptMode`](#interruptmode)
 - [`accessControl`](#accesscontrol)
 - [`powerOption`](#poweroption)
 - [`busOwner`](#busowner)
 - [`transferStatus`](#transferstatus)
 - `getDevices()`: [`deviceInfo`](#deviceinfo) *returns array of hid devices filtered using [idList](#idList)*

## public

#### `mcp2210`
 - `nvm1`: [`config1`](#config1)
 - `nvm2`: [`config2`](#config2)
 - `ram1`: [`config1`](#config1)
 - `ram2`: [`config2`](#config2)
 - `config`: [`config`](#config)
 - `status`: [`status`](#status)
 - `eeprom`: `number`\[256\]
 - `gpio.current`: `boolean`\[9\]
 - `gpio.dir`: `boolean`\[9\]
 - `cancel()` *cancel the current transfer*
 - `transfer(data, cb)` *transfers data and calls `cb(err, status, data)` for each response*  (see [`transferStatus`](#transferstatus))
 - `getInterruptCount([resetCounter])`: `number`
 - `unlock(password)`: `boolean` *returns success* ***`password` is an array of up to 8 bytes***
 - `setPassword(password)` ***`password` is an array of up to 8 bytes***
 - `requestBusRelease([ack])`: `boolean` *returns success, `ack` is the value of the ACK pin*

#### `pinDesignation`
> The function of a pin.

 - `GPIO` *general purpose I/O*
 - `CS` *chip select*
 - `DF` *dedicated function*

#### `pinDir`
> The function of a pin.

 - `OUT` *output*
 - `IN` *input*

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

#### `config`
 - `manufacturerName`: `string` ***no more than 29 characters***
 - `productName`: `string` ***no more than 29 characters***
 - `vendorId`: `integer`
 - `productId`: `integer`
 - `powerOption`: [`powerOption`](#poweroption) *bit field*
 - `requestCurrent`: `integer` *requested current in mA*

#### `config1`
 - `gpio`: [`gpioInfo`](#gpioinfo)\[9\]
 - `remoteWakeUp`: `boolean` *whether remote wake-up is enabled*
 - `interruptMode`: [`interruptMode`](#interruptmode)
 - `autoRelease`: `boolean` *whether to release the bus between transfers*
 - `accessControl`: [`accessControl`](#accesscontrol)

#### `config2`
 - `bitRate`: `integer` *32 bit value  of bitrate*
 - `idleCS`: `boolean`\[9\]
 - `activeCS`: `boolean`\[9\]
 - `delayCStoD`: `integer` *16 bit value of delay between asserting CS and the first bit of data (in 100us)*
 - `delayDtoCS`: `integer` *16 bit value of delay between the last bit of data and de-asserting CS (in 100us)*
 - `delayB`: `integer` *16 bit value of delay between consecutive data bytes (in 100us)*
 - `bytesPerTransaction`: `integer` *16 bit value of how many bytes to send per transaction*
 - `spiMode`: `integer` *the SPI mode to use*

#### `deviceInfo`
> Device info copied from `node-hid` + `open()` function.

 - `vendorId`: `integer`
 - `productId`: `integer`
 - `path`: `string`
 - `open([password])`: [`mcp2210`](#mcp2210) *opens the selected device (using password if one is supplied)* ***`password` is an array of up to 8 bytes***

#### `gpioInfo`
 - `designation`: [`pinDesignation`](#pindesignation)
 - `defaultOutput`: `boolean`
 - `defaultDirection`: `boolean`

#### `status`
 - `extReqRelease`: `boolean` *pending external request for SPI bus release*
 - `currentOwner`: [`busOwner`](#busowner) *current SPI bus owner*
 - `passwordCount`: `integer` *count of password tries*
 - `passwordGuessed`: `boolean`

#### `idList`
> A list of all VID/PID combinations that should be considered a MCP2210. See [idlist.js](src/idlist.js) for more info.
