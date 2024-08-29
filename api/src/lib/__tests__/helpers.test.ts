import * as Helpers from 'lib/helpers';

describe('Comparing arrays', () => {
    test('Equal arrays are equal', () => {
        const array = [3, 'hello', { colour: 'red' }, false];
        const comparison = Helpers.compareArrays(array, array);
        expect(comparison).toBe(true);
    });
    test('Same elements in different order are considered equal by default', () => {
        const comparison = Helpers.compareArrays([1, 2, 3], [3, 2, 1]);
        expect(comparison).toBe(true);
    });
    test('Same elements in different order are not considered equal when strictOrder is set', () => {
        const comparison = Helpers.compareArrays([1, 2, 3], [3, 2, 1], true);
        expect(comparison).toBe(false);
    });
    test('Comparisons use strict equality', () => {
        // Note that typescript expects both arrays to be the same using a generic (Array<T>),
        // so it will fail if you try and compare [0] to ['0'].
        // You have to mix the types to get past type checking
        // (in this case provide Array<string | number>).
        const comparison = Helpers.compareArrays([0, '0'], ['0', 0]);
        expect(comparison).toBe(false);
    });
    test('Works with empty arrays', () => {
        const comparison = Helpers.compareArrays([], []);
        expect(comparison).toBe(true);
    });
    test('Object property order must be the same', () => {
        const comparison = Helpers.compareArrays(
            [
                {
                    firstProperty: true,
                    secondProperty: true
                }
            ],
            [
                {
                    secondProperty: true,
                    firstProperty: true
                }
            ]
        );
        expect(comparison).toBe(false);
    });
});
