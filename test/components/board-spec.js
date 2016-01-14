import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Board from 'app/components/board/board';

describe('components', function() {
  describe('Board', () => {
    beforeEach(function() {
      const props = {playSound: () => {}};
      const renderer = TestUtils.createRenderer();
      renderer.render(React.createElement(Board, props));
      this.el = renderer.getRenderOutput();
    });

    it('renders properly', function() {
      expect(this.el.type).toBe('button');
      expect(this.el.props.children).toBe('Play');
    });
  });
});
