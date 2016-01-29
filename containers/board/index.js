import React, { PropTypes } from 'react';
import { values } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SHORTCUT_ACTIONS } from 'app/constants';
import { Key, Shortcut, ShortcutCommand } from 'app/models';
import { sounds as soundsSelector, soundPlayersSelector }
  from 'app/store/selectors';
import { playSound, killAllSounds, keyPress } from 'app/actions';
import templ from './board.jsx';

function mapStateToProps(state) {
  return {entities: state.entities, previousAction: state.previousAction};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({playSound, killAllSounds, keyPress}, dispatch);
}

const Board = React.createClass({
  componentDidMount() {
    document.addEventListener('keypress', this.routeKeyCode);
  },
  componentWillUnmount() {
    document.removeEventListener('keypress', this.routeKeyCode);
  },
  setupState() {
    const {entities, previousAction} = this.props;
    const killSoundsCommand = ShortcutCommand.get({
      name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS
    });
    const killSoundsShortcut = Shortcut.get({
      shortcutCommand: killSoundsCommand.id
    });
    const killSoundsKey = killSoundsShortcut ?
      ` (${killSoundsShortcut.key.code})` :
      '';
    const soundArray = soundsSelector(entities);
    this.soundPlayers = soundPlayersSelector(entities);
    return {
      playSound: this.playSound,
      killAllSounds: this.killAllSounds,
      sounds: soundArray,
      previousAction,
      killSoundsKey
    };
  },
  getInitialState() {
    return this.setupState();
  },
  componentWillReceiveProps() {
    this.setupState();
  },
  render() {
    return templ(this.state);
  },
  propTypes: {
    playSound: PropTypes.func.isRequired
  },
  routeKeyCode(e) {
    this.keyPress(e.code);
  },
  keyPress(keyCode) {
    const key = Key.get({code: keyCode});
    const shortcut = key.shortcuts[0];
    if(!shortcut) {
      return;
    }
    switch(shortcut.shortcutCommand.name) {
    case SHORTCUT_ACTIONS.PLAY_SOUND:
      return this.playSound(shortcut.sound.id);
    case SHORTCUT_ACTIONS.KILL_ALL_SOUNDS:
      return this.killAllSounds();
    default:
      throw new Error('Unknown shortcut command given');
    }
  },
  killAllSounds() {
    values(this.soundPlayers).forEach(player =>
      player.then(soundPlayer => soundPlayer.stopAll())
    );
    this.props.killAllSounds();
  },
  playSound(soundId) {
    this.soundPlayers[soundId]
      .then(soundPlayer => soundPlayer.load())
      .then(player => player.start(0));
    return this.props.playSound(soundId);
  }
});

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
  withRef: true
})(Board);
