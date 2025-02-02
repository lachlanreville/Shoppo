"use client";
import Navigation from "@/components/Navigation";
import SessionHandler from "@/components/SessionHandler";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

const ProductDetail = () => {
    const searchParams = useSearchParams();
    const orderNo = searchParams.get("order_no"); 
    
    return (
        <>
            <Navigation />
            <SessionHandler />
            {orderNo ?
                <div className={styles.productDetailContainer}>
                    <h1 className={styles.succesMessage}>Thank you for your purchase!</h1>
                    <p className={styles.orderNumber}>Here is your order number:
                    <Link className={styles.orderLink} href={"/dashboard?view=purchases&orderNo=" + orderNo}> #{orderNo}</Link></p>
                </div>
                : <h1 className={styles.noPurchases}>You have no current purchases.</h1>}
        </>
    );
};

export default ProductDetail;
