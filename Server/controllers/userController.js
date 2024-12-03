const db = require("../config/db"); // Assuming a MySQL database connection setup

// Add User Controller
exports.addUser = async (req, res) => {
  const { fname, lname, username, email, phone, role, password, institution , ward} = req.body;

  // Check if all required fields are provided
  if (!fname || !lname || !username || !email || !phone || !role || !password || !institution || !ward) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if email or username already exists
    const checkQuery = `
      SELECT * FROM users WHERE email = ? OR username = ?
    `;
    db.query(checkQuery, [email, username], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database query failed." });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "Email or username already exists." });
      }

      // Insert user into the database
      const insertQuery = `
        INSERT INTO users (fname, lname, username, email, phone, password, role, institution, slot_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      db.query(
        insertQuery,
        [fname, lname, username, email, phone, password, role, institution, ward],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to add user." });
          }

          res.status(200).json({ message: "User added successfully!", userId: result.insertId });
        }
      );
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
      const query = "SELECT * FROM users";
      db.query(query, (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Failed to fetch users." });
        }
        res.status(200).json(results);
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  // Fetch user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to fetch user data." });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params; // Get user ID from route parameter
  const formData = req.body; // Get the updated user data from the request body
  
  // Prepare the SQL query to update the user
  const query = `
    UPDATE users
    SET fname = ?, lname = ?, username = ?, email = ?, phone = ?, role = ?, password = ?, institution = ?, slot_number = ?
    WHERE id = ?
  `;

  const values = [
    formData.fname,
    formData.lname,
    formData.username,
    formData.email,
    formData.phone,
    formData.role,
    formData.password,
    formData.institution,
    formData.slot_number,
    id
  ];

  try {
    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to update user." });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      
      // Successfully updated
      res.status(200).json({ message: "User updated successfully." });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};