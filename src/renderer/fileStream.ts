const electron = (window as any)['electron'];
const uuid: () => string = (window as any)['electron']['uuid'];
import { on } from '../util';

const ipcRenderer = electron.ipcRenderer as Electron.IpcRenderer;
export type FileStreamOption = {
  sliceSize: number;
};
export class FileStream {
  private options: FileStreamOption;
  constructor(private file: File, options?: Partial<FileStreamOption>) {
    // default slice size is 100MB
    this.options = Object.assign({ sliceSize: 100 * 1024 * 1024 }, options);
  }
  start() {
    return new Promise<string>(async (res, rej) => {
      const id = uuid();
      // listen retrieve file event
      const off = on(
        `${id}-requestContent`,
        ipcRenderer,
        async (e, chunkIndex) => {
          const start = chunkIndex * this.options.sliceSize;
          const end = Math.min(start + this.options.sliceSize, this.file.size);
          const chunk = await this.file.slice(start, end).arrayBuffer();
          ipcRenderer.send(`${id}-sendContent`, {
            chunk: new Uint8Array(chunk),
            finished: end === this.file.size,
          });
        }
      );

      // listen success event;
      ipcRenderer.once(`${id}-success`, () => {
        // remove listener
        off();
        // resolve path;
        res(path);
      });

      // listen error event;
      const offError = on(`${id}-error`, ipcRenderer, (e, err) => {
        offError();
        rej(err);
      });

      // register a file to ipcMain by its name and last modified time, get its id and path from main process;
      const {
        path,
        code,
        reason,
      }: { path: string; code?: number; reason?: string } =
        await ipcRenderer.invoke('register-file', {
          name: this.file.name,
          lastModified: this.file.lastModified,
          id,
        });

      if (code !== undefined) {
        rej(new Error(reason!));
        return;
      }
    });
  }
}
