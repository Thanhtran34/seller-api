// hook controller
import axios from 'axios'
import { Hook } from '../models/hook.js'

export class HookController {
  /**
   * Sends payload as JSON via POST all subscribers with
   * @param {String} action Type of action ['newAd' or 'newPublisher']
   * @param {Object} payload Payload to send
   */
  async runHook(action, payload) {
    const hooks = await Hook.find();
    const promises = [];
    hooks
      .filter((hook) => hook.action === action)
      .forEach((hook) => promises.push(axios.post(hook.callback, payload)));
    await Promise.all(promises);
  }
}
