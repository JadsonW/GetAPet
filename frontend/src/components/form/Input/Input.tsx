import styles from "./Input.module.css";

interface props {
  text?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  handleOnChange?: any;
  value?: any;
  multiple?: any;
}

function Input({
  text,
  name,
  type,
  placeholder,
  handleOnChange,
  value,
  multiple,
}: props) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}: </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        {...(multiple ? { multiple } : "")}
      />
    </div>
  );
}

export default Input;
