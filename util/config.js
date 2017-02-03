/* global process */
export default (function(env) {
  const inDev = () => env.NODE_ENV === 'development';
  const inTest = () => env.NODE_ENV === 'test';
  const inProd = () => env.NODE_ENV === 'production';
  const get = key => env[key];
  const assetPath = ({filename, assetType}) =>
    [get('ASSET_PATH'), assetType, filename].join('/');

  return Object.freeze({inDev, inTest, inProd, get, assetPath});
}(process.env));
