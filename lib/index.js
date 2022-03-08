const { existsSync, fstat, readFileSync } =  require('fs');
const { getSdk } = require('balena-sdk');
const { debug } = require('console');

const sdk = getSdk();
const path = '/var/lib/my_variable/test_token';
const BALENA_API_KEY = process.env.BALENA_API_KEY;
const BALENA_DEVICE_UUID = process.env.BALENA_DEVICE_UUID;


const getK3SToken = async function (token) {
  try {
    await sdk.auth.logout();
    await sdk.auth.loginWithToken(BALENA_API_KEY);
    await sdk.models.application.envVar.get(BALENA_DEVICE_UUID, 'K3S_TOKEN')
      .then(function (value){
        if (typeof value === 'undefined') {
          sdk.models.application.envVar.set(BALENA_DEVICE_UUID, 'K3S_TOKEN', token)
        } else {
          debug(`failed, K3S_TOKEN is already set`)
        }
      })
  } catch (error) {
    debug(error);
  }
};

try {
  if (existsSync(path)) {
    const data = readFileSync(path,'utf8')
    getK3SToken(data)
  }
} catch(err) {
  console.error(err)
}