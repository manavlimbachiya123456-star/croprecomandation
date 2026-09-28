/**
 * Seeds 100 DEMO farmers (Sabarkantha district, Gujarat) with kharif crop plans.
 * DATA IS SYNTHETIC - for testing area statistics only. Not real farmer records.
 *
 *   node seed/seedDemoFarmers.js          -> insert into MongoDB (skips if already seeded)
 *   node seed/seedDemoFarmers.js --reset  -> delete previous demo farmers, then insert again
 *   node seed/seedDemoFarmers.js --clear  -> delete demo farmers only
 *   node seed/seedDemoFarmers.js --csv    -> just write seed/demo_farmers.csv (no database)
 *
 * Demo login: farmerN@demo.agrismart.local  /  Demo@1234   (N = 1..100)
 */
const path = require('path');
const fs = require('fs');

const DEMO_DOMAIN = '@demo.agrismart.local';
const PASSWORD = 'Demo@1234';
const SEASON = 'kharif';

// village, taluka, farmer count, kharif crop mix (weights, synthetic)
const VILLAGES = [
  ['Idar', 'Idar', 20, { Cotton: 45, Groundnut: 22, Maize: 15, Bajra: 8, Moong: 5, Urad: 5 }],
  ['Badoli', 'Idar', 10, { Maize: 35, Groundnut: 25, Cotton: 20, Soybean: 10, Urad: 10 }],
  ['Jadar', 'Idar', 8, { Maize: 40, Bajra: 20, Groundnut: 20, Moong: 10, Urad: 10 }],
  ['Ravad', 'Idar', 9, { Cotton: 40, Groundnut: 30, Maize: 15, Bajra: 15 }],
  ['Kubadharol', 'Idar', 8, { Groundnut: 40, Cotton: 30, Maize: 20, Soybean: 10 }],
  ['Vasai', 'Idar', 8, { Maize: 30, Cotton: 30, Groundnut: 20, Jowar: 10, Moong: 10 }],
  ['Chitariya', 'Idar', 7, { Bajra: 30, Maize: 30, Groundnut: 20, Cotton: 20 }],
  ['Himatnagar', 'Himatnagar', 8, { Cotton: 35, Groundnut: 20, Soybean: 15, Maize: 15, Bajra: 15 }],
  ['Gambhoi', 'Himatnagar', 5, { Cotton: 30, Groundnut: 25, Maize: 20, Bajra: 15, Soybean: 10 }],
  ['Talod', 'Talod', 4, { Cotton: 35, Groundnut: 25, Maize: 20, Bajra: 10, Soybean: 10 }],
  ['Vadali', 'Vadali', 4, { Cotton: 45, Groundnut: 25, Bajra: 15, Maize: 15 }],
  ['Vijaynagar', 'Vijaynagar', 3, { Maize: 50, Urad: 20, Groundnut: 15, Soybean: 15 }],
  ['Khedbrahma', 'Khedbrahma', 3, { Maize: 45, Soybean: 25, Urad: 15, Moong: 15 }],
  ['Prantij', 'Prantij', 2, { Cotton: 35, Groundnut: 30, Bajra: 20, Maize: 15 }],
  ['Poshina', 'Poshina', 1, { Maize: 50, Urad: 20, Bajra: 15, Groundnut: 15 }],
];
const FIRST = ['Ramesh','Suresh','Mahesh','Kirit','Jayesh','Dinesh','Bharat','Nitin','Hitesh','Mukesh','Ashok','Rajesh','Vijay','Prakash','Kanti','Jitu','Manoj','Pravin','Arvind','Dilip','Bhavesh','Chirag','Kalpesh','Naresh','Sanjay','Vinod','Lalit','Haresh'];
const LAST = ['Patel','Chaudhari','Desai','Thakor','Parmar','Solanki','Rathod','Prajapati','Dabhi','Vaghela','Zala','Bhatt'];

// deterministic RNG so everyone gets the same data
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = rng(2026);
const pick = (a) => a[Math.floor(rand() * a.length)];
const half = (x) => Math.round(x * 2) / 2;

function pickWeighted(mix) {
  const total = Object.values(mix).reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (const [crop, w] of Object.entries(mix)) { if ((r -= w) <= 0) return crop; }
  return Object.keys(mix)[0];
}

function buildFarmers() {
  const out = []; let n = 0;
  for (const [village, taluka, count, mix] of VILLAGES) {
    for (let i = 0; i < count; i++) {
      n++;
      const landAcres = half(1 + rand() * 11);                          // 1 - 12 acres
      const cropAcres = Math.max(0.5, half(landAcres * (0.6 + rand() * 0.4))); // 60-100% of farm
      out.push({
        n, name: `${pick(FIRST)} ${pick(LAST)}`,
        phone: String(9000000000 + n), email: `farmer${n}${DEMO_DOMAIN}`,
        village, taluka, district: 'Sabarkantha', state: 'Gujarat',
        landAcres, crop: pickWeighted(mix), cropAcres: Math.min(cropAcres, landAcres), season: SEASON,
      });
    }
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const farmers = buildFarmers();

  if (args.includes('--csv')) {
    const head = 'name,phone,email,village,taluka,district,state,landAcres,crop,cropAcres,season';
    const rows = farmers.map((f) => [f.name, f.phone, f.email, f.village, f.taluka, f.district, f.state, f.landAcres, f.crop, f.cropAcres, f.season].join(','));
    const file = path.join(__dirname, 'demo_farmers.csv');
    fs.writeFileSync(file, [head, ...rows].join('\n'));
    console.log(`Wrote ${farmers.length} rows -> ${file}`);
    return;
  }

  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  const User = require('../src/models/User');
  const CropPlan = require('../src/models/CropPlan');
  const SoilRecord = require('../src/models/SoilRecord');
  const Recommendation = require('../src/models/Recommendation');

  await mongoose.connect(process.env.MONGO_URI);
  const demoUsers = await User.find({ email: new RegExp(`${DEMO_DOMAIN.replace('.', '\\.')}$`) }).select('_id');
  const ids = demoUsers.map((u) => u._id);

  if (args.includes('--reset') || args.includes('--clear')) {
    await Promise.all([
      CropPlan.deleteMany({ farmerId: { $in: ids } }), SoilRecord.deleteMany({ farmerId: { $in: ids } }),
      Recommendation.deleteMany({ farmerId: { $in: ids } }), User.deleteMany({ _id: { $in: ids } }),
    ]);
    console.log(`Removed ${ids.length} demo farmers`);
    if (args.includes('--clear')) return mongoose.disconnect();
  } else if (ids.length) {
    console.log(`${ids.length} demo farmers already exist. Use --reset to re-create.`);
    return mongoose.disconnect();
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  for (const f of farmers) {
    const u = await User.create({
      name: f.name, phone: f.phone, email: f.email, passwordHash,
      village: f.village, taluka: f.taluka, district: f.district, state: f.state, landArea: f.landAcres,
    });
    await CropPlan.create({
      farmerId: u._id, village: f.village, taluka: f.taluka, district: f.district, state: f.state,
      currentCrop: f.crop, plannedCrop: f.crop, crop: f.crop, landArea: f.cropAcres, season: f.season,
    });
  }
  console.log(`Inserted ${farmers.length} demo farmers + crop plans (${SEASON}).`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
