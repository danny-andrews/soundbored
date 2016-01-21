export default (function(env) {
  const inDev = () => env.NODE_ENV === 'development';
  const inTest = () => env.NODE_ENV === 'test';
  const inProd = () => env.NODE_ENV === 'production';
  const get = key => env[key];

  return Object.freeze({inDev, inTest, inProd, get});
})(process.env);
