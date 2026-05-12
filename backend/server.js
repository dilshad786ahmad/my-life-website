require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongodbConnect = require("./Database/db");
const cookieParser = require('cookie-parser');

const app = express();

// ✅ Middlewares
// app.use(cors());
app.use(cors({
    origin: ['http://localhost:5173', 'https://my-life-website-cjdr.vercel.app'], // Aapke frontend ka exact URL
    credentials: true,               // Cookies allow karne ke liye zaroori hai
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Ye line routes se upar honi chahiye
app.use("/uploads", express.static("uploads"));

// ✅ Routes import
const authRoutes = require("./routes/authRoutes.js");

// ✅Authetications Routes use
app.use("/api/auth", authRoutes);

// ✅Forgot Password Routes
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes.js");
app.use("/api/forgot-password", forgotPasswordRoutes);

// ✅Contact Routes (Forms and Leads)
const contactRouts = require("./routes/conactRouts"); 
app.use("/api/contact", contactRouts); 

// ✅Contact Page Content Routes (Headings, Cards, Info)
const contactPageRoutes = require('./routes/contactPageRoutes');
app.use("/api/contactpage", contactPageRoutes);    

// ✅Pricing Page Content Routes
const pricingPageRoutes = require('./routes/pricingPageRoutes');
app.use("/api/pricingpage", pricingPageRoutes);

// ✅Dynamic Pages Routes (Get Started, Learn More)
const dynamicPageRoutes = require('./routes/dynamicPageRoutes');
app.use("/api/pages", dynamicPageRoutes);

// ✅About Page Content Routes
const aboutPageRoutes = require('./routes/aboutPageRoutes');
app.use("/api/aboutpage", aboutPageRoutes);

// ✅Home Page Content Routes
const homePageRoutes = require('./routes/homePageRoutes');
app.use("/api/homepage", homePageRoutes);

// ✅Services Page Content Routes
const servicesPageRoutes = require('./routes/servicesPageRoutes');
app.use("/api/servicespage", servicesPageRoutes);

// ✅Skills Page Content Routes
const skillsPageRoutes = require('./routes/skillsPageRoutes');
app.use("/api/skillspage", skillsPageRoutes);

// ✅Projects Page Content Routes
const projectsPageRoutes = require('./routes/projectsPageRoutes');
app.use("/api/projectspage", projectsPageRoutes);

// ✅Project Specific Details Routes
const projectDetailsRoutes = require('./routes/projectDetailsRoutes');
app.use("/api/projectdetails", projectDetailsRoutes);

// ✅Team Member Routes
const teamRoutes = require('./routes/teamRoutes');
app.use("/api/team", teamRoutes);

// ✅Service Specific Details Routes
const serviceDetailsRoutes = require('./routes/serviceDetailsRoutes');
app.use("/api/servicedetails", serviceDetailsRoutes);


// admin get users router

const adminGetUser=require("./routes/AuthUserAdmin.js")
app.use("/api/admin", adminGetUser);

// ✅Client Feedback Routes
const clientFeedbackRoutes = require('./routes/clientFeedbackRoutes');
app.use("/api/feedback", clientFeedbackRoutes);



// Port
const PORT = process.env.PORT || 5000;

// ✅ Better server start (DB ke baad)
const startServer = async () => {
  try {
    await mongodbConnect();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
  
    console.log("Server crashed:", error);
  }
};

startServer();