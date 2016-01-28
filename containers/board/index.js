import { values } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SoundPlayerFactory from 'app/util/sound-player-factory';
import config from 'app/util/config';
import { playSound, killAllSounds } from 'app/actions';
import templ from './board.jsx';

function mapStateToProps(state) {
  return {sounds: state.entities.sounds, previousAction: state.previousAction};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({playSound, killAllSounds}, dispatch);
}

const Board = React.createClass({
  render() {
    const {sounds, previousAction} = this.props;
    const soundArray = values(sounds);
    const soundPlayers = soundArray.map(sound =>
      SoundPlayerFactory([
        config.get('ASSET_PATH'),
        'sounds',
        sound.filename
      ].join('/'))
    );
    return templ({
      playSound: this.props.playSound,
      killAllSounds: () => this.props.killAllSounds(),
      sounds: soundArray,
      soundPlayers,
      previousAction
    });
  },
  propTypes: {
    playSound: PropTypes.func.isRequired
  }
});

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
  withRef: true
})(Board);
