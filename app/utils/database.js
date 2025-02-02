const randomString = require("randomstring");
const { con } = require("./connection.js")
const crypto = require('crypto')

const login = async (email, password) => {
    password = crypto.createHash('md5').update(password).digest("hex")

    let data = await con.awaitQuery('SELECT id FROM Users WHERE Email = ? and Password = ?', [email, password])

    if (data.length >= 1) {
        let userId = data[0].id
        let random = randomString.generate(24);

        let createSession = await insertSession(random, userId)

        return { 'status': true, sessionToken: random }
    } else {
        return { 'status': false }

    }
}

const insertSession = async (sessionId, userId) => {
    let data = await con.awaitQuery("SELECT id FROM sessions WHERE userId = ?", [userId])

    if (data.length >= 1) {
        let newData = await con.awaitQuery("UPDATE sessions SET sessionId = ? WHERE userId = ?", [sessionId, userId])

        if (newData.changedRows >= 1) {
            return true
        } else {
            return false;
        }
    } else {
        await con.awaitQuery("INSERT INTO sessions(userId, sessionId) VALUES(?, ?)", [userId, sessionId])

        return true;
    }
}

const checkUserExists = async (email) => {
    let data = await con.awaitQuery('SELECT id FROM Users WHERE Email = ?', [email])

    if (data.length >= 1) {
        return true;
    } else {
        return false;
    }

}

const signup = async (email, displayName, password) => {
    password = crypto.createHash('md5').update(password).digest("hex")
    if (await checkUserExists(email)) {
        return { success: false }
    } else {
        let newData = await con.awaitQuery("INSERT INTO Users(Email, Username, Password) VALUES(?, ?, ?)", [email, displayName, password])

        let userId = newData.insertId;
        let random = randomString.generate(24);

        await insertSession(random, userId)

        return { 'status': true, sessionToken: random }
    }
}

const getAllProducts = async () => {
    let newData = await con.awaitQuery("SELECT id, Name, Price, Description, imageUrl, Category, productCondition FROM Listings WHERE sold = 0");

    if (newData.length >= 1) {
        for (let i = 0; i < newData.length; i++) {
            newData[i].imageUrl = JSON.parse(newData[i].imageUrl)
        }
        return { status: true, products: newData }
    } else {
        return { status: false }
    }
}

const getProductsByCategory = async (category) => {
    let newData = await con.awaitQuery(`SELECT UUID() AS id, l.Category, JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'Name', l.Name, "Price", l.Price, "Description", l.Description, "imageUrl", l.imageUrl, "productCondition", l.productCondition)) AS Products  
    FROM Listings AS l
    WHERE sold = 0 AND l.Category = ?
    GROUP BY l.Category`, [category]);
    if (newData.length >= 1) {
        for (let i = 0; i < newData.length; i++) {
            newData[i].Products = JSON.parse(newData[i].Products)
        }
        return { status: true, products: newData[0] }
    } else {
        return { status: false }
    }
}


const getProduct = async (productName) => {
    let newData = await con.awaitQuery(`SELECT l.id, l.Name, l.Price, l.Description, l.imageUrl, l.Category, l.productCondition, u.profileImage, u.Username, l.userId FROM Listings AS l,
    Users AS u 
    WHERE l.id = ? AND sold = 0 AND l.userId = u.id`, [productName]);

    if (newData.length >= 1) {
        for (let i = 0; i < newData.length; i++) {
            newData[i].imageUrl = JSON.parse(newData[i].imageUrl)
        }

        return { status: true, product: newData[0] }
    } else {
        return { status: false }
    }
}

const getUser = async (userId) => {
    let newData = await con.awaitQuery(`SELECT u.email, u.username, u.profileImage, 
    JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'Name', l.Name, "Price", l.Price, "Description", l.Description, "imageUrl", l.imageUrl, "Category", l.Category, "productCondition", l.productCondition)) AS Products 
    FROM Users AS u, Listings AS l WHERE u.id = ? AND l.userId = u.id AND l.sold = 0`, [userId])

    if (newData.length >= 1) {
        return { status: true, user: newData[0] }
    } else {
        return { status: false }
    }
}

const getAllCategories = () => {
    if (categories.length >= 1) {
        return { status: true, categories }
    } else {
        return { status: false }
    }
}

const addNewProduct = async (title, price, description, condition, images, sessionId, category) => {
    let sessionInfo = await getSessionData(sessionId)
    if (sessionInfo.status) {
        let newData;
        try {
            newData = await con.awaitQuery("INSERT INTO Listings(Name, Price, Description, imageUrl, productCondition, userId, Category) VALUES(?, ?, ?, ?, ?, ?, ?)", [title, price, description, JSON.stringify(images), condition, sessionInfo.user.id, category])
        }
        catch (err) {
            return { status: false }
        }
        return { status: true, productId: newData.insertId }
    } else {
        return { status: false }
    }
}

const getSessionData = async (sessionId) => {
    let data = await con.awaitQuery(`SELECT s.userId as id, u.email, u.username, u.profileImage, 
    CASE 
        WHEN COUNT(l.id) > 0
        THEN JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'Name', l.Name, "Price", l.Price, "Description", l.Description, "imageUrl", l.imageUrl, "Category", l.Category, "productCondition", l.productCondition))
        ELSE '[]'
    END AS Products
FROM sessions AS s
JOIN Users AS u ON u.id = s.userId
LEFT JOIN Listings AS l ON l.userId = s.userId AND l.sold = 0 
WHERE s.sessionId = ?
GROUP BY s.userId, u.email, u.username;`, [sessionId])
    if (data.length >= 1) {
        if (data[0].id == null) {
            return { status: false }
        }
        let purchaseData = await getPurchases(data[0].id)

        let saleData = await getSoldProducts(data[0].id)

        data[0].Sales = saleData;

        data[0].Purchases = purchaseData;


        return { status: true, user: data[0] }
    } else {
        return { status: false }
    }
}

