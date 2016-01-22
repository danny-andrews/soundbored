import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { SoundFac } from 'test/factories';
import SoundPlayer from 'app/components/sound-player';

function FakeSoundPlayer(start) {
  return {
    setup: () => Promise.resolve({
      load: () => Promise.resolve({start})
    })
  };
}

describe('Component - SoundPlayer', function() {
  beforeEach(function() {
    const sound = SoundFac.build({id: 12, displayName: 'PlayMe'});
    this.playSoundSpy = expect.createSpy();
    this.startSoundSpy = expect.createSpy();
    const props = {
      playSound: this.playSoundSpy,
      sound,
      soundPlayer: FakeSoundPlayer(this.startSoundSpy)
    };
    const renderer = TestUtils.createRenderer();
    renderer.render(React.createElement(SoundPlayer, props));
    this.component = TestUtils.renderIntoDocument(
      React.createElement(SoundPlayer, props)
    );
    this.domEl = ReactDOM.findDOMNode(this.component);
    this.button = TestUtils.findRenderedDOMComponentWithTag(
      this.component,
      'button'
    );
  });

  it('renders play button', function() {
    expect(this.domEl.tagName.toLowerCase()).toBe('span');
    expect(this.button.innerHTML).toBe('PlayMe');
  });

  it('plays sound when button is pressed', function() {
    return new Promise(resolve => {
      this.startSoundSpy.andCall(resolve);
      TestUtils.Simulate.click(this.button);
    }).then(() => expect(this.playSoundSpy).toHaveBeenCalledWith(12));
  });
});
