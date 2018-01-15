
import { Html5 } from '../red-agate/html';
import { createElement as h, renderAsHtml } from '../red-agate/red-agate';


describe("foo", function() {
    it("foo", function(done) {
        expect(1).toEqual(1);
        expect(() => new Html5({})).not.toThrow();
        renderAsHtml(h('div', { style: {fooBarBaz: '12345'}}))
        .then((s) => {
            expect(s).toEqual('<div style="foo-bar-baz:12345;"></div>');
            done();
        })
        .catch((e) => {
            expect('').toBe('Error catched.');
            done();
        });
    });
});

