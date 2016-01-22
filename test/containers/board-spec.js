import expect from 'expect';
import React from 'react';
import { renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate }
  from 'react-addons-test-utils';
import stubber from 'fetch-mock';

import Board from 'app/containers/board';
import configreStore from 'app/store/configure-store';
import { SoundFac } from 'test/factories';

describe('Containers - Board', function() {
  beforeEach(function() {
    const store = configreStore({
      entities: {
        sounds: {
          1: SoundFac.build({id: 1, displayName: 'Woof'}),
          4: SoundFac.build({id: 4, displayName: 'Meow'})
        }
      }
    });
    this.subject = renderIntoDocument(React.createElement(Board, {store}))
      .getWrappedInstance();
    this.buttons = scryRenderedDOMComponentsWithTag(this.subject, 'button');
  });
  afterEach(function() {
    stubber.restore();
  });

  it('renders a SoundPlayer for every sound', function() {
    expect(this.buttons[0].innerHTML).toBe('Woof');
    expect(this.buttons[1].innerHTML).toBe('Meow');
  });

  it('passes in sound player to SoundPlayer components (listen for "wow!")',
      function() {
    Simulate.click(this.buttons[0]);
  });
});
