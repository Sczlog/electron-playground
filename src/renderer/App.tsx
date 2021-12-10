import { ChangeEventHandler, useCallback } from 'react';
import { FileStream } from './fileStream';

export default function App() {
  const onLoadFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e) => {
      const file = e.target.files![0];
      const stream = new FileStream(file);
      const path = await stream.start();
      console.log(path);
    },
    []
  );
  return <input type="file" onChange={onLoadFile} />;
}
