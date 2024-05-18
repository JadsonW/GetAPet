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

function Input(props: props) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={props.name}>{props.text}: </label>
      <input
        type={props.type}
        name={props.name}
        id={props.name}
        placeholder={props.placeholder}
        onChange={props.handleOnChange}
        value={props.value}
        {...(props.multiple ? props.multiple : "")}
      />
    </div>
  );
}

export default Input;
