import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

export default function Error({ message, admin }) {
  const [more, toggle] = useState(false);

  return (
    <div class="absolute bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border rounded p-4">
      <h2 class="text-xl font-bold">Something went wrong.</h2>
      {admin && (
        <>
          <button class="text-base border" onClick={() => toggle(!more)}>
            Click here for more information.
          </button>
          {more && <p class="border rounded text-base bg-slate-200 p-3">{message}</p>}
        </>
      )}
    </div>
  );
}
