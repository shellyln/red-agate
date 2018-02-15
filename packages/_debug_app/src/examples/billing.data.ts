
import { BillingStatement } from './billing';



const data: BillingStatement = {
    me: {
        name: 'Acme Inc.',
        addr1: '999 Kiely Blvd,',
        addr2: '',
        city: 'Santa Clara,',
        state: 'CA',
        zip: '99999',
    },
    billTo: {
        name: 'Foobar Inc.',
        addr1: '9999 N Fremont St,',
        addr2: '',
        city: 'Portland,',
        state: 'OR',
        zip: '99999',
    },
    date: '2020-01-01',
    invoiceNo: 'X-1234-567890',
    subtotal: 0,
    tax1: 0,
    tax1Name: 'Sales Tax',
    tax1Rate: 0.05,
    tax2: 0,
    tax2Name: 'Excise Tax',
    tax2Rate: 0.03,
    shipping: 3.55,
    total: 0,
    paid: 0,
    totalDue: 0,
    notes: 'note\nnote',
    detail: [...Array(41).keys()].map(v => ({
        date: '2019-12-01',
        description: `a(${v})`,
        qty: 4,
        rate: 15.33,
        amount: 0,
    })),
};

export default data;
