import {default as BuildRepository} from '../service/BuildRepository';
import * as Error from '../Exception';

/**
 * @api {patch} /build/:buildUrn/:stage/:runner Update runner state
 * @apiName UpdateRunnerState
 * @apiGroup build-api
 * @apiVersion 0.1.0
 * @apiParam {String} buildUrn URN of the build
 * @apiParam {Number} stage    Stage id (starts at 1)
 * @apiParam {String} runner   Name of the runner
 * @apiParam {String} state    New state (<code>form-data</code> parameter, either: <code>running</code>, <code>succeeded</code>, <code>failed</code>)
 * @apiParamExample Parameters Example
 *     buildUrn = urn:gh:knplabs/gaufrette:1
 *     stage = 1
 *     runner = php-cs-fixer
 *     state = failed
 * @apiSuccess (200) {String}   projectUrn           Project URN
 * @apiSuccess (200) {String}   branch
 * @apiSuccess (200) {Number}   buildId
 * @apiSuccess (200) {String}   repoUrl              Repository URL
 * @apiSuccess (200) {String}   state                Build state (<code>created, started, finished</code>)
 * @apiSuccess (200) {Object[]} stages
 * @apiSuccess (200) {String}   stages.state         Stage state (<code>queued, started, finished</code>)
 * @apiSuccess (200) {Object[]} stages.runners
 * @apiSuccess (200) {String}   stages.runners.name
 * @apiSuccess (200) {String}   stages.runners.state
 * @apiError (400) InvalidState
 * @apiError (400) BuildNotRunning
 * @apiError (400) StageNotRunning
 * @apiError (400) TransitionDisallowed
 * @apiError (404) BuildNotFound
 * @apiError (404) StageNotFound
 * @apiError (404) RunnerNotFound
 */
export default function UpdateRunnerState(req, res, next) {
  const stageId = req.params.stage - 1;
  const runnerName = req.params.runner;
  const state = req.body.state || null;

  if (state == null) {
    return res.status(400).json({error: 'InvalidState'});
  }

  BuildRepository
    .get(req.params.projectUrn, req.params.buildId)
    .then((build) => {
      // Stage ID starts at one in URL, but zero in collection
      build.updateRunnerState(stageId, runnerName, state);

      return build.save();
    })
    .then(build => res.status(200).json(build))
    .catch((err) => {
      if (err instanceof Error.BuildNotFoundError) {
        return res.status(404).json({error: 'BuildNotFound'});
      } else if (err instanceof Error.StageNotFoundError) {
        return res.status(404).json({error: 'StageNotFound'});
      } else if (err instanceof Error.RunnerNotFoundError) {
        return res.status(404).json({error: 'RunnerNotFound'});
      } else if (err instanceof Error.InvalidStateError) {
        return res.status(400).json({error: 'InvalidState'});
      } else if (err instanceof Error.BuildNotRunningError) {
        return res.status(400).json({error: 'BuildNotRunning'});
      } else if (err instanceof Error.StageNotRunningError) {
        return res.status(400).json({error: 'StageNotRunning'});
      } else if (err instanceof Error.InvalidRunnerTransitionError) {
        return res.status(400).json({error: 'TransitionDisallowed'});
      }

      next(err)
    })
  ;
};
