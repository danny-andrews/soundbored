import React from 'react';
import { findDOMNode } from 'react-dom';

import templ from './sound-player.jsx';

export default React.createClass({
  playSound() {
    this.audioTags[0].play();
    return this.props.playSound(this.props.sound.id);
  },
  componentDidMount() {
    this.audioTags = [...findDOMNode(this).querySelectorAll('audio')];
  },
  render() {
    const context = Object.assign(
      {},
      this.props,
      {
        playSound: this.playSound,
        soundFilePath: ['public', this.props.sound.filename].join('/')
      }
    );
    return templ(context);
  }
});
