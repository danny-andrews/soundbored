import expect from 'expect';
import { Board } from 'app/models';

describe('Model - board', function() {
  it('exists', function() {
    expect(new Board()).toExist();
  });
});
