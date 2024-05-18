import styles from "./Container.module.css";

interface props {
  children: any;
}

function Container(props: props) {
  return <main className={styles.container}>{props.children}</main>;
}
export default Container;
