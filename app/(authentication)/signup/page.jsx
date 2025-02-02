"use client"
import styles from "./signup.module.css";
import { useRouter } from 'next/navigation'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from "next/link"
import { useState, useEffect } from "react"
import LocalStorage from "@/app/utils/localstorage"
import API from "app/utils/api.js"

export default () => {
    const router = useRouter()
    const [inputType, setInputType] = useState('password');

    async function onSubmit(event) {
        event.preventDefault()

        let email = event.target.email.value;
        let displayName = event.target.displayName.value;
        let password = event.target.password.value;

        API.SignUp(email, displayName, password)
            .then(async c => {
                if (c.ok) {
                    let data = await c.json()
                    LocalStorage.addSession(window, data.sessionToken)
                    router.push("/")
                } else {
                    console.log("incorrect login details")
                }
            }).catch(err => {
                console.log('ree')
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
            <img className={styles.signupLogo} src="/images/shoppo.png" />
        </div>
        <div className={styles.base}>
            <div className={styles.formWrapper}>
                <h1 className={styles.formHeader}>Sign Up!</h1>
                <form onSubmit={onSubmit} className={styles.form}>
                    <div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="email" className={styles.formLabel}>Email</label>
                            <PersonIcon className={styles.icons} />
                            <input type="email" name="email" className={styles.formInputs} placeholder="What is your Email?" required></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="email" className={styles.formLabel}>Display Name</label>
                            <PersonIcon className={styles.icons} />
                            <input type="text" name="displayName" placeholder="What is your Display Name?" className={styles.formInputs} required></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="username" className={styles.formLabel}>Password</label>
                            <LockIcon className={styles.icons} />
                            <input type={inputType} name="password" placeholder="Enter your Password" className={styles.formInputs} required></input>
                            <VisibilityIcon className={styles.showPassword} onClick={changePasswordVisibility} />
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <input type="submit" value="Sign Up!" className={styles.loginButton} />
                        <Link href="/login" className={styles.hasAccount}>Have an account already? Log In</Link>
                    </div>
                </form>
            </div>
        </div>

        <div className={styles.bottomSection}>

        </div>
        </div>
    )
}