#!/usr/bin/env python3

import json
import os
import subprocess
import sys


class LambdaInternalErrorException(Exception):
    pass


def call(command=None, event=None, timeout=None):
    event_ = event
    if not isinstance(event_, str):
        event_ = json.dumps(event_, separators=(',', ':'))
    with subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE) as proc:
        proc.stdin.write(event_.encode('UTF-8'))
        try:
            proc_status = -1
            (output, err) = proc.communicate(timeout=timeout)
            proc_status = proc.wait(timeout=0)
        except subprocess.TimeoutExpired:
            proc.kill()
            (output, err) = proc.communicate()
        if proc_status != 0:
            raise LambdaInternalErrorException()
        elif err is not None:
            raise LambdaInternalErrorException()
        return output

