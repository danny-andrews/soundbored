export const PLAY_SOUND = 'PLAY_SOUND';

export function playSound(id) {
  return {type: PLAY_SOUND, id};
}
