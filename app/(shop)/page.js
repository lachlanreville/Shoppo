"use client"
import Styles from "./page.module.css";
import { useState, useEffect } from "react";
import Listings from "../../components/Listings"
import Navigation from "../../components/Navigation"
import SessionHandler from "@/components/SessionHandler";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import HomeIcon from '@mui/icons-material/Home';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import Popup from "@/components/Popup/"
import API from "app/utils/api.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [category, setCategory] = useState("")

  useEffect(() => {
    getProducts("")
  }, []);

  const getProducts = (categoryId) => {
    if (categoryId !== "") {
      API.GetCategory(categoryId)
        .then(async (c) => {
          if (c.ok) {

            let data = await c.json();
            setProducts(data.products);
            setFiltered(true)

          } else {
            console.log("incorrect login details");
          }
        })
        .catch((err) => {
          console.log("ree");
        });
    } else {
      API.GetProducts()
        .then(async (c) => {
          if (c.ok) {

            let data = await c.json();
            setProducts(data.products);
            setFiltered(false)
          } else {
            console.log("incorrect login details");
          }
        })
        .catch((err) => {
          console.log("ree");
        });
    }
  }

  const getCategory = (category) => {
    setCategory(category)
    getProducts(category)
  }

  return (
    <>
      <Navigation />
      <SessionHandler />
      <div className={Styles.contentWrapper}>
        <div className={Styles.sideNavContainer}>
        <nav className={Styles.sideNav}>
          <div className={Styles.buttonContainer}>
            <ul>
              <li>
                <button onClick={() => getCategory("Menswear")}><ManIcon className={Styles.manIcon}/>Menswear</button>
              </li>
              <li>
                <button onClick={() => getCategory("Womenswear")}><WomanIcon className={Styles.womanIcon}/>Womenswear</button>
              </li>
              <li>
                <button onClick={() => getCategory("Electronics")}><SportsEsportsIcon className={Styles.electronicsIcon}/>Electronics</button>
              </li>
              <li>
                <button onClick={() => getCategory("Home Goods")}><HomeIcon className={Styles.homegoodsIcon}/>Home Goods</button>
              </li>
            </ul>
          </div>

          <div className={Styles.contactInfo}>
            <h3>Contact Support</h3>
            <p>Email: support@shoppo.com</p>
            <p>Phone: (+61) 1300 SHOPPO</p>
          </div>
        </nav>
        </div>

        <div className={Styles.homeContent}>
          <img src="images/banner.png" className={Styles.bannerImage}></img>
          <div className={Styles.headerWrapper}>
            {category !== "" ? <h2>{category}</h2> : <h2>Products</h2>}
            {filtered && <button onClick={() => getCategory("")}>Back</button>}
          </div>
          {filtered ?
            <Listings products={products.Products} homePage={true} /> :
            <Listings products={products} homePage={true} />
          }
        </div>
      </div>
    </>
  );
}