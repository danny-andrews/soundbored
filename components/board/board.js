import React, { PropTypes } from 'react';
import templ from './board.jsx';

export default React.createClass({
  render() {
    return templ(this.props);
  },
  propTypes: {
    playSound: PropTypes.func.isRequired
  }
});
