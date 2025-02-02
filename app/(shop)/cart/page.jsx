"use client";
import Styles from "./cart.module.css";
import localStorage from "app/utils/localstorage.js";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Navigation from "@/components/Navigation";
import SessionHandler from "@/components/SessionHandler";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";
import API from "app/utils/api.js"
import Popup from "@/components/Popup";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState({
    error: false,
    good: true,
    header: "",
    message: ""
  })
  let router = useRouter();

  useEffect(() => {
    getCart();
  }, []);

  async function getCart() {
    let cart = await localStorage.getCart(window);

    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    setCart(cart);
  }

  function getTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].Price;
    }
    return total;
  }

  const createOrder = (event) => {
    event.preventDefault();

    let sessionID = localStorage.getSession(window);
    let firstName = event.target.firstName.value;
    let lastName = event.target.lastName.value;
    let streetAddress = event.target.streetAddress.value;
    let country = event.target.country.value;
    let postCode = event.target.postCode.value;
    let city = event.target.city.value;
    let state = event.target.state.value;

    let cardNumber = event.target.cardNumber.value;
    let expDate = event.target.expDate.value;
    let CVV = event.target.cvv.value;

    let cartItems = cart;
    let total = getTotal() + 10;

    let order = {
      firstName,
      lastName,
      streetAddress,
      country,
      postCode,
      city,
      state,
      cardNumber,
      expDate,
      CVV,
      cartItems,
      total,
    };

    API.SendOrder(sessionID, order)
      .then(res => res.json())
      .then(async (c) => {
        console.log(c)
        if (c.success) {
          let orderNo = c.orderNumber;
          localStorage.clearCart(window);

          router.push("/success?order_no=" + orderNo);
        } else {
          setError({
            error: true,
            good: true,
            header: "Incorrect Details",
            message: c.message,
          });
        }
      })
      .catch((err) => {
        setError({
          error: true,
          good: true,
          header: "There was an error!",
          message: "There was an error. Please try again!",
        });
      });
  };

  const removeItem = (id) => {
    localStorage.removeFromCart(window, id);
    setTimeout(() => {
      getCart();
    }, 50);
  };

  return (
    <>
      <Navigation />
      <SessionHandler />
      {cart.length >= 1 ? (
        <div className={Styles.cartPage}>
          <div className={Styles.pageContainer}>
            <div className={Styles.pageHeaderContainer}>
              <h1>Your Cart</h1>
            </div>
            {cart.map((c) => (
              <div key={c.id} className={Styles.cartItemContainer}>
                <img className={Styles.productImage} src={c.imageUrl[0]}></img>
                <div className={Styles.productInfoWrapper}>
                  <h1 className={Styles.productTitle}>{c.Name}</h1>
                  <p>{c.Description}</p>
                  <p>AUD ${c.Price}</p>
                </div>
                <CloseIcon
                  className={Styles.deleteIcon}
                  onClick={() => removeItem(c.cartItemId)}
                ></CloseIcon>
              </div>
            ))}
          </div>

          <div className={Styles.checkoutContainer}>
            <div className={Styles.checkoutHeaderContainer}>
              <h1>Order Summary</h1>
            </div>
            <div className={Styles.orderSummary}>
              <p className={Styles.summaryTextLeft}>
                <b>Sub-Total</b>
                <span className={Styles.summaryTextRight}>${getTotal()} </span>
              </p>
              <p className={Styles.summaryTextLeft}>
                <b>Delivery</b>
                <span className={Styles.summaryTextRight}>$10 </span>
              </p>
              <p className={Styles.summaryTextLeft}>
                <b>Total</b>
                <span className={Styles.summaryTextRight}>
                  ${getTotal() + 10}
                </span>
              </p>
            </div>

            <div className={Styles.checkoutHeaderContainer}>
              <h1>Billing Details</h1>
            </div>

            <form className={Styles.checkoutForm} onSubmit={createOrder}>
              <div className={Styles.formInputContainer}>
                <input className={Styles.firstAndLast}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                />
                <input className={Styles.firstAndLast}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                />
                <input className={Styles.streetAddress}
                  name="streetAddress"
                  type="text"
                  placeholder="Street Address"
                  required
                />
                <input name="city" type="text" placeholder="City" className={Styles.firstAndLast} />
                <input className={Styles.firstAndLast}
                  name="postCode"
                  type="number"
                  placeholder="Postcode"
                  required
                />

                <select name="state" className={Styles.FormSelects} defaultValue="NSW">
                  <option value="NSW">New South Wales</option>
                  <option value="QLD">Queensland</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="TAS">Tasmania</option>
                  <option value="WA">Western Australia</option>
                  <option value="SA">South Australia</option>
                  <option value="VIC">Victoria</option>
                  <option value="NT">Northern Territory</option>
                </select>
                <select name="country" className={Styles.FormSelects}>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className={Styles.checkoutHeaderContainer}>
                <h1>Payment Details</h1>
              </div>

              <div className={Styles.paymentDetailsContainer}>
                <input
                  name="cardNumber"
                  type="number"
                  placeholder="Card Number"
                  minLength="16"
                  className={Styles.streetAddress}
                  required
                />
                <input
                  name="expDate"
                  type="text"
                  placeholder="Expiration Date (MM/YY)"
                  pattern="[0-9]{2}/[0-9]{2}"
                  className={Styles.firstAndLast}
                  required
                />
                <input name="cvv" type="number" placeholder="CVV" maxLength="3" className={Styles.firstAndLast}
                ></input>
              </div>

              <div className={Styles.buttonContainer}>
                <button className={Styles.checkoutButton} type="submit">
                  Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className={Styles.emptyCartContainer}>
            <ShoppingCartIcon className={Styles.cartIcon}></ShoppingCartIcon>
            <p>Your cart is empty.</p>
          </div>
        </>
      )}
      {error.error && (
        <Popup
          message={error.message}
          error={error.good}
          header={error.header}
        />
      )}
    </>
  );
};

export default Cart;
