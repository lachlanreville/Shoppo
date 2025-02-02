import Link from "next/link";
import Styles from "./Uploading.module.css"

export default (props) => {

  return (
    <div className={Styles.container}>
      <img src="/Spinner-1s-267px.svg" width="384px" />
      <h1>{props.message}</h1>
    </div>
  )

}