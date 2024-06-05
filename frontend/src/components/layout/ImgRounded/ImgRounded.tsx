import styles from './ImgRounded.module.css'

interface imgProps {
  src?: string;
  alt?: string;
  width: string;
}

function ImgRounded(props: imgProps) {
  const { width, src, alt } = props;
  return (
    <img
      className={`${styles.rounded_image} ${styles[width]}`}
      src={src}
      alt={alt}
    />
  );
}

export default ImgRounded;
