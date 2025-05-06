export function getDeviceId() {
    let deviceId = localStorage.getItem('carequilt_device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('carequilt_device_id', deviceId);
    }
    return deviceId;
  }