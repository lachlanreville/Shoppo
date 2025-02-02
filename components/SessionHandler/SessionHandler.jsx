"use client"
import { useRouter } from "next/navigation"
import LocalStorage from "../../app/utils/localstorage"
import { useEffect, useState } from "react"

export default () => {
    const [checked, setChecked] = useState(false);
    const router = useRouter()

    useEffect(() => {
        let sessionId = LocalStorage.getSession(window)
        if (!checked) {
            setChecked(true)
            if (!sessionId) {
                router.replace("/login", "push")
            } else {
                fetch("/api/auth/session?sessionId=" + sessionId, {
                    method: "get"
                }).then(c => {
                    if (c.ok) {
                        // do nothing
                    } else {
                        LocalStorage.clearSession(window)

                        router.replace("/login", "force")
                    }
                }).catch(err => {
                    console.error(err)
                })
            }
        }
    }, [])
}