import ExtendableError from 'es6-error';

export class NotFoundError extends ExtendableError {}

export class BuildNotFoundError extends NotFoundError {
  constructor(projectUrn, buildId) {
    super(`Unable to find build "${projectUrn}:${buildId}".`);
  }
}

export class StageNotFoundError extends NotFoundError {
  constructor(build, stageId) {
    super(`Unable to find stage "${stageId}" in build "${build.urn}".`);
  }
}

export class TaskNotFoundError extends NotFoundError {
  constructor(stage, taskName) {
    super(`Stage "${stage.urn}" does not contain task "${taskName}".`);
  }
}

export class InvalidBuildTransitionError extends Error {
  constructor(build, state) {
    super(`Updating build state from "${build.state}" to "${state}" is not allowed.`);
  }
}

export class InvalidTaskTransitionError extends Error {
  constructor(task, state) {
    super(`Updating task "${task.urn}" state from "${task.state}" to "${state}" is not allowed.`);
  }
}

export class StageNotPendingError extends Error {
  constructor(stage, state) {
    super(`Stage "${stage.urn}" should have state "pending", currently "${stage.state}".`);
  }
}

export class StageNotRunningError extends Error {
  constructor(stage, state) {
    super(`Stage "${stage.urn}" should have state "running", currently "${stage.state}".`);
  }
}

export class BuildNotRunningError extends Error {
  constructor(build) {
    super(`Build "${build.urn}" should be running, current state: "${build.state}".`);
  }
}

export class EmptyStagesError extends Error {
  constructor(build) {
    super(`Queueing build "${build.urn}" without stages is not allowed.`);
  }
}

export class InvalidStateError extends Error {
  constructor(state) {
    super(`State "${state}" is not supported.`);
  }
}

export class ConcurrentStageRunError extends Error {
  constructor(build) {
    super(`Running stages concurrently is disallowed.`);
    this.buildUrn = build.urn;
  }
}
