import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';


import { ICommandPalette } from '@jupyterlab/apputils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { showDialog, Dialog } from '@jupyterlab/apputils';
import { buildIcon } from '@jupyterlab/ui-components';
import { Notification } from '@jupyterlab/apputils';

import { PromiseDelegate, ReadonlyJSONValue } from '@lumino/coreutils';
// import { Widget } from '@lumino/widgets';
import { requestAPI } from './handler';
/**
 * Activate the widgets example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-atp/extension:plugin',
  description: 'A minimal JupyterLab extension Start Atp Train Task Widget.',
  autoStart: true,
  requires: [ICommandPalette,IFileBrowserFactory],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, factory:IFileBrowserFactory) => {
    const { commands } = app;
    const command = 'widgets:open-tab';

    commands.addCommand(command, {
      label: '发起ATP训练任务',
      caption: 'Start Atp Train Task Widget Tab',
      execute: () => {
                // Create a success notification
        console.log(process.env)
        // POST request
        const dataToSend = { name: 'George' };
        requestAPI<any>('hello', {
          body: JSON.stringify(dataToSend),
          method: 'POST'
        })
          .then(reply => {
            console.log(reply);
          })
          .catch(reason => {
            console.error(
              `Error on POST /jupyterlab-atp-extension/hello ${dataToSend}.\n${reason}`
            );
          });
        Notification.success('Congratulations, you created a notifications.');

        // Create an error notification with an action button
        Notification.error('Watch out something went wrong.', {
          actions: [
            { label: 'Help', callback: () => alert('This was a fake error.') }
          ],
          autoClose: 3000
        });

        // Create a notification waiting for an asynchronous task
        const delegate = new PromiseDelegate<ReadonlyJSONValue>();
        const delay = 2000;
        // The fake task is to wait for `delay`
        setTimeout(() => {
          // When resolving and rejecting the task promise, you
          // can provide a object that will be available to construct
          // the success and error message.
          delegate.resolve({ delay });
        }, delay);
        Notification.promise(delegate.promise, {
          // Message when the task is pending
          pending: { message: 'Waiting...', options: { autoClose: false } },
          // Message when the task finished successfully
          success: {
            message: (result: any) =>
              `Action successful after ${result.delay}ms.`
          },
          // Message when the task finished with errors
          error: { message: () => 'Action failed.' }
        });
        // const widget = new ExampleWidget();
        // shell.add(widget, 'main');
      }
    });
    palette.addItem({ command, category: 'Extension Examples' });

    app.commands.addCommand('atp/context-menu:open', {
      label: '开始训练',
      caption: "开始训练",
      icon: buildIcon,
      execute: () => {
        console.log(factory)
        const file = factory.tracker.currentWidget
          ?.selectedItems()
          .next().value;

        if (file) {
          showDialog({
            title: file.name,
            body: 'Path: ' + file.path,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
        }
      }
    });

  }
};

export default extension;
