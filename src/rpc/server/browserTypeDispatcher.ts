/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserBase } from '../../browser';
import { BrowserTypeBase, BrowserType } from '../../server/browserType';
import * as types from '../../types';
import { BrowserDispatcher } from './browserDispatcher';
import { BrowserChannel, BrowserTypeChannel, BrowserContextChannel, BrowserTypeInitializer, BrowserServerChannel } from '../channels';
import { Dispatcher, DispatcherScope } from './dispatcher';
import { BrowserContextBase } from '../../browserContext';
import { BrowserContextDispatcher } from './browserContextDispatcher';
import { BrowserServerDispatcher } from './browserServerDispatcher';

export class BrowserTypeDispatcher extends Dispatcher<BrowserType, BrowserTypeInitializer> implements BrowserTypeChannel {
  constructor(scope: DispatcherScope, browserType: BrowserTypeBase) {
    super(scope, browserType, 'browserType', {
      executablePath: browserType.executablePath(),
      name: browserType.name()
    }, false, browserType.name());
  }

  async launch(params: types.LaunchOptions): Promise<BrowserChannel> {
    const browser = await this._object.launch(params);
    return new BrowserDispatcher(this._scope, browser as BrowserBase);
  }

  async launchPersistentContext(params: { userDataDir: string } & types.LaunchOptions & types.BrowserContextOptions): Promise<BrowserContextChannel> {
    const browserContext = await this._object.launchPersistentContext(params.userDataDir, params);
    return new BrowserContextDispatcher(this._scope, browserContext as BrowserContextBase);
  }

  async launchServer(params: types.LaunchServerOptions): Promise<BrowserServerChannel> {
    return new BrowserServerDispatcher(this._scope, await this._object.launchServer(params));
  }

  async connect(params: types.ConnectOptions): Promise<BrowserChannel> {
    const browser = await this._object.connect(params);
    return new BrowserDispatcher(this._scope, browser as BrowserBase);
  }
}
