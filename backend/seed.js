const mongoose = require('mongoose');
const path = require('path');
const Camp = require('./Camp');
const Volunteer = require('./Volunteer');
const Donation = require('./Donation');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI || 'mongodb+srv://nikughoshx_db_user:zlxATZEWqjFR7VB7@nikuserver.lvltvoa.mongodb.net/disaster-relief';
console.log('🗄️  Connecting to MongoDB using', uri);
mongoose.connect(uri)
  .catch(err => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });

const skillsList = ["Medical", "Cooking", "Driving", "Construction", "Translation"];
const supplyItems = ["Water", "Blankets", "First Aid Kits", "Food Rations", "Flashlights"];

const donors = [
  "Red Cross Chapter NYC", "Anonymous", "Community Relief Fund", "TechCorp Foundation",
  "Local Church Network", "Anonymous", "State Emergency Fund", "Volunteer Alliance",
  "Corporate Giving Hub", "Anonymous", "Neighborhood Association", "National Relief Corps"
];

const generateData = async () => {
  await Camp.deleteMany({});
  await Volunteer.deleteMany({});
  await Donation.deleteMany({});
  console.log("🧹 Database cleared.");

  // 1. Generate 10 Relief Camps
  const camps = [];
  for (let i = 1; i <= 10; i++) {
    const isCritical = Math.random() > 0.7;
    const inventory = supplyItems.map(item => {
      const quantity = Math.floor(Math.random() * 200) + 10;
      return {
        item,
        quantity: isCritical && item === "Water" ? 5 : quantity,
        unit: item === "Water" ? "liters" : "units",
        status: (isCritical && item === "Water") || quantity < 20 ? 'Critical' : 'Stable'
      };
    });
    const criticalCount = inventory.filter(i => i.status === 'Critical').length;
    camps.push({
      name: `Relief Camp ${String.fromCharCode(64 + i)}`,
      location: {
        lat: 26.2 + (Math.random() * 0.5),
        lng: 92.9 + (Math.random() * 0.5),
        address: `${i * 100} Crisis Ave`
      },
      capacity: { total: 500, currentOccupancy: Math.floor(Math.random() * 500) },
      inventory,
      priorityScore: Math.min(100, criticalCount * 25)
    });
  }
  const savedCamps = await Camp.insertMany(camps);

  // 2. Generate 30 Volunteers
  const volunteers = [];
  for (let i = 1; i <= 30; i++) {
    volunteers.push({
      name: `Volunteer ${i}`,
      phone: `555-010${i}`,
      skills: [skillsList[Math.floor(Math.random() * skillsList.length)]],
      status: Math.random() > 0.2 ? 'Available' : 'On-Mission',
      currentLocation: {
        type: 'Point',
        coordinates: [92.9 + (Math.random() * 0.5), 26.2 + (Math.random() * 0.5)]
      }
    });
  }
  await Volunteer.insertMany(volunteers);

  // 3. Generate 20 Donations
  const statuses = ['Pledged', 'In Transit', 'Delivered'];
  const donations = [];
  for (let i = 0; i < 20; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 14);
    donations.push({
      donor: donors[Math.floor(Math.random() * donors.length)],
      item: supplyItems[Math.floor(Math.random() * supplyItems.length)],
      quantity: Math.floor(Math.random() * 500) + 50,
      unit: Math.random() > 0.5 ? 'units' : 'liters',
      destinationCamp: savedCamps[Math.floor(Math.random() * savedCamps.length)]._id,
      status,
      estimatedDelivery: new Date(Date.now() + (Math.random() * 7 * 24 * 60 * 60 * 1000)),
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  await Donation.insertMany(donations);

  console.log("✅ Seeded 10 Camps, 30 Volunteers, and 20 Donations!");

  // 4. Add a couple of missing person reports for testing
  const MissingPerson = require('./MissingPerson');
  await MissingPerson.deleteMany({});
  await MissingPerson.insertMany([
    { name: 'Rita Singh', age: 34, lastSeenLocation: 'Camp Alpha', lastSeenDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), description: 'Short hair, blue shirt', photo: '' },
    { name: 'Aman Patel', age: 12, lastSeenLocation: 'Railway Station', lastSeenDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), description: 'Wearing yellow backpack', photo: '' }
  ]);
  console.log("✅ Added sample missing person reports.");

  // 5. Community crowd reports
  const CrowdReport = require('./CrowdReport');
  await CrowdReport.deleteMany({});
  await CrowdReport.insertMany([
    { type: 'Flood', description: 'Water level rising rapidly near Riverbank', location: { lat: 26.3, lng: 92.95 } },
    { type: 'Landslide', description: 'Small landslide blocking hill road', location: { lat: 26.25, lng: 92.85 } }
  ]);
  console.log("✅ Added sample crowd-sourced reports.");

  process.exit();
};

generateData();