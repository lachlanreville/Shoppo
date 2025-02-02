

const getCart = async (window) => {
    return window.localStorage.getItem('cart') == null ? [] : JSON.parse(window.localStorage.getItem('cart'))
}

const addToCart = async (window, item) => {
    let cart = await getCart(window);

    if (cart.length > 0) {
        item.cartItemId = cart[cart.length - 1].cartItemId + 1;
    } else {
        item.cartItemId = 1;
    }

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == item.id) {
            return;
        }
    }
    cart.push(item)

    window.localStorage.setItem("cart", JSON.stringify(cart))

    return;
}

const removeFromCart = async (window, cartItemId) => {
    let cart = await getCart(window);

    let newCart = cart.filter(c => c.cartItemId !== cartItemId)


    window.localStorage.setItem("cart", JSON.stringify(newCart))
    return;
}


const updateCart = async (window, item) => {
    let cart = await getCart(window);

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].cartItemId === item.cartItemId) {
            cart[i].quantity = item.quantity;
        }
    }
    window.localStorage.setItem("cart", JSON.stringify(cart))

}

const clearCart = async (window) => {

    window.localStorage.removeItem("cart")
    return [];
}

const addSession = (window, session) => {

    window.localStorage.setItem("session", session)
    return session;
}


const clearSession = (window) => {
    window.localStorage.removeItem("session")
    return "";
}

const getSession = (window) => {

    return window.localStorage.getItem('session') == null ? null : window.localStorage.getItem('session')
}



const exported = {
    getCart,
    addToCart,
    clearCart,
    addSession,
    getSession,
    updateCart,
    removeFromCart,
    clearSession
}

export default exported