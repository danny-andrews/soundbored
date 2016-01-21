import expect from 'expect';
import ResourcePool from 'app/util/resource-pool';

describe('Utils - resource-pool', function() {
  describe('#busy', function() {
    it('returns first free item', function() {
      const firstItem = {id: 1};
      const subject = ResourcePool([firstItem, {id: 2}]);
      expect(subject.busy()).toBe(firstItem);
    });

    it('throws an error when there are no available items', function() {
      const subject = ResourcePool([{id: 1}]);
      subject.busy();
      expect(() => subject.busy()).toThrow(/no available resources/i);
    });
  });

  describe('#free', function() {
    it('frees resource with given id', function() {
      const el = {id: 1};
      const subject = ResourcePool([el]);
      subject.busy();
      subject.free(1);
      expect(subject.busy()).toBe(el);
    });

    it('throws error if element with given id is not found', function() {
      const subject = ResourcePool([{id: 1}]);
      subject.busy();
      expect(() => subject.free(44)).toThrow(/invalid.*id/i);
    });
  });

  describe('#hasFreeResource', function() {
    it('returns true when there are available resources', function() {
      const subject = ResourcePool([{id: 1}]);
      expect(subject.hasFreeResource()).toBe(true);
    });

    it('returns true when there are available resources', function() {
      const subject = ResourcePool([{id: 1}]);
      subject.busy();
      expect(subject.hasFreeResource()).toBe(false);
    });
  });
});
