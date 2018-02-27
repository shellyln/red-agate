#!/usr/bin/env python3

import json
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/../red-agate/')
# pylint: disable=import-error, wrong-import-position
from redagate_lambda import call, LambdaInternalErrorException
# pylint: enable=import-error, wrong-import-position


if __name__ == '__main__':
    from flask import Flask, abort
    app = Flask(__name__)

    @app.errorhandler(LambdaInternalErrorException)
    def internal_error_handler(e):
        return 'Internal Server Error', 500

    @app.route('/')
    def run_report():
        with open('./src/examples/barcode.data.json') as f:
            event = json.loads(f.read())
            event['eventName'] = '/'
            return call(command=["node", "dist/app.js"], event=event)

    @app.route('/billing')
    def run_billing_report():
        with open('./src/examples/barcode.data.json') as f:
            event = json.loads(f.read())
            event['eventName'] = '/billing'
            return call(command=["node", "dist/app.js"], event=event)

    @app.route('/kanban')
    def run_kanban_report():
        with open('./src/examples/barcode.data.json') as f:
            event = json.loads(f.read())
            event['eventName'] = '/kanban'
            return call(command=["node", "dist/app.js"], event=event)

    @app.route('/fba-a4')
    def run_fba_report():
        with open('./src/examples/barcode.data.json') as f:
            event = json.loads(f.read())
            event['eventName'] = '/fba-a4'
            return call(command=["node", "dist/app.js"], event=event)

    @app.route('/barcode')
    def run_barcode_test_report():
        with open('./src/examples/barcode.data.json') as f:
            event = json.loads(f.read())
            event['eventName'] = '/barcode-test'
            return call(command=["node", "dist/app.js"], event=event)

    port = int(os.environ['PORT']) if os.environ.get('PORT') is not None else None

    # To debug with VSCode, set debug=True, use_debugger=False, use_reloader=False.
    #   debug        - whether to enable debug mode and catch exceptions.
    #   use_debugger - whether to use the internal Flask debugger.
    #   use_reloader - whether to reload and fork the process on exception.
    app.run(debug=True, use_debugger=False, use_reloader=False, port=port)
