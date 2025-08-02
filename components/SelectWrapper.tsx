import {
  ReactElement,
  OptionHTMLAttributes,
  useMemo,
} from "react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import styles from "./SelectWrapper.module.css";

type OptionEl = ReactElement<OptionHTMLAttributes<HTMLOptionElement>, "option">;

interface Props {
  value: string;
  onChange: (v: string) => void;
  children: OptionEl | OptionEl[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;              // ← NUEVO (opcional)
  wrapperClassName?: string;
}

export default function SelectWrapper({
  value,
  onChange,
  children,
  placeholder = "Selecciona…",
  disabled = false,
  required = false,
  name,
  wrapperClassName = "",
}: Props) {
  /* 1. Convertir los <option> hijos a objetos ---------- */
  const options = useMemo(() => {
    const arr = Array.isArray(children) ? children : [children];
    return arr.map((el) => ({
      label: el.props.children as string,
      value: el.props.value as string,
      disabled: el.props.disabled ?? false,
    }));
  }, [children]);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div
        className={clsx(
          styles.wrapper,
          wrapperClassName,
          disabled && styles.disabled
        )}
      >
        {/* 2. Hidden input → mantiene required + envío en <form> */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value}
            required={required}
          />
        )}

        {/* ---------- Botón ---------- */}
        <Listbox.Button className={styles.button}>
          <span className="truncate">
            {value === ""
              ? placeholder
              : options.find((o) => o.value === value)?.label}
          </span>
          <ChevronUpDownIcon className="h-4 w-4 text-primary transition-transform ui-open:rotate-180" />
        </Listbox.Button>

        {/* ---------- Pop-up ---------- */}
        <Listbox.Options className={styles.menu}>
          {options.map((opt) => (
            <Listbox.Option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className={({ active, disabled }) =>
                clsx(
                  styles.item,
                  active && styles.itemActive,
                  disabled && styles.itemDisabled
                )
              }
            >
              {({ selected }) => (
                <span
                  className={clsx(
                    "truncate",
                    selected && "font-medium text-primary"
                  )}
                >
                  {opt.label}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
