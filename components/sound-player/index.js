import i from 'icepick';
import React from 'react';

import templ from './sound-player.jsx';

export default React.createClass({
  getUpdatedState(nextProps = undefined) {
    const props = nextProps || this.props;
    const shortcutKey = props.sound.shortcut
      ? ` (${this.props.sound.shortcut.key.displayCode()})`
      : '';

    return i.assign(props, {playSound: this.playSound, shortcutKey});
  },
  getInitialState() {
    return this.getUpdatedState();
  },
  componentWillReceiveProps(nextProps) {
    this.setState(this.getUpdatedState(nextProps));
  },
  render() {
    return templ(this.state);
  },
  playSound() {
    return this.props.playSound(this.props.sound.id);
  }
});
