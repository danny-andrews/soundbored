import i from 'icepick';
import React from 'react';

import { KILL_ALL_SOUNDS } from 'app/constants/action-types';
import templ from './sound-player.jsx';

export default React.createClass({
  componentWillMount() {
    this.players = i.freeze([]);
  },
  getInitialState() {
    this.soundPlayer = this.props.soundPlayer.setup();
    return i.assign(this.props, {playSound: this.playSound});
  },
  componentWillUpdate(nextProps) {
    if(nextProps.previousAction.type === KILL_ALL_SOUNDS) {
      this.soundPlayer.then(soundPlayer => soundPlayer.stopAll());
    }
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
