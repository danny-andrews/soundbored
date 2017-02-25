import * as facs from 'test/factories';
import expect from 'expect';
import {merge} from 'icepick';
import React from 'react';
import ReactDOM from 'react-dom';
import SoundPlayer from 'app/components/sound-player';
import TestUtils from 'react-addons-test-utils';

function Subject(props = {}) {
  const playSoundSpy = expect.createSpy();
  const newProps = merge({
    sound: facs.SoundFac.build(),
    playSound: playSoundSpy
  }, props);
  const renderer = TestUtils.createRenderer();
  renderer.render(React.createElement(SoundPlayer, newProps));
  const component = TestUtils.renderIntoDocument(
    React.createElement(SoundPlayer, newProps)
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
      expect(subject.button.textContent).toMatch(/\(.*K.*\)/);
    });
  });

  it('renders play button', function() {
    const subject = Subject({
      sound: facs.SoundFac.build({displayName: 'PlayMe'})
    });
    expect(subject.domEl.tagName.toLowerCase()).toBe('span');
    expect(subject.button.textContent).toBe('PlayMe');
  });

  it('plays sound when button is pressed', function() {
    const subject = Subject({sound: facs.SoundFac.build({id: 12})});
    TestUtils.Simulate.click(subject.button);
    expect(subject.playSoundSpy).toHaveBeenCalledWith(12);
  });
});
