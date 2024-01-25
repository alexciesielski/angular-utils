import { entries, keys } from './object-utils';

describe('object-utils', () => {
  describe('entries', () => {
    it('should wrap native Object.entries and make it more type-safe', () => {
      const obj = { a: '1', b: 2, c: { 3: 3 } };
      expect(entries(obj)).toEqual(Object.entries(obj));
    });
  });

  describe('keys', () => {
    it('should wrap native Object.keys and make it more type-safe', () => {
      const obj = { a: '1', b: 2, c: { 3: 3 } };
      expect(keys(obj)).toEqual(Object.keys(obj));
    });
  });
});
