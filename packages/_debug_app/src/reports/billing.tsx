
/** @jsx RedAgate.createElement */
import * as RedAgate       from 'red-agate/modules/red-agate';
import { Repeat,
         ForEach,
         If,
         Do,
         Facet,
         Template }        from 'red-agate/modules/red-agate/taglib';
import { Html5 }           from 'red-agate/modules/red-agate/html';
import { Svg,
         Ambient,
         Canvas,
         Group,
         Rect,
         SvgFragment,
         SvgAssetFragment,
         Text,
         GridLine }        from 'red-agate/modules/red-agate/svg';
import { Font,
         Image,
         Script,
         Style }           from 'red-agate/modules/red-agate/bundler';
import { SvgCanvas }       from 'red-agate-svg-canvas/modules/drawing/canvas/SvgCanvas';
import { query }           from 'red-agate/modules/red-agate/data';
import { Lambda }          from 'red-agate/modules/red-agate/app';



export interface CompanyInfo {
    name: string;
    addr1: string;
    addr2: string;
    city: string;
    state: string;
    zip: string;
}

export interface BillingStatementDetail {
    date: string;
    description: string;
    qty: number;
    rate: number;
    amount: number;
}

export interface BillingStatement {
    me: CompanyInfo;
    billTo: CompanyInfo;
    date: string;
    invoiceNo: string;
    subtotal: number;
    tax1: number;
    tax1Name: string;
    tax1Rate: number;
    tax2: number;
    tax2Name: string;
    tax2Rate: number;
    shipping: number;
    total: number;
    paid: number;
    totalDue: number;
    notes: string;
    detail: BillingStatementDetail[];
}



