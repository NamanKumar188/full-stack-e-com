const express = require("express");
const router = new express.Router();
const products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate = require("../middleware/authenticate");

// router.get("/",(req,res)=>{
//     res.send("this is testing routes");
// });


// get the products data

router.get("/getproducts", async (req, res) => {
    try {
        const producstdata = await products.find();
        res.status(201).json(producstdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});


// register the data
router.post("/register", async (req, res) => {
    // console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "fill the all details" });
        console.log("bhai nathi present badhi details");
    };

    try {

        const preuser = await User.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This email is already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password are not matching" });;
        } else {

            const finaluser = new User({
                fname, email, mobile, password, cpassword
            });

            // yaha pe hashing krenge

            const storedata = await finaluser.save();
            // console.log(storedata + "user successfully added");
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("error : in catch for registration time" + error.message);
        res.status(422).send(error);
    }

});



// login data
router.post("/login", async (req, res) => {
    console.log("Request body:", req.body); 

    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Incomplete details:", { email, password }); 
        return res.status(400).json({ error: "fill the details" });
    }
    
    try {
        const userlogin = await User.findOne({ email: email });
        console.log("User found:", userlogin);
        console.log(process.env.KEY);
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            console.log("Password match:", isMatch); 
        
            if (!isMatch) {
                console.log("Invalid credentials"); 
                return res.status(400).json({ error: "invalid credential pass" });
            } else {
                const token = await userlogin.generatAuthtoken();
                console.log("Generated token:", token); 
                   
                res.cookie("eccomerce", token, {
                    expires: new Date(Date.now() + 2589000), // Cookie expires after 30 days
                    httpOnly: false, // Allows client-side JavaScript to access the cookie
                    secure: false, // Cookie can be sent over HTTP or HTTPS
                    sameSite: 'lax' // Allows cookie to be sent with same-site requests and some cross-site requests
                });
                console.log("cookies start here :",res.cookie(),"cookies ended");
                return res.status(201).json(userlogin);
            }
        } else {
            console.log("User does not exist"); 
            return res.status(400).json({ error: "user not exist" });
        }
    } catch (error) {
        console.log("Error in catch block:", error.message);
        return res.status(400).json({ error: "invalid credential pass" });
    }
});

// getindividual

router.get("/getproductsone/:id", async (req, res) => {

    try {
        const { id } = req.params;
        // console.log(id);

        const individual = await products.findOne({ id: id });
        // console.log(individual + "ind mila hai");

        res.status(201).json(individual);
    } catch (error) {
        res.status(400).json(error);
    }
});


// adding the data into cart
router.post("/addcart/:id", authenicate, async (req, res) => {

    try {
        // console.log("perfect 6");
        const { id } = req.params;
        const cart = await products.findOne({ id: id });
        // console.log(cart + "cart milta hain");

        const Usercontact = await User.findOne({ _id: req.userID });
        // console.log(Usercontact + "user milta hain");


        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            console.log(cartData + " thse save wait kr");
            console.log(Usercontact + "userjode save");
            res.status(201).json(Usercontact);
        }
    } catch (error) {
        console.log(error);
    }
});


// get data into the cart
router.get("/cartdetails", authenicate, async (req, res) => {
    try {
        const buyuser = await User.findOne({ _id: req.userID });
        console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }
});



// get user is login or not
router.get("/validuser", authenicate, async (req, res) => { 
    try {
        const validuserone = await User.findOne({ _id: req.userID });
        console.log(validuserone + "user hain home k header main pr");
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});

// for userlogout

router.get("/logout", authenicate,async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("eccomerce", { path: "/" });
        if (req.rootUser) {
            await req.rootUser.save();
        } else {
            return res.status(400).json({ error: "No user found to log out" });
        }
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});



// item remove ho rhi hain lekin api delete use krna batter hoga
// remove iteam from the cart

router.get("/remove/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");

    } catch (error) {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});


module.exports = router;