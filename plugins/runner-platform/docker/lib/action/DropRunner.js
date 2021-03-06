import {RunnerNotFoundError} from '../service/RunnerError';
import {HttpClientError} from '../errors';

/**
 * @api {delete} /runner/:runnerUrn Remove a runner
 * @apiName DropRunner
 * @apiGroup runner-api
 * @apiVersion 0.1.0
 * @apiParam {String} runnerUrn
 * @apiParamExample Parameters Example
 *     runnerUrn = urn:gh:knplabs/gaufrette:30:1:php-cs-fixer
 * @apiError (400) UrnNotValid          The build URN is not valid
 * @apiError (404) RunnerNotExists
 */
export default class DropRunner {
  constructor(runner) {
    this._runner = runner;
  }

  handleRequest(req, res, next) {
    const {runnerUrn} = req.params;

    this
      ._runner
      .dropRunner(runnerUrn)
      .then(() => res.sendStatus(204).end())
      .catch((err) => {
        if (err instanceof RunnerNotFoundError) {
          return next(new HttpClientError('RunnerNotExists', 404));
        }

        next(err);
      })
    ;
  }
}
