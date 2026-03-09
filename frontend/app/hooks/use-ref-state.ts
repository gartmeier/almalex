import { useRef, useState } from "react";

export function useRefState<T>(initial: T) {
  let [state, _setState] = useState(initial);
  let ref = useRef(state);

  function setState(update: T | ((prev: T) => T)) {
    _setState((prev) => {
      let next = typeof update === "function" ? (update as (prev: T) => T)(prev) : update;
      ref.current = next;
      return next;
    });
  }

  return [state, setState, ref] as const;
}
