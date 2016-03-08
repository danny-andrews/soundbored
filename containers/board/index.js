import React, { PropTypes } from 'react';
import { values } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SHORTCUT_ACTIONS } from 'app/constants';
import { Key } from 'app/models';
import * as selectors from 'app/store/selectors';
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
    loadKeys: actions.loadKeys,
    loadBoards: actions.loadBoards,
    assignShortcutKeys: actions.assignShortcutKeys,
    loadBoardSounds: actions.loadBoardSounds,
    loadShortcutCommands: actions.loadShortcutCommands
  }, dispatch);
}

let shortcutsAssigned = false;

const Board = React.createClass({
  componentDidMount() {
    this.props.authenticate({auid: 'dsahi', name: 'Bob'});
    document.addEventListener('keypress', this.routeKeyCode);
  },
  componentWillUnmount() {
    document.removeEventListener('keypress', this.routeKeyCode);
  },
  getUpdatedState(nextProps = undefined) {
    const {entities, previousAction, session} = nextProps || this.props;
    const boards = selectors.boards(entities).toRefArray();
    if(!selectors.session(entities)) {
      return {};
    }
    this.props.loadKeys({});
    this.props.loadShortcutCommands({});
    this.props.loadBoards({});
    if(selectors.keys(entities).toRefArray().length === 0 ||
        selectors.shortcutCommands(entities).toRefArray().length === 0 ||
        boards.length === 0) {
      return {};
    }
    this.props.loadBoardSounds(boards[0].id);
    if(selectors.sounds(entities).toRefArray().length === 0 ||
        selectors.shortcuts(entities).toRefArray().length === 0) {
      return {};
    }
    if(!shortcutsAssigned) {
      this.props.assignShortcutKeys({});
      shortcutsAssigned = true;
    }
    const killSoundsShortcut = selectors.killSoundsShortcut(entities);
    const killSoundsKey = killSoundsShortcut ?
      ` (${killSoundsShortcut.key.displayCode()})` :
      '';
    const soundArray = selectors.sounds(entities).toModelArray();
    this.soundPlayers = selectors.soundPlayers(entities);
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
    const shortcut = key.shortcuts.toModelArray()[0];
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
