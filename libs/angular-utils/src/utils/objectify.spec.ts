import { objectify } from './objectify';

describe(objectify.name, () => {
  it('should turn an array into a keyed object', () => {
    const obj = objectify(
      [
        { type: 'a', name: 'foo' },
        { type: 'b', name: 'bar' },
        { type: 'c', name: 'baz' },
        { type: 'd', name: 'bax' },
      ],
      'type',
    );

    expect(obj['a']?.name).toEqual('foo');
    expect(obj['b']?.name).toEqual('bar');
    expect(obj['c']?.name).toEqual('baz');
    expect(obj['d']?.name).toEqual('bax');
  });
});