const checkIfHasPermission = async (sessionId, productId) => {
    let newData = await con.awaitQuery(`SELECT l.userId FROM Listings AS l, sessions AS s WHERE s.sessionId = ? AND l.userId = s.userId AND l.id = ?`, [sessionId, productId])
    if (newData.length >= 1) {
        return true;
    } else {
        return false;
    }
}

const deleteProduct = async (productId, sessionId) => {
    if (await checkIfHasPermission(sessionId, productId)) {

        let newData = await con.awaitQuery("DELETE FROM Listings WHERE id = ?", [productId])

        if (newData.affectedRows >= 1) {
            return { status: true }
        } else {
            return { status: false }
        }
    } else {
        return { status: false }
    }
}

const updateListing = async (sessionId, productId, title, price, description, condition, images, category) => {
    if (await checkIfHasPermission(sessionId, productId)) {
        let newData;
        try {
            newData = await con.awaitQuery("UPDATE Listings SET Name = ?, Price = ?, Description = ?, imageUrl= ?, productCondition= ?, Category = ? WHERE id = ?", [title, price, description, JSON.stringify(images), condition, category, productId])
        }
        catch (err) {
            return { status: false }
        }

        if (newData.affectedRows >= 1) {
            return { status: true }
        } else {
            return { status: false }
        }
    } else {
        return { status: false }
    }
}

const getPurchases = async (userId) => {
    let saleData = await con.awaitQuery(`SELECT UUID() AS id, s.BuyerId, s.ProductId, s.SaleDate, s.Total, s.streetAddress, s.postCode, s.firstName, s.lastName, s.country, s.last4Digits, s.expDate ,
    JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'Name', l.Name, "Price", l.Price, "Description", l.Description, "imageUrl", l.imageUrl, "Category", l.Category, "productCondition", l.productCondition)) AS Products
    FROM Sales AS s 
    LEFT JOIN Listings AS l ON FIND_IN_SET(l.id, s.ProductId) > 0
    WHERE s.BuyerId = ?
    GROUP BY s.BuyerId, s.SaleDate, s.Total, s.streetAddress, s.postCode, s.firstName, s.lastName, s.country, s.last4Digits, s.expDate
`, [userId])

    if (saleData.length >= 1) {
        return saleData;
    } else {
        return [];
    }
}


const getSoldProducts = async (userId) => {
    let purchaseData = await con.awaitQuery(`SELECT l.id, l.Name, l.Price, l.Description, l.imageUrl, l.Category, l.productCondition, s.BuyerId, s.SaleDate, s.Total, s.streetAddress, s.postCode, s.firstName, s.lastName, s.country
    FROM Sales AS s, Listings AS l
    WHERE l.userId = ? AND sold = 1 AND s.id = l.saleId
    GROUP BY l.id, l.Name, l.price, s.SaleDate, s.firstName, s.lastName, s.streetAddress, s.postCode`, [userId])

    if (purchaseData.length >= 1) {
        return purchaseData;
    } else {
        return [];
    }
}

const updateUser = async (sessionId, data = {}) => {
    if (data.image == "") data.image = "https://res.cloudinary.com/dwnr5x8un/image/upload/v1697019543/ey33dingteyyhn6w88bh.png"
    if (data.password !== "") {
        let password = crypto.createHash('md5').update(data.password).digest("hex")

        let newData = await con.awaitQuery(`UPDATE Users AS u
JOIN sessions AS s ON u.id = s.userId
 SET u.Email = ?, u.Username = ?, u.profileImage = ?, u.password = ?
 WHERE s.sessionId = ?`, [data.email, data.username, data.image, password, sessionId])

        if (newData.affectedRows >= 1) {
            return { status: true }
        } else {
            return { status: false }
        }
    } else {
        let newData = await con.awaitQuery(`UPDATE Users AS u
JOIN sessions AS s ON u.id = s.userId
 SET u.Email = ?, u.Username = ?, u.profileImage = ? 
 WHERE s.sessionId = ?`, [data.email, data.username, data.image, sessionId])

        if (newData.affectedRows >= 1) {
            return { status: true }
        } else {
            return { status: false }
        }
    }
}

const addPurchase = async (data = {}, sessionId) => {
    let sessionData = await getSessionData(sessionId);

    let cart = data.cartItems.map(c => c.id)

    let newData = await con.awaitQuery(`INSERT INTO 
    Sales(BuyerId, ProductId, SaleDate, Total, streetAddress, postCode, state, firstName, lastName, country, last4digits, expDate) 
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [sessionData.user.id, cart.join(","), new Date(), data.total, data.streetAddress, data.postCode, data.state, data.firstName, data.lastName, data.country, data.cardNumber.substr(data.cardNumber.length - 4), data.expDate])


    if (newData.affectedRows >= 1) {
        let newSql = await con.awaitQuery('UPDATE Listings SET sold = 1, saleId = ? WHERE id IN (?) ', [newData.insertId, cart])

        if (newSql.affectedRows >= 1) {
            return { status: true, orderNumber: newData.insertId }
        } else {
            return { status: false }
        }

    } else {
        return { status: false }
    }
}

const exported = {
    login,
    getAllProducts,
    getProduct,
    getUser,
    getAllCategories,
    signup,
    addNewProduct,
    getSessionData,
    deleteProduct,
    addPurchase,
    updateUser,
    getProductsByCategory,
    updateListing
}

export default exported;