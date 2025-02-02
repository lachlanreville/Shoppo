"use client"
import styles from "./login.module.css";
import { useRouter } from 'next/navigation'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from "next/link"
import { useState, useEffect } from "react"
import LocalStorage from "../../utils/localstorage"
import Popup from "@/components/Popup/";
import API from "app/utils/api.js"

export default () => {
    const router = useRouter()
    const [inputType, setInputType] = useState('password');
    const [error, setError] = useState({
        error: false,
        good: true,
        header: "",
        message: ""
    })

    function onSubmit(event) {
        event.preventDefault()

        let email = event.target.email.value
        let password = event.target.password.value

        API.Login(email, password)
            .then(async c => {
                if (c.ok) {
                    let data = await c.json()
                    LocalStorage.addSession(window, data.sessionToken)
                    router.push("/")
                } else {
                    setError({
                        error: true,
                        good: true,
                        header: "Oh No!",
                        message: "You have inputted incorrect login details. Please try again!"
                    })
                }
            }).catch(err => {
                setError({
                    error: true,
                    good: true,
                    header: "Oh No!",
                    message: "There was an error. Please try again!"
                })
            })
    }

    const changePasswordVisibility = () => {
        if (inputType == "password") {
            setInputType('text');
        } else {
            setInputType('password');
        }
    }


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.header} >
                <img className={styles.loginLogo} src="/images/shoppo.png" />
            </div>
            <div className={styles.base}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.formHeader}>Login</h1>
                    <form onSubmit={onSubmit} className={styles.form}>
                        <div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="email" className={styles.formLabel}>Email</label>
                                <PersonIcon className={styles.icons} />
                                <input type="email" name="email" className={styles.formInputs} required></input>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="username" className={styles.formLabel}>Password</label>
                                <LockIcon className={styles.icons} />
                                <input type={inputType} name="password" className={styles.formInputs} required></input>
                                <VisibilityIcon className={styles.showPassword} onClick={changePasswordVisibility} />
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <input type="submit" value="Login" className={styles.loginButton} />
                            <Link href="/signup" className={styles.noAccount}>Don't have an account yet? Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className={styles.bottomSection}>

            </div>
            {error.error ? <Popup message={error.message} error={error.good} header={error.header} /> : ""}
        </div>
    )
}