"use client";

import { useEffect, useState } from "react";

type Validator<T> = (value: T) => boolean;

type UsePreferencesFieldProps<T> = {
  value: T;
  setter: (value: T) => void;

  // optional validation
  validator?: Validator<T>;
  errorMessage?: string;

  // if false, you control when to commit via `commit()`
  syncOnChange?: boolean;
};

export function usePreferencesField<T>({
  value,
  setter,
  validator,
  errorMessage = "Invalid value",
  syncOnChange = true,
}: UsePreferencesFieldProps<T>) {
  const [localValue, setLocalValue] =
    useState<T>(value);

  const [error, setError] = useState("");

  // keep local state in sync with store
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const validate = (newValue: T) => {
    if (validator && !validator(newValue)) {
      setError(errorMessage);
      return false;
    }

    setError("");
    return true;
  };

  const setValue = (newValue: T) => {
    setLocalValue(newValue);

    const isValid = validate(newValue);

    if (!isValid) return;

    if (syncOnChange) {
      setter(newValue);
    }
  };

  // single select helper
  const selectValue = (newValue: T) => {
    setValue(newValue);
  };

  // multi select helper
  const toggleValue = <Item,>(
    item: Item
  ) => {
    if (!Array.isArray(localValue)) return;

    const exists = localValue.includes(item);

    const updated = exists
      ? localValue.filter(
          (value) => value !== item
        )
      : [...localValue, item];

    setValue(updated as T);
  };

  // helper for active states
  const isSelected = (valueToCheck: unknown) => {
    if (Array.isArray(localValue)) {
      return localValue.includes(valueToCheck);
    }

    return localValue === valueToCheck;
  };

  // manual commit
  const commit = () => {
    const isValid = validate(localValue);

    if (!isValid) return;

    setter(localValue);
  };

  return {
    value: localValue,
    setValue,
    selectValue,
    toggleValue,
    isSelected,
    error,
    commit,
  };
}