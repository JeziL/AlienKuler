const ffi = require('ffi');
const ref = require('ref');
const { Position, Color } = require('./constants');

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class LightFX {
  constructor(dllPath) {
    this.dllPath = dllPath;
    this.dll = ffi.Library(this.dllPath, {
      LFX_Initialize: ['int', []],
      LFX_Release: ['int', []],
      LFX_Reset: ['int', []],
      LFX_Update: ['int', []],
      LFX_GetNumDevices: ['int', [ref.refType('uint')]],
      LFX_GetDeviceDescription: ['int', ['int', 'string', 'int', ref.refType('uchar')]],
      LFX_GetNumLights: ['int', ['int', ref.refType('uint')]],
      LFX_GetLightDescription: ['int', ['int', 'int', 'string', 'int']],
      LFX_GetLightLocation: ['int', ['int', 'int', ref.refType(Position)]],
      LFX_GetLightLocationMask: ['int', ['int', 'int', ref.refType('uint')]],
      LFX_GetLightColor: ['int', ['int', 'int', ref.refType(Color)]],
      LFX_SetLightColor: ['int', ['int', 'int', ref.refType(Color)]],
      LFX_Light: ['int', ['int', 'int']],
      LFX_GetVersion: ['int', ['string', 'int']],
    });
  }

  initialize() {
    return this.dll.LFX_Initialize();
  }

  release() {
    return this.dll.LFX_Release();
  }

  reset() {
    return this.dll.LFX_Reset();
  }

  async update() {
    const result = this.dll.LFX_Update();
    await sleep(100);
    return result;
  }

  devicesCount() {
    const buffer = ref.alloc('uint');
    const result = this.dll.LFX_GetNumDevices(buffer);

    return {
      result: result,
      count: buffer.deref()
    };
  }

  deviceDiscription(deviceId) {
    const descBuffer = Buffer.alloc(255);
    const typeBuffer = ref.alloc('uchar');
    const result = this.dll.LFX_GetDeviceDescription(deviceId, descBuffer, 255, typeBuffer);

    return {
      result: result,
      desc: ref.readCString(descBuffer, 0),
      type: typeBuffer.deref()
    };
  }

  lightsCount(deviceId) {
    const buffer = ref.alloc('uint');
    const result = this.dll.LFX_GetNumLights(deviceId, buffer);

    return {
      result: result,
      count: buffer.deref()
    };
  }

  lightDescription(deviceId, lightId) {
    const buffer = Buffer.alloc(255);
    const result = this.dll.LFX_GetLightDescription(deviceId, lightId, buffer, 255);

    return {
      result: result,
      desc: ref.readCString(buffer, 0)
    };
  }

  lightLocation(deviceId, lightId) {
    const position = new Position();
    const result = this.dll.LFX_GetLightLocation(deviceId, lightId, position.ref());

    return {
      result: result,
      position: position
    };
  }

  lightLocationMask(deviceId, lightId) {
    const buffer = ref.alloc('uint');
    const result = this.dll.LFX_GetLightLocationMask(deviceId, lightId, buffer);

    return {
      result: result,
      mask: buffer.deref()
    };
  }

  lightColor(deviceId, lightId) {
    const color = new Color();
    const result = this.dll.LFX_GetLightColor(deviceId, lightId, color.ref());

    return {
      result: result,
      color: color
    };
  }

  setLightColor(deviceId, lightId, color) {
    const colorStruct = new Color(color);
    return this.dll.LFX_SetLightColor(deviceId, lightId, colorStruct.ref());
  }

  setAllLights(location, color) {
    if (typeof color === 'number') {
      return this.dll.LFX_Light(location, color);
    } else {
      const colorMask = (color.brightness << 24) + (color.red << 16) + (color.green << 8) + color.blue;
      return this.dll.LFX_Light(location, colorMask);
    }
  }

  version() {
    const buffer = Buffer.alloc(255);
    const result = this.dll.LFX_GetVersion(buffer, 255);

    return {
      result: result,
      version: ref.readCString(buffer, 0)
    };
  }

  static hexToColor(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color({
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16),
      brightness: 255
    }) : null;
  }
}

module.exports = {
  LightFX: LightFX
};
