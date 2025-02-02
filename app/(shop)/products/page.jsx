"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Styles from "./ViewListing.module.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import localStorage from "@/app/utils/localstorage";
import Navigation from "@/components/Navigation";
import SessionHandler from "@/components/SessionHandler";
import Popup from "@/components/Popup/";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [error, setError] = useState({
    error: false,
    good: true,
    header: "",
    message: "",
  });
  const [images, setImages] = useState()
  const router = useRouter();
  const searchParams = useSearchParams();
  const product_id = searchParams.get("product_id");

  useEffect(() => {
    if (!product_id) return;
    fetch("/api/products/" + product_id, {
      method: "get",
    })
      .then(async (c) => {
        if (c.ok) {
          let data = await c.json();
          console.log(data)
          let newImages = [];

          for (let i = 0; i < data.product.imageUrl.length; i++) {
            newImages.push({
              original: data.product.imageUrl[i],
              thumbnail: data.product.imageUrl[i],
              originalHeight: 500
            })
          }

          setImages(newImages)

          setProduct(data.product);
        } else {
          router.push("/")
        }
      })
      .catch((err) => {
        router.push("/")
      });
  }, [product_id]);

  const addToCart = (product) => {
    localStorage.addToCart(window, product);

    setError({
      error: true,
      good: false,
      header: "Added to Cart!",
      message: "This item has successfully been added to your cart!",
    });
  };


  return (
    <>
      <Navigation />
      <SessionHandler />
      <div className={Styles.ViewListing}>
        {product !== undefined ?
          <div className={Styles.ProductContainer}>
            <div className={Styles.ImageContainer}>
              <div className={Styles.GalleryContainer}>
                <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} />
              </div>
            </div>
            <div className={Styles.DetailsContainer}>
              <h1 className={Styles.ViewListingTitle}>{product.Name}</h1>
              <p className={Styles.ViewListingPrice}>AUD ${product.Price}</p>
              <p className={Styles.ViewListingCondition}>
                {" "}
                Condition: {product.productCondition}
              </p>
              <Link
                className={Styles.ProfileLink}
                href={`/dashboard?user_id=${product.userId}`}
              >
                <div className={Styles.SellerInfo}>
                  <img
                    src={product.profileImage}
                    alt="Profile Image"
                    className={Styles.ProfileImage}
                  />
                  <p>Listed by {product.Username}</p>
                </div>
              </Link>
              <div className={Styles.ViewListingButton}>
                <button onClick={() => addToCart(product)}>Add To Cart</button>
              </div>

              <div>
                <p className={Styles.ViewListingDescriptionTitle}>
                  Description:{" "}
                </p>
                <p className={Styles.ViewListingDescription}>
                  {product.Description}
                </p>
              </div>
            </div>
          </div>
          :
          <h1 className={Styles.loadingProduct}>Loading Product ...</h1>

        }
      </div>
      {error.error ? (
        <Popup
          message={error.message}
          error={error.good}
          header={error.header}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default ProductDetail;