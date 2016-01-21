import { range } from 'lodash';
import React from 'react';
import { findDOMNode } from 'react-dom';

import config from 'app/util/config';
import templ from './sound-player.jsx';
import ResourcePool from 'app/util/resource-pool';

const PLAYER_COUNT = 20;
const SOUND_IDS = range(PLAYER_COUNT);

export default React.createClass({
  playSound() {
    if(!this.resourcePool.hasFreeResource()) {
      alert('Slow down!');
      return;
    }
    const {tag} = this.resourcePool.busy();
    tag.play();
    return this.props.playSound(this.props.sound.id);
  },
  componentDidMount() {
    this.audioTags = [...findDOMNode(this).querySelectorAll('audio')];
    const resources = this.audioTags
      .map((tag, index) => ({id: SOUND_IDS[index], tag}));
    this.resourcePool = ResourcePool(resources);
  },
  playerFinished(id) {
    this.resourcePool.free(id);
  },
  render() {
    const context = Object.assign(
      {},
      this.props,
      {
        playSound: this.playSound,
        soundFilePath: [
          config.get('ASSET_PATH'),
          'sounds',
          this.props.sound.filename
        ].join('/'),
        players: SOUND_IDS.map(id => ({
          id, onEnded: () => this.playerFinished(id)
        }))
      }
    );
    return templ(context);
  }
});
