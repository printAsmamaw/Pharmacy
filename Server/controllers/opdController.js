const db = require("../config/db");

// Add Ward Controller
exports.addWard = async (req, res) => {
  const { wardName, slotNumber } = req.body;

  if (!wardName || !slotNumber) {
    return res.status(400).json({ error: "Ward name and slot number are required." });
  }

  const query = `
    INSERT INTO wards (ward_name, slot_number) 
    VALUES (?, ?);
  `;

  db.query(query, [wardName, slotNumber], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to add ward" });
    }

    res.status(200).json({ message: "Ward added successfully!", result });
  });
};

exports.getWards = async (req, res) => {
  const query = `SELECT * FROM wards`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching wards:", err);
      return res.status(500).json({ error: "Failed to fetch wards" });
    }
    res.status(200).json(results);
  });
};

exports.deleteWard = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM wards WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting ward:', err);
      return res.status(500).json({ error: 'Failed to delete ward' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    res.status(200).json({ message: 'Ward deleted successfully' });
  });
}


exports.doctorData = async (req, res) => {

    const query =
      `SELECT d.fname, d.sname, d.phone, d.specialization, d.id, w.ward_name, d.slot_number 
      FROM doctors d 
      JOIN wards w ON d.ward_id = w.id`
    ;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching wards:", err);
        return res.status(500).json({ error: "Failed to fetch wards" });
      }
      res.status(200).json(results);
    });
}

exports.deleteDoctorsData = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM doctors WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting ward:', err);
      return res.status(500).json({ error: 'Failed to delete ward' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    res.status(200).json({ message: 'Ward deleted successfully' });
  });
}

exports.paidPatients = async (req, res) => {
  const query = `SELECT id, mrn, name, fname, gfname, phone, region, woreda, kebele 
                 FROM patients 
                 WHERE payment_status = 'paid'`;

                 db.query(query, (err, results) => {
                  if (err) {
                    console.error("Error fetching patients:", err);
                    return res.status(500).json({ error: "Failed to fetch patient" });
                  }
                  res.status(200).json(results);
                });
}

exports.assingWard = async (req, res) => {
  const { patient_id, ward_id, description } = req.body;

  const query = `
    INSERT INTO patient_ward (patient_id, ward_id, description)
    VALUES (?, ?, ?)
  `;

  db.query(query, [patient_id, ward_id, description], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to add ward" });
    }

    res.status(200).json({ message: "Ward assigned successfully!", result });
  });
}

exports.patientAssignedForDoctor = async (req, res) => {
  const { slot_number } = req.params;

    const query = `
        SELECT 
            patients.id AS patient_id,
            patients.mrn,
            patients.name,
            patients.fname,
            patients.gfname,
            patients.sex,
            patients.age,
            patients.region,
            patients.woreda,
            patients.address,
            patients.kebele,
            patients.phone
        FROM 
            patient_ward
        INNER JOIN 
            patients 
        ON 
            patient_ward.patient_id = patients.id
        INNER JOIN 
            wards 
        ON 
            patient_ward.ward_id = wards.id
        INNER JOIN 
            doctors 
        ON 
            wards.id = doctors.ward_id
        WHERE 
            doctors.slot_number = ?;
    `;

    db.query(query, [slot_number], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error', details: err });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'No patients found for the provided slot number.' });
        }

        res.status(200).send(results);
    });
};
