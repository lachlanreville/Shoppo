const Login = (email, password) => {
    return fetch('/api/auth/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
}

const SignUp = (email, displayName, password) => {
    return fetch('/api/auth/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "displayName": displayName,
            "password": password
        })
    })
}

const SendOrder = (sessionID, order) => {
    return fetch("/api/purchase?sessionId=" + sessionID, {
        method: "post",
        body: JSON.stringify(order),
    })
}

const GetSession = (sessionid) => {
    return fetch("/api/auth/session?sessionId=" + sessionid, {
        method: "get",
    })
}

const GetUser = (userId) => {
    return fetch("/api/users/" + userId, {
        method: "get",
    })
}

const SendUpdates = (sessionid, updates) => {
    return fetch("/api/auth/session?sessionId=" + sessionid, {
        method: "POST",
        body: JSON.stringify(updates),
    })
}

const GetProduct = (product_id) => {
    return fetch("/api/products/" + product_id, {
        method: "get",
    })
}

const GetProducts = () => {
    return fetch("/api/products", {
        method: "get",
    })
}

const GetSessionProduct = (product_id, sessionId) => {
    return fetch("/api/products/" + product_id + "?sessionId=" + sessionId, {
        method: "GET",
    })
}

const SendListing = (sessionId, updating, data) => {
    console.log(data)
    return fetch("/api/addListing?sessionId=" + sessionId, {
        method: !updating ? "POST" : "PUT",
        body: JSON.stringify(data),
    })
}

const GetCategory = (categoryId) => {
    return fetch("/api/products?categoryId=" + categoryId, {
        method: "get",
    })
}

const exported = {
    Login,
    SignUp,
    SendOrder,
    GetSession,
    GetUser,
    SendUpdates,
    GetProduct,
    GetProducts,
    GetSessionProduct,
    SendListing,
    GetCategory
};

export default exported;
