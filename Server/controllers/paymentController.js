const db = require('../config/db');

exports.getPaymentReport = async (req, res) => {
    const query = `
      SELECT 
        p.name,
        p.fname,
        pp.item,
        pp.quantity,
        pp.unit_price,
        pp.total_price,
        pp.payment_status,
        pp.issue,
        pp.created_at
      FROM 
        patient_payments pp
      INNER JOIN 
        patients p
      ON 
        pp.patient_id = p.id;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch invoices' });
      }
  
      res.status(200).json(results);
    });
  };
  
  exports.getSalesForPatientCard = async (req, res) => {
    const query = `
      SELECT 
        p.name,
        p.fname,
        pc.amount AS price,
        pc.description,
        pc.payment_type,
        pc.created_at
      FROM 
        payment_for_card pc
      INNER JOIN 
        patients p
      ON 
        pc.patient_id = p.id;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch invoices' });
      }
  
      res.status(200).json(results);
    });
  };

  exports.addDoctors = (req, res) => {
    const {ward_id, ward_name, slot_number, fname, sname, lname, phone, address, specialization } = req.body;
    const query = `
      INSERT INTO doctors (ward_id, ward_name, slot_number, fname, sname, lname, phone, address, specialization)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [ward_id, ward_name, slot_number, fname, sname, lname, phone, address, specialization], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add doctor' });
      }
      res.status(200).json({ message: 'Doctor added successfully' });
    });
  };