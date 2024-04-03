import styles from "@/components/Button/Button.module.css";

const Button = (props) => {
  const { onClick, disabled, children } = props;
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
