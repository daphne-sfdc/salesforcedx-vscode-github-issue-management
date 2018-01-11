/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as sinon from 'sinon';
import { LaunchRequestArguments } from '../../../src/adapter/apexReplayDebug';
import { LogContext, LogContextUtil } from '../../../src/core';
import { LogEntryState } from '../../../src/states';

// tslint:disable:no-unused-expression
describe('LogEntry event', () => {
  let readLogFileStub: sinon.SinonStub;

  beforeEach(() => {
    readLogFileStub = sinon
      .stub(LogContextUtil.prototype, 'readLogFile')
      .returns(['line1', 'line2']);
  });

  afterEach(() => {
    readLogFileStub.restore();
  });

  it('Should handle event', () => {
    const logFile = new LogContext({
      logFile: '/path/foo.log',
      stopOnEntry: true,
      trace: true
    } as LaunchRequestArguments);
    const logEntry = new LogEntryState();

    const isStopped = logEntry.handle(logFile);

    expect(isStopped).to.be.true;
    const stackFrames = logFile.getFrames();
    expect(stackFrames.length).to.equal(1);
    const stackFrame = stackFrames[0];
    expect(stackFrame.id).to.equal(0);
    expect(stackFrame.name).to.equal('');
    expect(stackFrame.line).to.equal(logFile.getLogLinePosition() + 1);
    expect(stackFrame.source.name).to.equal(logFile.getLogFileName());
    expect(stackFrame.source.path).to.equal(
      encodeURI('file://' + logFile.getLogFilePath())
    );
  });
});
