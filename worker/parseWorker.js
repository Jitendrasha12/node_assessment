
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const Agent = require('../models/Agent');
const User = require('../models/User');
const Account = require('../models/Account');
const Lob = require('../models/Lob');
const Carrier = require('../models/Carrier');
const Policy = require('../models/Policy');

async function connect(uri) {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    csvParse(content, { columns: true, trim: true }, (err, records) => {
      if (err) return reject(err);
      resolve(records);
    });
  });
}

function parseXLSX(filePath) {
  const workbook = xlsx.readFile(filePath);
  const name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[name];
  return xlsx.utils.sheet_to_json(sheet);
}

async function ensureAndGet(model, filter, createData) {
  let doc = await model.findOne(filter);
  if (!doc) doc = await model.create(createData || filter);
  return doc;
}

async function run() {
  try {
    const { filePath, mongoUri } = workerData;
    await connect(mongoUri);

    let rows = [];
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.csv') rows = await parseCSV(filePath);
    else rows = parseXLSX(filePath);

    for (const r of rows) {
      const agentDoc = await ensureAndGet(Agent, { name: r.agent_name || r.agent }, { name: r.agent_name || r.agent });
      const userDoc = await ensureAndGet(User, { email: r.email }, {
        firstName: r.firstname || r.first_name || r.name,
        dob: r.dob ? new Date(r.dob) : null,
        address: r.address,
        phoneNumber: r.phone || r.phoneNumber,
        state: r.state,
        zipCode: r.zip || r.zipCode,
        email: r.email,
        gender: r.gender,
        userType: r.userType
      });
      const accountDoc = await ensureAndGet(Account, { accountName: r.accountName || r.account_name }, { accountName: r.accountName || r.account_name, user: userDoc._id });
      const lobDoc = await ensureAndGet(Lob, { category_name: r.category_name }, { category_name: r.category_name });
      const carrierDoc = await ensureAndGet(Carrier, { company_name: r.company_name }, { company_name: r.company_name });

      // create policy
      await Policy.create({
        policy_number: r.policy_number,
        policy_start_date: r.policy_start_date ? new Date(r.policy_start_date) : null,
        policy_end_date: r.policy_end_date ? new Date(r.policy_end_date) : null,
        policy_category: lobDoc._id,
        company: carrierDoc._id,
        user: userDoc._id,
        account: accountDoc._id,
        agent: agentDoc._id
      });
    }

    parentPort.postMessage({ success: true, inserted: rows.length });
    process.exit(0);
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
    process.exit(1);
  }
}

run();
