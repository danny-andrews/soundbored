import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Board from '../../components/board/board';

describe('board actions', () => {
  beforeEach(function(propOverrides = {}) {
    const props = {playSound: () => {}});

    const renderer = TestUtils.createRenderer();
    React.createElement(Board, props);
    const output = renderer.getRenderOutput();

    this.el = {
      props: props,
      output: output
    };
  });

  describe('things', function() {
    it('do stuff', function() {
      expect(true).toBe(true);
    });
  });
});
