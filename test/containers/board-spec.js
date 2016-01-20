import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ServerStubber from 'test/support/server-stubber';

import Board from 'app/containers/board';
import { SoundFac } from 'test/factories';
import { containerElFac } from 'test/support/component-helpers';

describe('Containers - Board', function() {
  beforeEach(function() {
    this.stubber = ServerStubber();
    const props = {children: React.createElement(Board, props)};
    const reactEl = containerElFac({
      klass: Board,
      props,
      initialState: {
        entities: {
          sounds: {1: SoundFac.build({id: 1, displayName: 'PlayMe'})}
        }
      }
    });
    this.el = TestUtils.renderIntoDocument(reactEl);
    this.buttons =
      TestUtils.scryRenderedDOMComponentsWithTag(this.el, 'button');
  });

  it('renders properly', function() {
    expect(this.buttons[0].innerText).toBe('PlayMe');
  });
});
