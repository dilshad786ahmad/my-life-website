require('dotenv').config();
const mongoose = require('mongoose');

const AboutPageContent = require('./schema/aboutPageContent');
const ProjectDetails = require('./schema/projectDetailsSchema');
const TeamMember = require('./schema/teamMemberSchema');
const HomePageContent = require('./schema/homePageContent');

const DB_URI = process.env.MONGODB_URI;

async function fixDb() {
  if (!DB_URI) {
    console.log("No database URI found in .env");
    return;
  }
  await mongoose.connect(DB_URI);
  console.log("Connected to DB, updating URLs...");

  const replaceUrl = (str) => {
    if (typeof str === 'string' && str.includes('http://localhost:5000')) {
      return str.replace(/http:\/\/localhost:5000/g, 'https://my-life-website.onrender.com');
    }
    return str;
  };

  // Team
  const team = await TeamMember.find();
  for (let member of team) {
    let changed = false;
    if (member.image && member.image.includes('http://localhost:5000')) {
      member.image = replaceUrl(member.image);
      changed = true;
    }
    if (member.projects) {
      member.projects = member.projects.map(p => {
        if (p.image && p.image.includes('http://localhost:5000')) {
          p.image = replaceUrl(p.image);
          changed = true;
        }
        return p;
      });
    }
    if (changed) await member.save();
  }

  // ProjectDetails
  const projects = await ProjectDetails.find();
  for (let p of projects) {
    if (p.image && p.image.includes('http://localhost:5000')) {
      p.image = replaceUrl(p.image);
      await p.save();
    }
  }

  // AboutPageContent
  const abouts = await AboutPageContent.find();
  for (let a of abouts) {
    let changed = false;
    if (a.hero && a.hero.resumeLink && a.hero.resumeLink.includes('http://localhost:5000')) {
      a.hero.resumeLink = replaceUrl(a.hero.resumeLink);
      changed = true;
    }
    if (a.images) {
      a.images = a.images.map(img => {
        if (img && img.includes('http://localhost:5000')) {
          changed = true;
          return replaceUrl(img);
        }
        return img;
      });
    }
    if (changed) await a.save();
  }

  // HomePageContent
  const homePages = await HomePageContent.find();
  for (let h of homePages) {
    let changed = false;
    if (h.hero && h.hero.mainImage && h.hero.mainImage.includes('http://localhost:5000')) {
      h.hero.mainImage = replaceUrl(h.hero.mainImage);
      changed = true;
    }
    if (h.hero && h.hero.images) {
      h.hero.images = h.hero.images.map(img => {
        if (img && img.includes('http://localhost:5000')) {
          changed = true;
          return replaceUrl(img);
        }
        return img;
      });
    }
    if (h.hero && h.hero.cardImages) {
      h.hero.cardImages = h.hero.cardImages.map(img => {
        if (img && img.includes('http://localhost:5000')) {
          changed = true;
          return replaceUrl(img);
        }
        return img;
      });
    }
    if (changed) await h.save();
  }

  console.log("DB update complete.");
  mongoose.connection.close();
}

fixDb().catch(console.error);
