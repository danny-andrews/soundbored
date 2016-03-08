import expect from 'expect';

import { extractEntities } from 'app/util/json-api-helpers';

describe('Util - json-api-helpers', () => {
  describe('#extractEntities', function() {
    it('deserializes a json-api formatted json collection into a ' +
        'normalized entity hash', function() {
      const data = {
        data: [
          {type: 'thing', id: 3, attributes: {firstName: 'Thing1'}}
        ]
      };
      expect(extractEntities(data)).toEqual({
        thing: [{id: 3, firstName: 'Thing1'}]
      });
    });

    it('deserializes a json-api formatted json entity into a normalized ' +
        'entity hash', function() {
      const data = {
        data: {type: 'thing', id: 3, attributes: {firstName: 'Thing1'}}
      };
      expect(extractEntities(data)).toEqual({
        thing: [{id: 3, firstName: 'Thing1'}]
      });
    });
  });
});
