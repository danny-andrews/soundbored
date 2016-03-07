import React, { PropTypes } from 'react';
import { values } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SHORTCUT_ACTIONS } from 'app/constants';
import { Key } from 'app/models';
import { sounds as soundsSelector, soundPlayersSelector, killSoundsShortcutSelector }
  from 'app/store/selectors';
import * as actions from 'app/actions';
import templ from './board.jsx';
import loadingTempl from 'app/components/loading/loading.jsx';

function mapStateToProps(state) {
  return {
    entities: state.entities,
    previousAction: state.previousAction,
    session: state.entities.Session.itemsById[1],
    keys: state.entities.Key.items,
    shortcutCommands: state.entities.ShortcutCommand.items,
    boards: state.entities.Board.items,
    sounds: state.entities.Sound.items,
    shortcuts: state.entities.Shortcut.items
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    playSound: actions.playSound,
    killAllSounds: actions.killAllSounds,
    keyPress: actions.keyPress,
    authenticate: actions.authenticate,
    getKeys: actions.getKeys,
    getBoards: actions.getBoards,
    assignShortcutKeys: actions.assignShortcutKeys,
    getBoardSounds: actions.getBoardSounds,
    getShortcutCommands: actions.getShortcutCommands
  }, dispatch);
}

let shortcutsAssigned = false;
let retrievedSounds = false;
let retrievedKeys = false;
let retrievedShortcutCommands = false;
let retrievedBoards = false;

const Board = React.createClass({
  componentDidMount() {
    this.props.authenticate({auid: 'dsahi', name: 'Bob'});
    document.addEventListener('keypress', this.routeKeyCode);
  },
  componentWillUnmount() {
    document.removeEventListener('keypress', this.routeKeyCode);
  },
  getUpdatedState(nextProps = undefined) {
    const {
      entities,
      previousAction,
      session,
      keys,
      boards,
      sounds,
      shortcutCommands,
      shortcuts
    } = nextProps || this.props;
    if(!session) {
      return {};
    }
    if(keys.length === 0) {
      if(!retrievedKeys) {
        this.props.getKeys({});
        retrievedKeys = true;
      }
      return {};
    }
    if(shortcutCommands.length === 0) {
      if(!retrievedShortcutCommands) {
        this.props.getShortcutCommands({});
        retrievedShortcutCommands = true;
      }
      return {};
    }
    if(boards.length === 0) {
      if(!retrievedBoards) {
        this.props.getBoards({});
        retrievedBoards = true;
      }
      return {};
    }
    if(sounds.length === 0) {
      if(!retrievedSounds) {
        this.props.getBoardSounds(boards[0]);
        retrievedSounds = true;
      }
      return {};
    }
    if(shortcuts.length === 0) {
      if(!shortcutsAssigned) {
        this.props.assignShortcutKeys({});
        shortcutsAssigned = true;
      }
      return {};
    }
    const killSoundsShortcut = killSoundsShortcutSelector(entities);
    const killSoundsKey = killSoundsShortcut ?
      ` (${killSoundsShortcut.key.displayCode()})` :
      '';
    const soundArray = soundsSelector(entities);
    this.soundPlayers = soundPlayersSelector(entities);
    return {
      playSound: this.playSound,
      killAllSounds: this.killAllSounds,
      sounds: soundArray,
      previousAction,
      session,
      killSoundsKey
    };
  },
  getInitialState() {
    return this.getUpdatedState();
  },
  componentWillReceiveProps(nextProps) {
    this.setState(this.getUpdatedState(nextProps));
  },
  render() {
    if(this.state.session) {
      return templ(this.state);
    }
    else {
      return loadingTempl();
    }
  },
  propTypes: {
    playSound: PropTypes.func.isRequired
  },
  routeKeyCode(e) {
    this.keyPress(e.code);
  },
  keyPress(keyCode) {
    const key = Key.get({code: keyCode});
    const shortcut = key.shortcuts.first();
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
