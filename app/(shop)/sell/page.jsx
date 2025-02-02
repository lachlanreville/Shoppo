"use client";
import styles from "./sell.module.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useEffect, useState } from "react";
import Navigation from "../../../components/Navigation";
import SessionHandler from "@/components/SessionHandler";
import LocalStorage from "@/app/utils/localstorage";
import Uploading from "@/components/Uploading";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import API from "app/utils/api.js";
import Popup from "@/components/Popup";

export default function CreateListing() {
  const [image, setImage] = useState([
    { key: 1, preview: "", raw: "" },
    { key: 2, preview: "", raw: "" },
    { key: 3, preview: "", raw: "" },
    { key: 4, preview: "", raw: "" },
    { key: 5, preview: "", raw: "" },
  ]);
  const [error, setError] = useState({
    error: false,
    good: true,
    header: "",
    message: "",
  });
  const [updating, setUpdating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const product_id = searchParams.get("product_id");

  const [listingData, setListingData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "Used",
    categories: "Menswear",
  });

  useEffect(() => {
    if (product_id) {
      setUpdating(true);
      let sessionId = LocalStorage.getSession(window);
      API.GetSessionProduct(product_id, sessionId)
        .then(async (c) => {
          if (c.ok) {
            setDragActive(true);
            let data = await c.json();
            let dbData = {
              title: data.product.Name,
              description: data.product.Description,
              price: data.product.Price,
              condition: data.product.productCondition,
              categories: data.product.Category,
            };
            let dbImages = image;

            for (let i = 0; i < data.product.imageUrl.length; i++) {
              if (dbImages[i].preview == "") {
                dbImages[i].preview = data.product.imageUrl[i];
              }
            }

            setImage(dbImages);
            setListingData(dbData);

            setTimeout(() => {
              setDragActive(false);
            }, 50);
          } else {
            router.push("/sell")
          }
        })
        .catch((err) => {
          setError({
            error: true,
            good: true,
            header: "There was an error!",
            message: "There seems to have been an error. Please try again!",
          });
        });
    }
  }, [product_id]);

  const handleChange = async (e) => {
    setDragActive(true);

    e.preventDefault();
    e.stopPropagation();

    if (e.target.files.length >= 1) {
      let imageHolder = image;
      for (let i2 = 0; i2 < e.target.files.length; i2++) {
        const reader = new FileReader();

        for (let i = 0; i < imageHolder.length; i++) {
          if (imageHolder[i].preview == "") {
            imageHolder[i].preview = URL.createObjectURL(e.target.files[i2]);
            await reader.readAsDataURL(e.target.files[i2]);

            reader.onload = () => {
              imageHolder[i].raw = reader.result;
            };
            break;
          } else {
            continue;
          }
        }
      }
      setImage(imageHolder);
      setTimeout(() => {
        setDragActive(false);
      }, 1000);
    }
  };

  const handleDrop = async function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let imageHolder = image;
      for (let i2 = 0; i2 < e.dataTransfer.files.length; i2++) {
        const reader = new FileReader();
        for (let i = 0; i < imageHolder.length; i++) {
          if (imageHolder[i].preview == "") {
            imageHolder[i].preview = URL.createObjectURL(
              e.dataTransfer.files[i2]
            );
            await reader.readAsDataURL(e.dataTransfer.files[i2]);

            reader.onload = () => {
              imageHolder[i].raw = reader.result;
            };
            break;
          } else {
            continue;
          }
        }
        setImage(imageHolder);
        setTimeout(() => {
          setDragActive(false);
        }, 1000);
      }
    }
  };

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeItemFromList = (keyId) => {
    setDragActive(true);
    let imageHolder = image;

    let newImages = imageHolder.filter((c) => c.key !== keyId);

    newImages.push({
      key: newImages[newImages.length - 1].key + 1,
      preview: "",
      raw: "",
    });

    setImage(newImages);

    setTimeout(() => {
      setDragActive(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let title = e.target.title.value;
    let price = e.target.price.value;
    let descrption = e.target.description.value;
    let condition = e.target.condition.value;

    let sessionId = LocalStorage.getSession(window);

    let data = {
      title: title,
      description: descrption,
      price: price,
      condition: condition,
      files: [],
      category: listingData.categories,
    };

    for (let i = 0; i < image.length; i++) {
      if (image[i].raw !== "") {
        data.files.push(image[i].raw);
      } else {
        continue;
      }
    }

    if (data.files.length < 1 && !updating) {
      setError({
        error: true,
        good: true,
        header: "There was an error!",
        message: "You have not included any Images, Please add some and try again!",
      });
      return;
    }
    if (updating) {
      data.files = image;
      data.id = product_id;
    }

    setUploading(true);
    API.SendListing(sessionId, updating, data)
      .then(async (c) => {
        if (c.ok) {
          let data = await c.json();
          if (updating) {
            router.push("/products?product_id=" + product_id);
          } else {
            router.push("/products?product_id=" + data.productId)
          }

        } else {
          let data = await c.json();

          setError({
            error: true,
            good: true,
            header: "There was an error!",
            message: data.message,
          });
          setUploading(false);
        }
      })
      .catch((err) => {
        setUploading(false);
        setError({
          error: true,
          good: true,
          header: "There was an error!",
          message: "There seems to have been an error. Please try again!",
        });
      });
  };

  const onFormUpdate = (e) => {
    let productDetails = listingData;
    productDetails[e.target.name] = e.target.value;
    setDragActive(true);
    setListingData(productDetails);
    setTimeout(() => {
      setDragActive(false);
    }, 50);
  };

  return (
    <>
      <Navigation />
      <SessionHandler />

      <div className={styles.master}>
        <div className={styles.pageHeaderContainer}>
          <h1 className={styles.pageHeader}>{updating ? "Update" : "New"} Listing</h1>
        </div>
        <h2 className={styles.photoHeader}>Photos</h2>

        <div className={styles.formContainer}>
          <input
            id="upload-button"
            type="file"
            style={{ display: "none", width: "200px", height: "200px" }}
            onChange={handleChange}
            multiple={true}
            required
          />
          <div className={styles.uploadContainer} onDragEnter={handleDrag}>
            <label htmlFor="upload-button">
              <div className={styles.uploadImage}>
                <div className={styles.iconContainer}>
                  <CameraAltIcon className={styles.uploadIcon} />
                </div>

                <p className={styles.uploadText}>Upload Image</p>
              </div>
            </label>
            {dragActive && (
              <div
                className={styles.hiddenUploadDiv}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              ></div>
            )}

            {image.map((c) => (
              <div
                key={c.key}
                className={styles.placeholderImage}
                onClick={() => removeItemFromList(c.key)}
              >
                {c.preview ? (
                  <img
                    src={c.preview}
                    className={styles.uploadedImage}
                    alt="dummy"
                    width="200"
                    height="200"
                  />
                ) : (
                  ""
                )}
                <div className={styles.overlayImage}>
                  <p>X</p>
                </div>
              </div>
            ))}
          </div>

          <form className={styles.listingForm} onSubmit={handleSubmit}>
            <div>
              <label forhtml="title">Title</label>
              <input
                type="text"
                name="title"
                placeholder="What is your Product?"
                value={listingData.title}
                onChange={onFormUpdate}
                required
              />
            </div>
            <div>
              <label forhtml="price">Price</label>
              <input
                type="number"
                name="price"
                placeholder="What is the Price?"
                value={listingData.price}
                onChange={onFormUpdate}
                required
              />
            </div>
            <div>
              <label forhtml="description">Description</label>
              <textarea
                className={styles.descriptionBox}
                rows="6"
                maxLength="250"
                type="text"
                name="description"
                placeholder="Describe your Product"
                value={listingData.description}
                onChange={onFormUpdate}
                required
              />
            </div>
            <div>
              <label forhtml="condition">Condition</label>
              <select
                name="condition"
                value={listingData.condition}
                onChange={onFormUpdate}
              >
                <option>Used</option>
                <option>New</option>
              </select>

              <label forhtml="categories">Categories</label>
              <select
                name="categories"
                value={listingData.categories}
                onChange={onFormUpdate}
              >
                <option>Menswear</option>
                <option>Womenswear</option>
                <option>Electronics</option>
                <option>Home Goods</option>
              </select>
            </div>
            <div>
              <button type="submit">{updating ? "Update" : "Create"} Listing</button>
            </div>
          </form>
        </div>
      </div>
      {uploading && (
        <Uploading message={"Please wait while your listing is " + (updating ? "Updated!" : "Created!")} />
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
}
