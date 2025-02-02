import Styles from "./Navigation.module.css"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from "next/link";

export default () => {
  return (
    <nav className={Styles.navBar}>
      <div className={Styles.logo}>
        <Link href="/" className={Styles.linkDecoration}>
          <img className={Styles.shoppo} src="/images/shoppo.png" />
        </Link>
      </div>
      <ul className={Styles.navList}>
        <li className={Styles.sell}>
          <Link href="/sell">
            <SellIcon className={Styles.sellIcon} />
          </Link>
        </li>
        <li className={Styles.cart}>
          <Link href="/cart">
            <ShoppingCartIcon className={Styles.cartIcon} />
          </Link>
        </li>
        <li className={Styles.dashboard}>
          <Link href="/dashboard">
            <AccountCircleIcon className={Styles.dashboardIcon} />
          </Link>
        </li>
      </ul>
    </nav>
  )
}