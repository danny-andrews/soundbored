import {TextDecoder, TextEncoder} from 'text-encoding';

export function ab2str(buf) {
  return new TextDecoder('utf-8').decode(new DataView(buf));
}

export function str2ab(str) {
  return new TextEncoder('utf-8').encode(str);
}
