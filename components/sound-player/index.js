import i from 'icepick';
import React from 'react';

import templ from './sound-player.jsx';

export default React.createClass({
  getInitialState() {
    const shortcutKey = this.props.sound.shortcut ?
      ` (${this.props.sound.shortcut.key.code})` :
      '';
    return i.assign(this.props, {
      playSound: this.playSound,
      shortcutKey
    });
  },
  render() {
    return templ(this.state);
  },
  playSound() {
    return this.props.playSound(this.props.sound.id);
  }
});
