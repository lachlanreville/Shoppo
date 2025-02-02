import Link from "next/link";
import Styles from "./Listings.module.css"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalStorage from "@/app/utils/localstorage"

export default (props) => {
  const { products, homePage } = props;

  const deleteProduct = (productId) => {
    let sessionId = LocalStorage.getSession(window)
    if (!sessionId) {
      router.replace("/login", "push")
    } else {
      fetch(`/api/products/${productId}?sessionId=` + sessionId, {
        method: "delete"
      }).then(c => {
        if (c.ok) {
          props.getProducts()
        } else {

        }
      }).catch(err => {
        console.error(err)
      })
    }
  }

  return (
    <ul className={Styles.ProductList}>
      {products.map((product) => (
        <li key={product.id}>
          <div>
            <Link href={`/products?product_id=${product.id}`} className={Styles.linkDecoration}>
              <img
                src={product.imageUrl[0]}
                alt={product.Name}
                className={Styles.productImage}
              />
              <h3 className={Styles.productTitle}>{product.Name}</h3>
              <p className={Styles.productPrice}>A${product.Price}</p>
            </Link>
            {!homePage && <DeleteIcon className={Styles.delete} onClick={() => deleteProduct(product.id)}></DeleteIcon>}
            {!homePage && <Link href={`/sell?product_id=${product.id}`}><EditIcon></EditIcon></Link>}
          </div>
        </li>
      ))}
    </ul>
  )
}