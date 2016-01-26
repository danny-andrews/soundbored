import i from 'icepick';
import React from 'react';

import templ from './sound-player.jsx';

export default React.createClass({
  getInitialState() {
    this.soundPlayer = this.props.soundPlayer.setup();
    return i.assign(this.props, {playSound: this.playSound});
  },
  render() {
    return templ(this.state);
  },
  playSound() {
    this.soundPlayer.then(soundPlayer => soundPlayer.load())
      .then(player => player.start(0));
    return this.props.playSound(this.props.sound.id);
  }
});
