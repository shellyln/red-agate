// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import * as RedAgate          from './red-agate';
import { SvgCanvas,
         SvgTextAttributes,
         TextAlignValue,
         TextBaselineValue }  from 'red-agate-svg-canvas/modules/drawing/canvas/SvgCanvas';
import { Rect2D }             from 'red-agate-svg-canvas/modules/drawing/canvas/TransferMatrix2D';
import { TextEncoding }       from 'red-agate-util/modules/convert/TextEncoding';
import { FileFetcher }        from 'red-agate-util/modules/io/FileFetcher';
import { Logger }             from 'red-agate-util/modules/io/Logger';
import { ShapeBaseProps,
         ShapeProps,
         shapePropsDefault,
         Shape,
         AmbientProps,
         CONTEXT_SVG_CANVAS,
         CONTEXT_SVG_PATH }   from './tags/Shape';



export interface PrinterMarksProps extends ShapeProps {
    width: number;
    height: number;
    cropMarkLength?: number;
    bleedMarks?: boolean;
    northBleed?: number;
    southBleed?: number;
    eastBleed?: number;
    westBleed?: number;
    centerMarks?: boolean;
    centerMarkArmLength?: number;
    centerMarkArmMargin?: number;
    hFold?: number[];
    vFold?: number[];
}

export const printerMarksDefault: PrinterMarksProps = Object.assign({}, shapePropsDefault, {
    fill: false,
    stroke: true,
    strokeColor: "black",
    lineWidth: 0.105834, // 0.3pt === 0.105834mm

    width: 210,
    height: 297,
    cropMarkLength: 9,
    bleedMarks: true,
    northBleed: 3,
    southBleed: 3,
    eastBleed: 3,
    westBleed: 3,
    centerMarks: true,
    centerMarkArmLength: 15,
    centerMarkArmMargin: 3,
});

