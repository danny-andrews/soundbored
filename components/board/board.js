import React, { PropTypes } from 'react';
import templ from './board.jsx';

export default React.createClass({
  render: function() {
    return templ(this.props);
  },
  propTypes: {
    playSound: PropTypes.func.isRequired
  }
});
