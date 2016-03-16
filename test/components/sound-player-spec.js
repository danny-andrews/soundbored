import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { merge } from 'icepick';

import * as facs from 'test/factories';
import SoundPlayer from 'app/components/sound-player';

function Subject(props = {}) {
  const playSoundSpy = expect.createSpy();
  props = merge({sound: facs.SoundFac.build(), playSound: playSoundSpy}, props);
  const renderer = TestUtils.createRenderer();
  renderer.render(React.createElement(SoundPlayer, props));
  const component = TestUtils.renderIntoDocument(
    React.createElement(SoundPlayer, props)
  );
  const domEl = ReactDOM.findDOMNode(component);
  const button = TestUtils.findRenderedDOMComponentWithClass(
    component,
    'play-sound-btn'
  );
  return {component, domEl, button, playSoundSpy};
}

describe('Component - SoundPlayer', function() {
  context('sound has related shortcut', function() {
    it('renders key code on play button', function() {
      const subject = Subject({
        sound: facs.SoundFac.build({
          shortcut: facs.ShortcutFac.build({
            key: facs.KeyModelFac.build({code: 'KeyK'})
          })
        })
      });
      expect(subject.button.children[1].innerHTML).toMatch(/\(.*K.*\)/);
    });
  });

  it('renders play button', function() {
    const subject = Subject({
      sound: facs.SoundFac.build({displayName: 'PlayMe'})
    });
    expect(subject.domEl.tagName.toLowerCase()).toBe('span');
    expect(subject.button.children[0].innerHTML).toBe('PlayMe');
  });

  it('plays sound when button is pressed', function() {
    const subject = Subject({sound: facs.SoundFac.build({id: 12})});
    TestUtils.Simulate.click(subject.button);
    expect(subject.playSoundSpy).toHaveBeenCalledWith(12);
  });
});