export class PrinterMarks extends Shape<PrinterMarksProps> {
    public constructor(props: PrinterMarksProps) {
        super(Object.assign({}, printerMarksDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const c: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        const p = this.props;

        // Crop Marks
        {
            // H
            c.moveTo(        - (p.westBleed as number)                               ,        0);
            c.lineTo(        - (p.westBleed as number) - (p.cropMarkLength as number),        0);
            c.moveTo(        - (p.westBleed as number)                               , p.height);
            c.lineTo(        - (p.westBleed as number) - (p.cropMarkLength as number), p.height);

            c.moveTo(p.width + (p.eastBleed as number)                               ,        0);
            c.lineTo(p.width + (p.eastBleed as number) + (p.cropMarkLength as number),        0);
            c.moveTo(p.width + (p.eastBleed as number)                               , p.height);
            c.lineTo(p.width + (p.eastBleed as number) + (p.cropMarkLength as number), p.height);

            // V
            c.moveTo(      0,          - (p.northBleed as number)                               );
            c.lineTo(      0,          - (p.northBleed as number) - (p.cropMarkLength as number));
            c.moveTo(p.width,          - (p.northBleed as number)                               );
            c.lineTo(p.width,          - (p.northBleed as number) - (p.cropMarkLength as number));

            c.moveTo(      0, p.height + (p.southBleed as number)                               );
            c.lineTo(      0, p.height + (p.southBleed as number) + (p.cropMarkLength as number));
            c.moveTo(p.width, p.height + (p.southBleed as number)                               );
            c.lineTo(p.width, p.height + (p.southBleed as number) + (p.cropMarkLength as number));
        }

        // Bleed Marks
        if (p.bleedMarks) {
            // H
            c.moveTo(                                                               0,          - (p.northBleed as number));
            c.lineTo(        - (p.westBleed as number) - (p.cropMarkLength as number),          - (p.northBleed as number));
            c.moveTo(                                                               0, p.height + (p.southBleed as number));
            c.lineTo(        - (p.westBleed as number) - (p.cropMarkLength as number), p.height + (p.southBleed as number));

            c.moveTo(p.width                                                         ,          - (p.northBleed as number));
            c.lineTo(p.width + (p.eastBleed as number) + (p.cropMarkLength as number),          - (p.northBleed as number));
            c.moveTo(p.width                                                         , p.height + (p.southBleed as number));
            c.lineTo(p.width + (p.eastBleed as number) + (p.cropMarkLength as number), p.height + (p.southBleed as number));

            // V
            c.moveTo(        - (p.westBleed as number),                                                                  0);
            c.lineTo(        - (p.westBleed as number),          - (p.northBleed as number) - (p.cropMarkLength as number));
            c.moveTo(p.width + (p.eastBleed as number),                                                                  0);
            c.lineTo(p.width + (p.eastBleed as number),          - (p.northBleed as number) - (p.cropMarkLength as number));

            c.moveTo(        - (p.westBleed as number), p.height                                                          );
            c.lineTo(        - (p.westBleed as number), p.height + (p.southBleed as number) + (p.cropMarkLength as number));
            c.moveTo(p.width + (p.eastBleed as number), p.height                                                          );
            c.lineTo(p.width + (p.eastBleed as number), p.height + (p.southBleed as number) + (p.cropMarkLength as number));
        }

        // Center Marks
        if (p.centerMarks) {
            // H
            c.moveTo(p.width / 2,          - (p.northBleed as number)                               );
            c.lineTo(p.width / 2,          - (p.northBleed as number) - (p.cropMarkLength as number));
            c.moveTo(p.width / 2, p.height + (p.southBleed as number)                               );
            c.lineTo(p.width / 2, p.height + (p.southBleed as number) + (p.cropMarkLength as number));

            // H arms
            c.moveTo(p.width / 2 - (p.centerMarkArmLength as number) / 2,          - (p.northBleed as number) - (p.centerMarkArmMargin as number));
            c.lineTo(p.width / 2 + (p.centerMarkArmLength as number) / 2,          - (p.northBleed as number) - (p.centerMarkArmMargin as number));
            c.moveTo(p.width / 2 - (p.centerMarkArmLength as number) / 2, p.height + (p.southBleed as number) + (p.centerMarkArmMargin as number));
            c.lineTo(p.width / 2 + (p.centerMarkArmLength as number) / 2, p.height + (p.southBleed as number) + (p.centerMarkArmMargin as number));

            // V
            c.moveTo(        - (p.westBleed as number)                               , p.height / 2);
            c.lineTo(        - (p.westBleed as number) - (p.cropMarkLength as number), p.height / 2);
            c.moveTo(p.width + (p.eastBleed as number)                               , p.height / 2);
            c.lineTo(p.width + (p.eastBleed as number) + (p.cropMarkLength as number), p.height / 2);

            // V arms
            c.moveTo(        - (p.westBleed as number) - (p.centerMarkArmMargin as number), p.height / 2 - (p.centerMarkArmLength as number) / 2);
            c.lineTo(        - (p.westBleed as number) - (p.centerMarkArmMargin as number), p.height / 2 + (p.centerMarkArmLength as number) / 2);
            c.moveTo(p.width + (p.eastBleed as number) + (p.centerMarkArmMargin as number), p.height / 2 - (p.centerMarkArmLength as number) / 2);
            c.lineTo(p.width + (p.eastBleed as number) + (p.centerMarkArmMargin as number), p.height / 2 + (p.centerMarkArmLength as number) / 2);
        }

        if (p.hFold) {
            let x = 0;
            for (const dx of p.hFold) {
                x += dx;
                c.moveTo(x,          - (p.northBleed as number)                               );
                c.lineTo(x,          - (p.northBleed as number) - (p.cropMarkLength as number));
                c.moveTo(x, p.height + (p.southBleed as number)                               );
                c.lineTo(x, p.height + (p.southBleed as number) + (p.cropMarkLength as number));
            }
        }

        if (p.vFold) {
            let y = 0;
            for (const dy of p.vFold) {
                y += dy;
                c.moveTo(        - (p.westBleed as number)                               , y);
                c.lineTo(        - (p.westBleed as number) - (p.cropMarkLength as number), y);
                c.moveTo(p.width + (p.eastBleed as number)                               , y);
                c.lineTo(p.width + (p.eastBleed as number) + (p.cropMarkLength as number), y);
            }
        }

        return ``;
    }
}
