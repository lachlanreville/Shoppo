import Styles from "./popup.module.css";
import { useState, useEffect } from "react";

export default (props) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); 
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  let error = props.error ? true : false;

  if (error) {
    return (
      <div className={Styles.errorPopup}>
        <h2>{props.header}</h2>
        <p>{props.message}</p>
      </div>
    );
  } else {
    return (
      <div className={Styles.validPopup}>
        <h2>{props.header}</h2>
        <p>{props.message}</p>
      </div>
    );
  }
};
