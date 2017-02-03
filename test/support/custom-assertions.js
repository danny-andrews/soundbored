import expect from 'expect';

const hasRecomputed = opts => {
  const {sel, session} = opts;
  const origRecomps = sel.recomputations();
  sel(session.getNextState());

  return sel.recomputations() - origRecomps === 1;
};

expect.extend({
  toRecompute() {
    expect.assert(
      hasRecomputed(this.actual),
      'Expected running given selector to cause recomputation',
      this.actual
    );
  },
  toNotRecompute() {
    expect.assert(
      !hasRecomputed(this.actual),
      'Expected running given selector not to cause recomputation',
      this.actual
    );
  }
});
