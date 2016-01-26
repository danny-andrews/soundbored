import { values } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SoundPlayerFactory from 'app/util/sound-players';
import config from 'app/util/config';
import { playSound } from 'app/actions';
import templ from './board.jsx';

function mapStateToProps(state) {
  return {sounds: state.entities.sounds};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({playSound}, dispatch);
}

const Board = React.createClass({
  render() {
    const {playSound, sounds} = this.props;
    const soundArray = values(sounds);
    const soundPlayers = soundArray.map(sound =>
      SoundPlayerFactory([
        config.get('ASSET_PATH'),
        'sounds',
        sound.filename
      ].join('/'))
    );
    return templ({playSound, sounds: soundArray, soundPlayers});
  },
  propTypes: {
    playSound: PropTypes.func.isRequired
  }
});

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
  withRef: true
})(Board);
