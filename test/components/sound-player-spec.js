import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { SoundFac } from 'test/factories';
import SoundPlayer from 'app/components/sound-player';

describe('Component - SoundPlayer', function() {
  beforeEach(function() {
    const props = {
      playSound() {},
      sound: SoundFac.build({displayName: 'PlayMe'})
    };
    const renderer = TestUtils.createRenderer();
    renderer.render(React.createElement(SoundPlayer, props));
    this.el = renderer.getRenderOutput();
    this.button = this.el.props.children[0];
  });

  it('renders properly', function() {
    expect(this.el.type).toBe('div');
    expect(this.button.props.children).toBe('PlayMe');
  });
});
