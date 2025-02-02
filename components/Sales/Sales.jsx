import Styles from "./Sales.module.css";

export default (props) => {
  const { sales } = props;

  return (
    <ul className={Styles.ProductList}>
      {sales.map((sale) => (
        <li key={sale.id}>
          <div className={Styles.Product}>
          <h3>Sold on {sale.SaleDate.slice(0, 10)}</h3>
          <img
            src={JSON.parse(sale.imageUrl)[0]}
            alt={sale.Name}
            className={Styles.productImage}
          />
          <p><b>{sale.Name}</b></p>
          <p>Total ${sale.Total}</p>
          <p><b>Shipping Information</b></p>
          <p>{sale.firstName} {sale.lastName}</p>
          <p>{sale.streetAddress}, {sale.postCode}, {sale.country}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
