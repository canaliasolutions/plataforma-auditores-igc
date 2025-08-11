import styles from "@/components/common/FormModal.module.css";

interface TextInputProps {
    value?: string | number;
    label: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    classNm?: string;
    required?: boolean;
    disabled?: boolean;
}

export function TextInput({value, label, placeholder, onChange, classNm, required = false, disabled = false}: TextInputProps) {
    return (
        <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles["form-input"] + ' ' + classNm}
                required={required}
                disabled={disabled}
            />
        </div>
    )
}