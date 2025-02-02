# SHOPPO 

## Outline

SHOPPO is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The main purpose of ‘Shoppo’ is to create an online marketplace platform where users can list items for sale and purchase items from other users, much like the popular ‘Depop’ application. It serves as a virtual marketplace for various products, including fashion, vintage, handmade
crafts, and collectibles.

**Target user group and usage:**
* **Individual Sellers**: Users who want to sell a wide range of items, including clothing,
accessories, vintage goods, handmade products, and unique collectibles. They can
create listings, upload product images, set prices, and manage their online storefronts.
* **Buyers**: Individuals interested in shopping for diverse items, from fashion to
one-of-a-kind collectibles. They can browse listings, add items to their shopping carts,
and securely make purchases.
* **Fashion Enthusiasts**: Users looking for unique and stylish fashion items, including
clothing, shoes, and accessories. They can follow sellers and receive updates on new
listings

**Features and Functionalities:**

The web application will provide a range of features to enhance the user experience. The
proposed features included:
* **User Registration and Profile Management**:Users can create accounts, manage
profiles, and personalise their online presence.
* **Listing Creation**: Sellers can easily create product listings with detailed descriptions,
images, pricing, and categorisation.
* **Search and Discovery**: Users can search for items, apply filters, and explore
personalised recommendations.
* **Messaging and Communication**: Buyers and sellers can communicate through an
in-app messaging system to discuss product details and transactions.
* **User Ratings and Reviews**: Users can leave feedback and ratings, establishing trust
and reputation within the marketplace.
* **Inventory Management**: Sellers can manage their product listings, track sales, and
update inventory availability
* **Notifications**:The application will offer notifications for messages, order updates, and
other relevant activities.
* **Secure Payment Processing**:The application will support secure online payments,
including credit/debit cards, digital wallets, and other payment methods.

**Data Sources:**

The application will rely on various data sources to support its functionality:
1. User Profiles: User-generated data, including names, contact information, profile
pictures, and user preferences.
2. Product Listings: Information about the items available for sale, such as titles,
descriptions, images, pricing, and seller details.
3. User Interactions: Records of user actions, including messages, reviews, likes, and
purchase history.
4. Payment Data: Secure processing of payment information, typically handled through
third-party payment gateways.
5. Search and Recommendation Data: Information related to search queries, filters, and
user preferences for personalised recommendations.
6. Messaging and Notifications: Data related to user communications and
system-generated notifications.
7. Shipping and Order Management: Details about order processing, shipping tracking,
and delivery status.
8. Ratings and Reviews: Feedback and ratings provided by users to establish trust within
the marketplace.
9. Security Data: Information related to user authentication, authorization, and security
protocols.

## Implementations / Milestones


In our MVP (Minimum Viable Product) for the 'Shoppo' web application, we have successfully implemented a range of features and functionalities to create a fully functional marketplace similar to Depop. Here are the key milestones and achievements of our project:

1. **User Authentication/Signup:**
   - Users can sign up with their email and create an account.
   - Error messages are displayed when incorrect email addresses are input.

2. **Login System:**
   - Users can log in with their credentials.
   - Incorrect password input triggers error messages.
   - Option to hide/unhide the password while typing for security.

3. **Products Page/Home Page:**
   - Users can view a list of the products for sale.

4. **Home Page Filtering:**
   - Implemented a filter system for the home page to help users find products easily.

5. **Product Listing Pages:**
   - Users can browse product listings, with product details such as price, condition, who listed it, iamges of the item, and a description of the item.

6. **Add to Cart:**
   -  Added a pop-up notification when a product is successfully added to the cart.

7. **Billing Information:**
   - Users can input billing information for their purchases.

8. **Payment Details:**
   - Implemented a feature to check for incorrect credit card information, showing an error pop-up when needed.

9. **Order Success Page:**
   - Created a confirmation page for successful orders, ensuring a smooth user experience.

10. **User Dashboard:**
    - Designed a dashboard that displays essential information, including:
      - Your Listings: Allows users to manage their product listings, including deletion and editing.
      - Your Purchases: Displays information about purchases made.
      - Your Sales: Shows data on items sold.

11. **Sell Page:**
    - Users can upload images via File explorer or via drag and drop
    - Provided an option to delete images from the listing.
    - Ability to input title, price, description, choose condition, and category. 

12. **Edit Profile:**
    - Users can edit their profile name, password, email, and profile picture.
    - A pop-up notification confirms that the profile has been updated.

Our MVP 'Shoppo' web application successfully encompasses the functionalities of a real marketplace platform. This prototype is a solid foundation for further development and expansion.

## Source Code Guide

1. **API Routes (/app/api):**
   - If you're looking for the API routes, navigate to the '/app/api' directory.
   - Each API route has its own folder, and within each folder, you'll find a 'route.js' file, which serves as the handler for that specific API route. This is where the logic for processing API requests is implemented.

