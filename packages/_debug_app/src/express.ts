
import { default as home }    from './views/home';
import { default as reports } from './views/reports';

// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");



export default function(isDocker: boolean) {
    const express = requireDynamic('express')();

    home(express);
    reports(express, isDocker);

    express.listen(process.env.PORT || 3000, () => {
        console.log('start');
    });

    return express;
}
