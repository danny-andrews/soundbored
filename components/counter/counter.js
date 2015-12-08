import React, { PropTypes } from 'react';
import templ from './counter.jsx';

export default React.createClass({
  render: function() {
    return templ(this.props);
  },
  propTypes: {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired
  }
});
