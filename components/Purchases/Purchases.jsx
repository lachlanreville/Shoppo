import Styles from "./Purchases.module.css";

export default (props) => {
  const { purchases } = props;

  return (
    <ul className={Styles.ProductList}>
      {purchases.map((purchase) => (
        <li key={purchase.id}>
          <div className={Styles.Product}>
            <h3>Ordered on {purchase.SaleDate.slice(0, 10)}</h3>
            {JSON.parse(purchase.Products).map((product) => (
              <div key={product.id}>
                <img
                  src={product.imageUrl[0]}
                  alt={product.Name}
                  className={Styles.productImage}
                />
                <p className={Styles.productTitle}>
                  <b>{product.Name}</b>
                </p>
              </div>
            ))}
            <p>Total ${purchase.Total}</p>
            <p>
              <b>Shipping Information</b>
            </p>
            <p>
              {purchase.firstName} {purchase.lastName}
            </p>
            <p>
              {purchase.streetAddress}, {purchase.postCode}, {purchase.country}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