2. **Components (/components):**
   - The '/components' directory houses all the components used throughout the application.
   - Each component has its own folder within this directory, and typically, the '.js' file with the same name as the component represents the code for that specific component.

3. **Application (/app):**
   - The '/app' directory contains the entire application, and it's where you'll find various sections of the app.
   - For example, 'Shop' represents the shop section of the application, and each page within the shop section typically has its own folder.

4. **Utilities (/app/utils):**
   - The '/app/utils' directory encompasses all the utilities and helper functions used in the application.
   - This includes functions for connecting to the database, executing database queries, making API calls, and handling local storage operations.

5. **Authentication (/Authentication):**
   - The '/Authentication' directory is dedicated to the login/signup section of the application.
   - You can find the code related to user authentication and authorization in this section.

6. **Individual Pages (/app/{section}/{page}):**
   - Each individual page of the application is organized within its respective section's folder. For instance, if you want to access the 'cart' page on the site, you can navigate to '/app/(shop)/cart.'
   - Additionally, each page may include its own CSS module within its folder.

7. **Page-Specific Code (page.jsx):**
   - Inside each page's folder, you'll typically find a 'page.jsx' file. This file contains the code for the specific page, including its layout, behavior, and interactions.

## Next steps

If we were to continue developing the 'Shoppo' web application beyond the MVP (Minimum Viable Product), our next steps would involve further enhancing the platform's features, user experience, and scalability. Here's a summary of the key next steps:

1. **Enhanced User Profiles:**
   - Develop a more comprehensive user profile system, allowing users to add more details about themselves, such as location, bio, and social media links.

2. **Messaging System:**
   - Implement a messaging feature that enables users to communicate with each other to discuss product details, negotiate prices, and arrange transactions securely.

3. **Search and Recommendation Algorithms:**
   - Enhance the product discovery experience by incorporating advanced search and recommendation algorithms to suggest relevant products to users based on their preferences and behavior.

4. **Reviews and Ratings:**
   - Enable users to leave reviews and ratings for products and sellers, fostering trust and transparency within the community.

5. **Payment Integration:**
   - Integrate a secure payment gateway, allowing users to make payments directly on the platform, while ensuring secure financial transactions and handling of disputes.

6. **User Notifications:**
   - Develop a notification system to keep users informed about new messages, order updates, and interactions on the platform.

7. **Seller Verification:**
   - Implement a seller verification process to establish trust and authenticity. This might include identity verification and badges for trusted sellers.

8. **Mobile App Development:**
   - Extend the 'Shoppo' experience to mobile devices by creating dedicated iOS and Android applications, reaching a broader user base.

9. **Scalability and Performance:**
    - Optimize the platform's infrastructure to ensure it can handle increasing user loads and maintain a responsive user experience.

10. **Security Enhancements:**
    - Continue strengthening security measures to protect user data and transactions, staying updated on the latest security threats and best practices.

11. **Monetization Strategies:**
    - Explore various monetization options, such as subscription models, advertisements, or transaction fees, to sustain and grow the platform.

These next steps reflect a strategic roadmap for the continued development of 'Shoppo' beyond the MVP that wil create a thriving online marketplace that offers an exceptional user experience, fosters trust, and provides value to both buyers and sellers.

## Roles / Contributions of members

| Member       | Roles/Contributions | 
| ------------ |:-------------:      | 
| Adrian       | Initial User Dashboard design, Contribution towards decisions relating to design, Testing post-deployment (looking for bugs, glitches), Documentation (README.md, DEPLOYMENT.md, SCREENSHOTS folder)| 
| Lachlan      | Team Leader/Project Manager. System Administrator. Deployment on VPS. Setup Database Instance. Created All API Routes Including Add Listing, Edit Listing, Edit User, etc... Made Login/Signup Pages and Functionality, Added Image Functionality on Dashboard and Sell Pages. User Sessions. Styling on Cart, Dashboard, View Listing, Sell.  |  
| Nicholas     | Wireframes, Mockups, Cart/Sell/Edit Profile pages, NavBar, SideBar, Listings/Purchases/Sales Views, User Info Box on View Listing Page, Error Popup Component  |  
| Reyzhel      | Created Individual Listings Page and Initial Styling. Overall Design for Navigation System, Login/Signup Styling (Background), Home Page Styling, Added all Products, Edited Database Information such as Usernames, Emails, Passwords, Products. Final Sidebar Styling on Home. Created the Logo and added on Pages.  |  

### Interaction/Communication

The team primarily utilised the platform 'Discord' for most, if not all collaboration and interactions. It was our first choice for communcation due to its seamless capabilities to message, and voice/video call members, as well as each member having the software prior to the decisions of which platform to use. 

The team also made use of the Github Project board to manage our tasks, as well as Git for collaborating during development stages. 
