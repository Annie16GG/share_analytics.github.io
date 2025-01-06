const db = require("../../config/db");
const db2 = require("../../config/db_singlestore");
const { v4: uuidv4 } = require('uuid');

exports.getGroups = (req, res) => {
  const query = "SELECT * FROM grupos ORDER BY name_group";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.addGroup = (req, res) => {
  const { name, users } = req.body;
  const groupId = uuidv4();
  
  const groupQuery = "INSERT INTO grupos (id, name_group) VALUES (?, ?)";
  db.query(groupQuery, [groupId, name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (users && users.length > 0) {
      console.log(users);
      const userGroupValues = users.map(userId => [uuidv4(), groupId, userId]);
      const userGroupQuery = "INSERT INTO user_groups (id, group_id, user_id) VALUES ?";
      
      db.query(userGroupQuery, [userGroupValues], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: "Group and users added successfully" });
      });
    } else {
      return res.status(200).json({ message: "Group added successfully" });
    }
  });
};


exports.addUsersToGroup = (req, res) => {
  const { id, users } = req.body;
  console.log(req.body);

  if (!id || !users || users.length === 0) {
    return res.status(400).json({ error: "Group ID and user IDs are required" });
  }

  const userGroupValues = users.map(userId => [uuidv4(), id, userId]);
  const userGroupQuery = "INSERT INTO user_groups (id, group_id, user_id) VALUES ?";

  db.query(userGroupQuery, [userGroupValues], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json({ message: "Users added to group successfully" });
  });
};
