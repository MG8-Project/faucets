import styles from "@/components/Input/Input.module.css";
import Image from "next/image";

const Input = (props) => {
  const { value, onChange, onBlur, placeholder, error } = props;

  return (
    <div className={styles.inputDiv}>
      <input
        className={styles.input}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      {error ? <div className={styles.required}>Required</div> : <></>}
      <Image
        src="assets/icons/wallet.svg"
        alt="wallet-icon"
        width={30}
        height={30}
      />
    </div>
  );
};

export default Input;
