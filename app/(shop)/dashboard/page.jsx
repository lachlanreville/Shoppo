"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import Styles from "./dashboard.module.css";
import Listings from "../../../components/Listings"
import Navigation from "../../../components/Navigation"
import SessionHandler from "@/components/SessionHandler";
import localstorage from "@/app/utils/localstorage";
import Uploading from "@/components/Uploading";
import Purchases from "@/components/Purchases/Purchases";
import Sales from "@/components/Sales/Sales";
import Popup from "@/components/Popup";

const UserDashboard = () => {
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [userInformation, setUserInformation] = useState({});
  const [checked, setChecked] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [page, setPage] = useState("listings");
  const [error, setError] = useState({
    error: false,
    good: true,
    header: "",
    message: ""
  })

  const [image, setImage] = useState({ raw: "", preview: "https://res.cloudinary.com/dwnr5x8un/image/upload/v1697019543/ey33dingteyyhn6w88bh.png" })

  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');

  const view = searchParams.get('view');

  const handleChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files.length >= 1) {
      let imageHolder = image;
      const reader = new FileReader();

      imageHolder.preview = URL.createObjectURL(e.target.files[0])
      await reader.readAsDataURL(e.target.files[0])

      reader.onload = () => {
        imageHolder.raw = reader.result;
      };
      setDragActive(true);
      setImage(imageHolder);
      setTimeout(() => {
        setDragActive(false)
      }, 50)
    }
  }

  useEffect(() => {
    setChecked(false)
    getProducts();
    if (view) {
      setPage(view)
    }
  }, [userId]);

  const getProducts = () => {
    if (!userId || userId == null) {
      let sessionid = localstorage.getSession(window)
      setChecked(true)
      fetch("/api/auth/session?sessionId=" + sessionid, {
        method: "get",
      })
        .then(async (c) => {
          if (c.ok) {
            let data = await c.json();
            let imageHolder = image;
            imageHolder.preview = data.user.profileImage;
            setProducts(JSON.parse(data.user.Products));
            setUserInformation(data.user);
          } else {
            console.log("incorrect login details");
          }
        })
        .catch((err) => {
          setError({
            error: true,
            good: true,
            header: "There was an error!",
            message: "There seems to have been some sort of an error. Please try again!",
          });
        });

    } else {
      fetch("/api/users/" + userId, {
        method: "get",
      })
        .then(async (c) => {
          if (c.ok) {
            let data = await c.json();
            let imageHolder = image;
            imageHolder.preview = data.user.profileImage;
            setProducts(JSON.parse(data.user.Products));
            setUserInformation(data.user);
          } else {
            setError({
              error: true,
              good: true,
              header: "There was an error!",
              message: "There seems to have been some sort of an error. Please try again!",
            });
          }
        })
        .catch((err) => {
          setError({
            error: true,
            good: true,
            header: "There was an error!",
            message: "There seems to have been some sort of an error. Please try again!",
          });
        });
    }
  }

  function EditProfile() {
    setEditMode(!editMode);
  }

  const UpdateProfile = (event) => {
    event.preventDefault();
    setUploading(true)
    let sessionid = localstorage.getSession(window)

    let username = event.target.username.value;
    let password = event.target.password.value;
    let email = event.target.email.value;

    let updates = {
      username,
      password,
      email,
      image
    }

    fetch("/api/auth/session?sessionId=" + sessionid, {
      method: "POST",
      body: JSON.stringify(updates)
    })
      .then(async (c) => {
        if (c.ok) {
          setUploading(false)
          setError({
            error: true,
            good: false,
            header: "Profile Updated",
            message: "Your profile has successfully been updated!",
          });
          setEditMode(false);
        } else {
          setUploading(false)
          setEditMode(false);

          setError({
            error: true,
            good: true,
            header: "There was an error!",
            message: "You lack the permissions to update this profile!",
          });
        }
      })
      .catch((err) => {
        setError({
          error: true,
          good: true,
          header: "There was an error!",
          message: "There seems to have been some sort of an error. Please try again!",
        });
        setUploading(false)
      });

  }

  const OnChange = (e) => {
    let userHolder = userInformation;
    userHolder[e.target.name] = e.target.value;
    setDragActive(true)
    setUserInformation(userHolder)
    setTimeout(() => {
      setDragActive(false)
    }, 50)
  }

  return (
    <>
      <Navigation />
      <SessionHandler />
      {userInformation != null ?
        <div className={Styles.UserDashboard}>
          <div className={Styles.UserInfo}></div>
          <div className={Styles.UserOverview}>
            {editMode ?
              <label htmlFor="image-input">
                <img className={Styles.UserPic} src={image.preview} style={{ cursor: 'pointer' }} />
              </label>
              :
              <img className={Styles.UserPic} src={image.preview} />
            }
            {dragActive && <div className={Styles.hiddenUploadDiv}></div>}

            <input
              id="image-input"
              type="file"
              style={{ display: "none", width: "200px", height: "200px" }}
              onChange={handleChange}
              multiple={false}
            />
            {editMode ?
              <form id="EditProfileForm" className={Styles.EditProfileForm} onSubmit={UpdateProfile}>
                <h2>Update User Info</h2>
                <div className={Styles.FormInputs}>
                  <input name="username" type="text" placeholder="Update Your Username" value={userInformation.username} onChange={OnChange}
                  ></input>
                  <input name="password" type="text" placeholder="Update Your Password" onChange={OnChange}></input>
                  <input name="email" type="email" placeholder="Update Your Email Address" value={userInformation.email} onChange={OnChange}></input>
                </div>
                <button type="submit">Save</button>
              </form>
              :
              <h1 id="userName">{userInformation.username}</h1>
            }
            {checked && <button className={Styles.EditProfileBtn} onClick={EditProfile}>Edit Profile</button>}
          </div>

          <div className={Styles.ButtonContainer}>
            {checked ? <button className={Styles.ViewButtons} onClick={() => setPage("listings")}>Your Listings</button> : <h1>{userInformation.username}'s Listings</h1>}
            {checked && <button className={Styles.ViewButtons} onClick={() => setPage("purchases")}>Your Purchases</button>}
            {checked && <button className={Styles.ViewButtons} onClick={() => setPage("sales")}>Your Sales</button>}
          </div>

          {page === "listings" && <div className={Styles.ImageList}>
            {checked === true && <h1>Your Listings</h1>}
            {products != null ? <Listings products={products} homePage={!checked} getProducts={getProducts} /> : ""}
          </div>}

          {page === "purchases" && <div className={Styles.PurchaseList}>
            <h1>Your Purchases</h1>
            {userInformation.Purchases && <Purchases purchases={userInformation.Purchases}></Purchases>}
          </div>}

          {page === "sales" && <div className={Styles.SalesList}>
            <h1>Your Sales</h1>
            {userInformation.Sales && <Sales sales={(userInformation.Sales)}></Sales>}
          </div>}

        </div>
        :
        <h1>User does not exist</h1>
      }
      {uploading ? <Uploading message="Please wait while your profile is updated!" /> : ""}
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

export default UserDashboard;