import expect from 'expect';
import schema from 'app/store/schema';

describe('Store - schema', function() {
  beforeEach(function() {
    this.session = schema.from({});
  });

  it('has Board model registered', function() {
    expect(this.session.Board).toExist();
  });

  it('has Config model registered', function() {
    expect(this.session.Config).toExist();
  });

  it('has Dj model registered', function() {
    expect(this.session.Dj).toExist();
  });

  it('has Key model registered', function() {
    expect(this.session.Key).toExist();
  });

  it('has ShortcutCommand model registered', function() {
    expect(this.session.ShortcutCommand).toExist();
  });

  it('has Shortcut model registered', function() {
    expect(this.session.Shortcut).toExist();
  });

  it('has Sound model registered', function() {
    expect(this.session.Sound).toExist();
  });

  it('has Session model registered', function() {
    expect(this.session.Session).toExist();
  });
});
