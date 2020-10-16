/*
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
const brJobs = require('bedrock-jobs');
const {config} = require('bedrock');
const logger = require('./logger');

exports.start = async ({setup}) => {
  // schedule job for exactly one worker to init the ledger
  // config.server.host is used for the jobId to support multiple nodes that
  // share the same redis.
  const jobId = config.server.host;
  const jobQueue = brJobs.addQueue({name: 'veres-one-ledger-init'});

  // check to see if another process has created the job
  let ledgerInitJob = await jobQueue.getJob(jobId);
  if(!ledgerInitJob) {
    // configure handler for the init job
    jobQueue.process(setup);
    // prevent duplicate jobs by specifying a non-unique jobId
    ledgerInitJob = await jobQueue.add({}, {jobId});
  }

  logger.debug('Waiting on ledger initialization job to complete...');
  // resolves immediately if the job is already completed
  await ledgerInitJob.finished();
  logger.debug('Ledger initialization complete.');
};
