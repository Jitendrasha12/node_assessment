// controllers/policyController.js
const User = require('../models/User');
const Policy = require('../models/Policy');

exports.searchPolicyByUsername = async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) return res.status(400).json({ error: 'name query required' });
    
    const users = await User.find({ firstName: new RegExp(name, 'i') });
    const userIds = users.map(u => u._id);
    const policies = await Policy.find({ user: { $in: userIds } })
      .populate('user')
      .populate('policy_category')
      .populate('company')
      .populate('agent')
      .populate('account');
    res.json({ count: policies.length, policies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.aggregatePoliciesByUser = async (req, res) => {
  try {
    const agg = await Policy.aggregate([
      {
        $group: {
          _id: "$user",
          policyCount: { $sum: 1 },
          policies: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          user: { firstName: "$user.firstName", email: "$user.email", _id: "$user._id" },
          policyCount: 1,
          policies: 1
        }
      }
    ]);

    res.json(agg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
