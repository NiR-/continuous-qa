import {displayPlugin as jsonResponder} from '../responder/json';
import {displayPlugin as halResponder} from '../responder/hal';
import {PluginNotFoundError} from '../domain/errors';
import {HttpClientError} from '../errors';
import PluginRepository from '../service/PluginRepository';

/**
 * @api {get} /plugin/:name Retrieve a plugin
 * @apiName GetPlugin
 * @apiGroup plugin-api
 * @apiVersion 0.2.0
 * @apiParam {String} name
 * @apiSuccess (200) {String}   name
 * @apiSuccess (200) {String}   type
 * @apiSuccess (200) {String[]} dependencies Dependency name as key, version as value
 * @apiSuccess (200) {Object[]} endpoints
 * @apiSuccess (200) {Object[]} hooks
 * @apiSuccess (200) {String}   platform     Only for "runner" plugins
 */
export function handleGetPlugin(req, res, next) {
  PluginRepository
    .get(req.params.name)
    .then((plugin) => {
      res.format({
        'application/json': () => jsonResponder(res.status(200), plugin),
        'application/hal+json': () => halResponder(res.status(200), plugin),
        'default': () => res.sendStatus(406)
      });
    }, (err) => {
      return Promise.reject(err instanceof PluginNotFoundError ? new HttpClientError('PluginNotFound', 404) : err);
    })
    .catch(err => next(err))
  ;
}
