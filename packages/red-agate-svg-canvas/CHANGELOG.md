# Changelog

## v0.3.1

* Make some methods of SvgCanvas can be overridden, to improve text rendering of some apps and libraries.
  * Methods:
    * getMultilineTextHeight
      * Inherited classes can adjust the value of `lineHeight` (adjust argument and call super).
    * getTextFontStyles
      * issue #1: CairoSVG, Inkscape, and some libraries can't understand `font` shorthand style property.
        * (Inkscape (v0.92.4) may understand partly)
      * Inherited classes can split `font` property to `font-family`, `font-weight`, `font-size`, ...
    * getTextAttributes
      * Firefox and Inkscape will render text justified if `textLength` is set.
        * Chromium and Safari don't justify in this case.
      * Inherited classes can adjust the value of `textLength` (adjust argument and call super).
  * Issue:
    * [#1](https://github.com/shellyln/red-agate/issues/1) SvgCanvas: `<text style="font: ...">` is not supported by some libraries
