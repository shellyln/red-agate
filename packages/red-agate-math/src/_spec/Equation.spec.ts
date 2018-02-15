

import * as ff from "../index";


describe("Equation", function() {
    it("Equation", function() {
        const equ = new ff.Equation(new ff.ArrayPolynomialRing(new ff.RealField()));

        expect(equ.det([[1, 3], [2, 4]], 0, 0, 2)).toEqual(2); // [[3, 1], [4, 2]]
        expect(equ.det([[3, 1], [4, 2]], 0, 0, 2)).toEqual(-2); // [[1, 3], [2, 4]]
        expect(equ.det([[3, 1, 0], [-5, -3, -2], [4, -4, 4]], 0, 0, 3)).toEqual(48);
        expect(equ.det([[0, 1, 3], [-2, -3, -5], [4, -4, 4]], 0, 0, 3)).toEqual(-48);
        expect(equ.det([[2, 3, -2, 1], [2, 0, 2, 0], [-2, -1, 0, 0], [-6, 0, 0, 0]], 0, 0, 4)).toEqual(12);
        expect(equ.det([[1, -2, 3, 2], [0, 2, 0, 2], [0, 0, -1, -2], [0, 0, 0, -6]], 0, 0, 4)).toEqual(12);

        expect(equ.det(
            [[1, 2, 1, 1, 3], [2, 4, 3, 1, 5], [3, 0, 1, 0, 2], [4, 1, 2, 3, 1], [5, 4, 3, 2, 1]], 0, 0, 5)).toEqual(-119); // expect -119
        expect(equ.det(
            [[3, 1, 1, 2, 1], [5, 1, 3, 4, 2], [2, 0, 1, 0, 3], [1, 3, 2, 1, 4], [1, 2, 3, 4, 5]], 0, 0, 5)).toEqual(-119);

        const s = equ.solve([[-6, 1, 1, 1], [-14, 3, 2, 1], [-39, 8, 6, 3]], 0, 0, 3);
        expect(s.length).toEqual(3);
        expect(s[0]).toEqual(3);
        expect(s[1]).toEqual(2);
        expect(s[2]).toEqual(1);
    });
});

