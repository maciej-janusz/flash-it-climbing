import { useState, useEffect } from "react";

/**
 * A custom hook that returns a debounced version of a state value.
 * Manages its own state internally, returning the debounced value,
 * the current value, and a dispatcher to update the value.
 * 
 * @param initialValue The initial value for the state.
 * @param delay The delay in milliseconds (default: 500ms).
 * @returns A tuple containing [debouncedValue, currentValue, setValue].
 */
export function useDebounce<T>(initialValue: T, delay: number = 500): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, value, setValue];
}