export let billngReportHandler: Lambda<BillingStatement> = (event, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>
    <Do> { () => {
        event.detail.forEach(x => x.amount = x.qty * x.rate);
        event.subtotal = event.detail.reduce((a, b) => a + b.amount, 0);
        event.tax1     = event.subtotal * event.tax1Rate;
        event.tax2     = event.subtotal * event.tax2Rate;
        event.total    = event.subtotal + event.tax1 + event.tax2 + event.shipping;
        event.totalDue = event.total - event.paid;
    }}
    </Do>

    <head>
        <title>Billing statement</title>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"/>
        <style dangerouslySetInnerHTML={{ __html: require('./billing.style.css') }}/>
    </head>

    <body class="A4">

        <ForEach items={query(event.detail).groupEvery({single: 15, first: 21, intermediate: 20, last: 14}).select()} scope={{carriedAmount: 0}}> {
            (details: BillingStatementDetail[], pageIndex: number, pages: BillingStatementDetail[][], scope: any) =>

            <section class="sheet padding-10mm">

                <section class="report-header">
                    <h1 class="report-title">Billing Statement</h1>

                    <div class="my-company-info">
                        <h1 class="value company-name"><img
                            src="https://shellyln.github.io/assets/app/Emoticon_Smile_Face.svg"
                            style="width: 16mm; height: 16mm;"/>{event.me.name}</h1>
                        <div class="value addr1">{event.me.addr1}</div>
                        <div class="value addr2">{event.me.addr2}</div>
                        <div class="value city-st-zip">{event.me.city} {event.me.state} {event.me.zip}</div>
                    </div>

                    <div class="bill-to">
                        <table>
                            <tr><td class="header date">Date:</td><td class="value date">{event.date}</td></tr>
                            <tr><td class="header invoice-no">Invoice#:</td><td class="value invoice-no">{event.invoiceNo}</td></tr>
                            <tr><td class="header page">Page:</td><td class="value page">{pageIndex + 1} of {pages.length}</td></tr>
                        </table>
                        <table>
                            <tr><td rowspan="5" class="header bill-to">Bill To:</td><td class="value company-name">{event.billTo.name}</td></tr>
                            <tr><td class="value addr1">{event.billTo.addr1}</td></tr>
                            <tr><td class="value addr2">{event.billTo.addr2}</td></tr>
                            <tr><td class="value city-st-zip">{event.billTo.city} {event.billTo.state} {event.billTo.zip}</td></tr>
                            <tr><td></td></tr>
                        </table>
                    </div>
                </section>

                <section class="report-detail">
                    <div>
                        <table class="detail">
                            <thead>
                                <tr>
                                    <th class="header date">Date</th>
                                    <th class="header description">Description</th>
                                    <th class="header qty">Qty</th>
                                    <th class="header rate">Rate</th>
                                    <th class="header amount">Amount</th>
                                </tr>
                            </thead>

                            <If condition={pageIndex > 0}>
                                <tbody class="brought-forward">
                                    <tr>
                                        <th class="header" colspan="4">Total brought forward from previous page</th>
                                        <td class="value number">{scope.carriedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                </tbody>
                            </If>

                            <If condition={details.length > 0}>
                                <tbody>
                                    <ForEach items={details}> { (v: BillingStatementDetail, i: number) =>
                                        <Template>
                                            <Do> { () => {
                                                v.description = `${i + 1}: ${v.description}`;
                                                v.description += ' 11111';
                                                // console.log(v.description);
                                            }}
                                            </Do>
                                            <Do> { () => {
                                                v.description += ' 22222';
                                                // console.log(v.description);
                                            }}
                                            </Do>
                                            <tr>
                                                <td class="value date">{v.date}</td>
                                                <td class="value description">{v.description}</td>
                                                <td class="value number qty">{v.qty.toLocaleString('en-US')}</td>
                                                <td class="value number rate">{v.rate}</td>
                                                <td class="value number amount">{v.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                            </tr>
                                        </Template> }
                                    </ForEach>
                                </tbody>
                            </If>

                            <If condition={pageIndex !== (pages.length - 1)}>
                                <Do> { () => {
                                    scope.carriedAmount = (scope.carriedAmount || 0) + details.reduce((a, b) => a + b.amount, 0);
                                }}
                                </Do>
                                <tfoot class="carried-forward">
                                    <tr>
                                        <th class="header" colspan="4">Total carried forward to the next page</th>
                                        <td class="value number">{scope.carriedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                </tfoot>
                            </If>

                            <If condition={pageIndex === (pages.length - 1)}>
                                <tfoot>
                                    <tr class="subtotal">
                                        <th class="header" colspan="4">SUBTOTAL</th>
                                        <td class="value number">{event.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                    <tr class="tax1">
                                        <td class="header" colspan="4">{event.tax1Name} {event.tax1Rate.toLocaleString('en-US', { style: 'percent' })}</td>
                                        <td class="value number">{event.tax1.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                    <tr class="tax2">
                                        <td class="header" colspan="4">{event.tax2Name} {event.tax2Rate.toLocaleString('en-US', { style: 'percent' })}</td>
                                        <td class="value number">{event.tax2.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                    <tr class="shipping">
                                        <td class="header" colspan="4">Shipping &amp; Handling</td>
                                        <td class="value number">{event.shipping.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                    <tr class="total">
                                        <th class="header" colspan="4">TOTAL</th>
                                        <td class="value number">{event.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                    <tr class="paid">
                                        <th class="header" colspan="4">PAID</th>
                                        <td class="value number">{event.paid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                    <tr class="total-due">
                                        <th class="header" colspan="4">TOTAL DUE</th>
                                        <td class="value number">{event.totalDue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    </tr>
                                </tfoot>
                            </If>
                        </table>
                    </div>
                </section>

                <section class="report-footer">
                    <div class="notes">
                        Notes:
                        <div class="notes-body" setInnerText={{ __text: event.notes }}/>
                    </div>
                    <div class="barcode">{event.invoiceNo.replace(/-/g, '')}</div>
                </section>

            </section> }
        </ForEach>

    </body>
</Html5>, callback);
