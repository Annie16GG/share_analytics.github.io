const db = require("../../config/db");
const db2 = require("../../config/db_singlestore");
const { v4: uuidv4 } = require('uuid');

exports.addCategory = (req, res) => {
    const { name, users } = req.body;
    const groupId = uuidv4();
    
    const groupQuery = "INSERT INTO grupos (id, name_group) VALUES (?, ?)";
    db.query(groupQuery, [groupId, name], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (users && users.length > 0) {
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

