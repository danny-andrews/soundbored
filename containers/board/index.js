import { values } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    return templ({playSound, sounds: values(sounds)});
  },
  propTypes: {
    playSound: PropTypes.func.isRequired
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
