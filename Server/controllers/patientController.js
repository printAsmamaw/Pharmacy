const db = require('../config/db'); 


exports.getPatientPay = (req, res) => {
  const query = `
    SELECT 
        pf.id,
        pf.patient_id,
        pf.amount,
        pf.description,
        pf.created_at AS payment_created_at,
        p.ttn,
        p.name,
        p.fname,
        p.gfname,
        p.sex,
        p.tel
    FROM payment_for_card pf
    INNER JOIN patients p ON pf.patient_id = p.id
    ORDER BY pf.created_at DESC;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch payment records' });
    }

    res.status(200).json(results);
  });
};

exports.getAll = (req, res) => {
  const query = `
    SELECT * FROM patients
    WHERE status = 'inactive'
    ORDER BY created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }

    res.status(200).json(results);
  });
};

// Get all patients
exports.getAllPatients = (req, res) => {
  const query = `
    SELECT * FROM patients
    ORDER BY created_at DESC;
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }

    res.status(200).json(results);
  });
};

// Get a patient by ID
exports.getPatientById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT * FROM patients WHERE id = ?;
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch patient' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Add a new patient
exports.addPatient = (req, res) => {
    const {
      mrn,
      date_reg,
      name,
      fname,
      gfname,
      sex,
      date_birth,
      age,
      region,
      woreda,
      address,
      kebele,
      house_number,
      phone,
    } = req.body;
  
    // Validate required fields
    if (!mrn || !date_reg || !name || !fname || !sex || !date_birth) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }
  
    const query = `
      INSERT INTO patients (mrn, date_reg, name, fname, gfname, sex, date_birth, age, region, woreda, address, kebele, house_number, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  
    const params = [mrn, date_reg, name, fname, gfname, sex, date_birth, age, region, woreda, address, kebele, house_number, phone];
  
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Error inserting patient:', err);
        return res.status(500).json({ error: 'Failed to add patient to the database' });
      }
      res.status(201).json({ message: 'Patient added successfully', patientId: results.insertId });
    });
  };
  
exports.addPaymentForCard = (req, res) => {
  const { patientId, amount, paymentType, description } = req.body;
  if (!patientId || !amount) {
    return res.status(400).json({ error: 'Patient ID and amount are required' });
  }

  const query = `
    INSERT INTO payment_for_card (patient_id, amount, description, payment_type)
    VALUES (?, ?, ?, ?);
  `;

  db.query(query, [patientId, amount, description, paymentType], (err, results) => {
    if (err) {
      console.error('Error adding payment:', err);
      return res.status(500).json({ error: 'Failed to add payment' });
    }

    res.status(201).json({ message: 'Payment recorded successfully!' });
  });
};

// Update patient status to inactive
exports.updatePatientStatus = (req, res) => {
  const { patientId } = req.body;

  const query = `
    UPDATE patients 
    SET status = 'active' 
    WHERE id = ?;
  `;

  db.query(query, [patientId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update patient status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found or already inactive' });
    }

    res.status(200).json({ message: 'Patient status updated successfully' });
  });
};

exports.createEmployeeId = (req, res) => {
  const query = `SELECT mrn FROM patients ORDER BY mrn DESC LIMIT 1`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err); // Debugging output
      return res.status(500).json({ error: 'Failed to generate Employee ID' });
    }

    console.log("Query result:", result); // Debugging output

    let newEmployeeId;
    if (result.length > 0 && result[0].mrn) { // Ensure `mrn` is valid
      const lastEmployeeId = result[0].mrn; // Fixed from `ttn` to `mrn`
      const lastNumber = parseInt(lastEmployeeId.slice(-3), 10); // Use base 10
      const newNumber = (lastNumber + 1).toString().padStart(4, '0');
      newEmployeeId = `cah${lastEmployeeId.slice(3, 7)}${newNumber}`;
    } else {
      newEmployeeId = 'cah20170001'; // Fallback for empty table or null `mrn`
    }

    console.log("Generated Employee ID:", newEmployeeId); // Debugging output
    res.json({ employeeId: newEmployeeId });
  });
};



exports.searchPatients = (req, res) => {
  const { query } = req.query; // Get the search query
  const searchQuery = `%${query}%`; // Use wildcard for partial match

  const sqlQuery = `
      SELECT * FROM patients
      WHERE name LIKE ? OR fname LIKE ? OR gfname LIKE ?
      ORDER BY created_at DESC;
  `;
  // const sqlQuery = `
  //     SELECT * FROM patients
  //     WHERE (name LIKE ? OR fname LIKE ? OR gfname LIKE ?) AND status = 'active'
  //     ORDER BY created_at DESC;
  // `;

  db.query(sqlQuery, [searchQuery, searchQuery, searchQuery], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to fetch search results' });
      }
      res.status(200).json(results);
  });
};

exports.getAllDoctors = (req, res) => {
  const query = `
    SELECT id, CONCAT(fname, ' ', sname, ' ', lname) AS full_name
    FROM doctors
    ORDER BY fname, sname;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch doctors' });
    }

    res.status(200).json(results);
  });
};

exports.setEvaluation = (req, res) => {
  const { patient_id, prescriber_id, products } = req.body;

  if (!patient_id || !prescriber_id || !products || !products.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const values = products.map((product) => [
    patient_id,
    prescriber_id,
    product.medicine_id,
    product.item,
    product.unit,
    product.quantity,
    product.price,
    product.description,
  ]);

  const evaluationQuery = `
    INSERT INTO evaluation 
    (patient_id, prescriber_id, medicine_id, item, unit, quantity, unit_price, description) 
    VALUES ?;
  `;

  const patientOrdersQuery = `
    INSERT INTO patient_orders 
    (patient_id, prescriber_id, medicine_id, item, unit, quantity, unit_price, description) 
    VALUES ?;
  `;

  // Execute both queries sequentially
  db.query(evaluationQuery, [values], (err) => {
    if (err) {
      console.error('Error inserting into evaluation:', err);
      return res.status(500).json({ error: 'Failed to insert evaluation records' });
    }

    db.query(patientOrdersQuery, [values], (err) => {
      if (err) {
        console.error('Error inserting into patient_orders:', err);
        return res.status(500).json({ error: 'Failed to insert patient orders' });
      }

      res.status(200).json({ message: 'Evaluation and patient orders inserted successfully' });
    });
  });
};



exports.getEvaluation = async (req, res) => {
  const { patientId } = req.params;

  try {
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const query = `
      SELECT 
          e.item AS item,
          e.unit AS unit,
          ms.batchNo AS batch,
          ms.expiry AS expiry_date,
          e.quantity AS quantity,
          ms.price AS unit_price,
          (e.quantity * ms.price) AS total_price
      FROM 
          evaluation e
      INNER JOIN 
          medicine_shelf ms
      ON 
          e.medicine_id = ms.id
      WHERE 
        e.issue = 'picklist' AND e.patient_id = ?;
    `;

    db.query(query,[patientId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch doctors' });
      }
  
      res.status(200).json(results);
    });

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch evaluation data' });
  }
};

exports.addPatientOrders = async (req, res) => {
  const { orders } = req.body;

  if (!orders || orders.length === 0) {
    return res.status(400).json({ error: "No orders provided." });
  }

  try {
    const values = orders.map((order) => [
      order.patient_id,
      order.medicine_id,
      order.item,
      order.quantity,
      order.unit_price,
      order.total_price,
    ]);

    const query = `
      INSERT INTO patient_orders (patient_id, medicine_id, item, quantity, unit_price, total_price)
      VALUES ?;
    `;

    await db.query(query, [values]);

    res.status(200).json({ message: "Orders successfully inserted." });
  } catch (error) {
    console.error("Error inserting patient orders:", error);
    res.status(500).json({ error: "Database error while inserting orders." });
  }
};


// Fetch invoices with patient information
exports.getInvoices = (req, res) => {
  const query = `
    SELECT 
      MAX(e.id) AS invoice_id,        -- Use MAX or MIN to select one record per patient
      p.id AS patient_id,
      p.name AS patient_name, 
      p.fname AS patient_fname,
      p.mrn AS card_number,
      MAX(e.created_at) AS order_created_at, -- Use the most recent order date
      e.issue AS issue,
      e.id AS evaluation_id
    FROM 
      evaluation e
    JOIN 
      patients p
    ON 
      e.patient_id = p.id
    GROUP BY 
      e.patient_id, p.name, p.fname, p.mrn, e.issue
    ORDER BY 
      order_created_at DESC;          -- Fetch recent invoices first
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      return res.status(500).json({ error: 'Failed to fetch invoices' });
    }

    res.status(200).json(results);
  });
};


exports.getPaymentDetails = async (req, res) => {
  const patientId = req.params.patient_id;

  const query = `
    SELECT po.id AS order_id, po.medicine_id, po.unit, po.prescriber_id, po.item, po.description, po.quantity, po.unit_price, 
           (po.quantity * po.unit_price) AS total_price 
    FROM patient_orders AS po
    WHERE po.patient_id = ?;
  `;

  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching payment details:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

exports.updateOrder = async (req, res) => {
  const { patientId } = req.body;
  try {
    const query = `
      UPDATE patient_orders
      SET issue = 'issued'
      WHERE patient_id = ? AND issue = 'picklist'
    `;
    

  await db.query(query, [patientId]);

    res.status(200).json({ message: "Issue status updated successfully.." });
  } catch (error) {
    console.error("Error inserting patient orders:", error);
    res.status(500).json({ error: "Error updating issue status." });
  }
};

exports.addPatientPayments = async (req, res) => {
  const { patientId, evaluation_id, orderDetails } = req.body;

  try {
    // Begin transaction
    await db.query('START TRANSACTION');

    // Insert each order into patient_payments and temporary tables
    for (const order of orderDetails) {
      const { prescriber_id, item, unit, quantity, unit_price, total_price, medicine_id, description } = order;

      // Query for patient_payments
      const patientPaymentsQuery = `
        INSERT INTO patient_payments (
          patient_id,
          medicine_stock_id,
          evaluation_id,
          prescriber_id,
          item,
          unit,
          quantity,
          description,
          unit_price,
          total_price,
          payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')
      `;
      await db.query(patientPaymentsQuery, [
        patientId,
        medicine_id,
        evaluation_id,
        prescriber_id, // Assuming prescriber_id is the same as the order ID, adjust as necessary
        item,
        unit,
        quantity,
        description,
        unit_price,
        total_price,
      ]);

      // Query for temporary
      const temporaryQuery = `
        INSERT INTO temporary (
          patient_id,
          medicine_stock_id,
          evaluation_id,
          prescriber_id,
          item,
          unit,
          quantity,
          description,
          unit_price,
          total_price,
          payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')
      `;
      await db.query(temporaryQuery, [
        patientId,
        medicine_id,
        evaluation_id,
        prescriber_id, // Assuming prescriber_id is the same as the order ID, adjust as necessary
        item,
        unit,
        quantity,
        description,
        unit_price,
        total_price,
      ]);
    }

    // Commit transaction
    await db.query('COMMIT');

    // Emit a real-time event to all connected clients using `io`
    req.io.emit('paymentConfirmed', {
      message: 'A new payment has been confirmed!',
      patientId,
      evaluation_id,
      orderDetails,
    });

    res.status(200).json({ message: 'Payment confirmed and orders updated successfully.' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment. Please try again.' });
  }
};


exports.getPiadPatient = async (req, res) => {
  const query = `
    SELECT 
      p.id AS patient_id,
      p.name AS patient_name,
      p.fname AS patient_fname,
      p.mrn AS card_number,
      MAX(pp.created_at) AS issued_date,
      pp.payment_status,
      pp.id,
      pp.issue
    FROM patient_payments pp
    INNER JOIN patients p ON pp.patient_id = p.id
    WHERE pp.payment_status = 'paid'
    GROUP BY p.id, p.name, p.fname, p.mrn, pp.payment_status
    ORDER BY MAX(pp.created_at) DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching paid payments' });
    }

    res.status(200).json(results);
  });
};

// Get patient details and payment information
exports.getPatientDetails = (req, res) => {
  const { patientId } = req.params;

  const patientInfoQuery = `
    SELECT 
            p.id AS patient_id, 
            CONCAT(p.name, ' ', p.fname, ' ', p.gfname) AS patient_name,
            p.phone AS patient_phone,
            p.mrn AS card_number,
            p.age
        FROM patients p
        WHERE p.id = ?;
  `;

  const paymentDetailsQuery = `
    SELECT 
            t.item, 
            t.unit, 
            t.quantity, 
            t.description, 
            t.unit_price, 
            t.total_price, 
            t.medicine_stock_id,
            t.prescriber_id
        FROM temporary t
        WHERE t.patient_id = ?;
  `;

  // First fetch patient info
  db.query(patientInfoQuery, [patientId], (err, patientResults) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching patient info" });
    }

    if (patientResults.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const patientInfo = patientResults[0];

    // Then fetch payment details
    db.query(paymentDetailsQuery, [patientId], (err, paymentResults) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching payment details" });
      }

      // Send combined results
      res.status(200).json({
        patientInfo,
        paymentDetails: paymentResults,
      });
    });
  });
};


// exports.updateShelfQuantity = (req, res) => {
//   const { updates } = req.body; // Array of objects with medicine ID and quantity

//   if (!updates || !Array.isArray(updates) || updates.length === 0) {
//     return res.status(400).json({ error: 'Invalid updates format or empty updates array' });
//   }

//   db.beginTransaction((transactionErr) => {
//     if (transactionErr) {
//       console.error('Error starting transaction:', transactionErr);
//       return res.status(500).json({ error: 'Failed to start transaction' });
//     }

//     const promises = updates.map(({ medicineId, dispenseQuantity }) => {
//       return new Promise((resolve, reject) => {
//         db.query(
//           `
//           UPDATE medicine_shelf 
//           SET quantity = quantity - ? 
//           WHERE id = ? AND quantity >= ?
//           `,
//           [dispenseQuantity, medicineId, dispenseQuantity],
//           (err, result) => {
//             if (err) {
//               return reject(err); // Reject promise if query fails
//             }
//             if (result.affectedRows === 0) {
//               return reject(new Error(`Insufficient stock or invalid medicine ID for ID: ${medicineId}`));
//             }
//             resolve();
//           }
//         );
//       });
//     });

//     Promise.all(promises)
//       .then(() => {
//         db.commit((commitErr) => {
//           if (commitErr) {
//             console.error('Error committing transaction:', commitErr);
//             return db.rollback(() => {
//               res.status(500).json({ error: 'Failed to commit transaction' });
//             });
//           }
//           res.status(200).json({ message: 'Stock updated successfully' });
//         });
//       })
//       .catch((error) => {
//         console.error('Error updating stock:', error);
//         db.rollback(() => {
//           res.status(500).json({ error: 'Failed to update stock', details: error.message });
//         });
//       });
//   });
// };


exports.updateShelfQuantity = async (req, res) => {

  try {
    const { updates } = req.body; // Array of objects with medicine ID and quantity

    // Start a transaction to ensure atomicity
    await db.beginTransaction();

    for (const update of updates) {
      const { medicineId, dispenseQuantity } = update;

      // Update stock quantity
      await db.query(
        `UPDATE medicine_shelf 
         SET quantity = quantity - ? 
         WHERE id = ? AND quantity >= ?`, // Prevent reducing below zero
        [dispenseQuantity, medicineId, dispenseQuantity]
      );
    }

    // Commit the transaction
    await db.commit();

    res.status(200).send({ message: 'Stock updated successfully' });
  } catch (error) {
    await db.rollback(); // Rollback in case of an error
    console.error('Error updating stock:', error);
    res.status(500).send({ error: 'Failed to update stock' });
  }
};

// Update the 'issue' column in patient_payments table
exports.updateIssueStatus = async (req, res) => {
  const { patientId } = req.params;
console.log(patientId);
  const updateQuery = `
    UPDATE patient_payments
    SET issue = 'issued'
    WHERE patient_id = ?
  `;

  db.query(updateQuery, [patientId], (err, result) => {
    if (err) {
      console.error('Error updating issue status:', err);
      return res.status(500).json({ error: 'Failed to update issue status' });
    }
    
    res.status(200).json({ message: 'Issue status updated successfully' });
  });
};

exports.addCounseledItems = (req, res) => {
    const { patientId } = req.params;
    const { counseledItems } = req.body; // Array of items from the frontend

    if (!counseledItems || counseledItems.length === 0) {
        return res.status(400).json({ error: 'No items provided for counseling' });
    }

    const values = counseledItems.map(item => [
        patientId,
        item.item,
        item.unit,
        item.quantity,
        item.description,
        item.unit_price,
        'active', // status
        'issued'  // issue
    ]);

    const query = `
        INSERT INTO counseled_items (patient_id, item, unit, quantity, description, unit_price, status, issue)
        VALUES ?
    `;

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error inserting counseled items:', err);
            return res.status(500).json({ error: 'Failed to insert counseled items' });
        }

        res.status(201).json({ message: 'Counseled items successfully added', affectedRows: result.affectedRows });
    });
};

exports.EvaluationUpdateIssue = async (req, res) => {
  const { patient_id } = req.body;

  if (!patient_id) {
    return res.status(400).json({ error: "Patient ID is required." });
  }

  const query = `
    UPDATE evaluation
    SET issue = 'issued'
    WHERE patient_id = ? AND issue = 'picklist';
  `;

  db.query(query, [patient_id], (err, result) => {
    if (err) {
      console.error("Error updating issue status:", err);
      return res.status(500).json({ error: "Error updating issue status." });
    }

    res.status(200).json({ message: "Issue status updated successfully.", affectedRows: result.affectedRows });
  });
};

exports.deleteTemporaryData  = async (req, res) => {
  const { patientId } = req.params;

  const deleteQuery = 'DELETE FROM temporary WHERE patient_id = ?';

  try {
      await db.query(deleteQuery, [patientId]);
      res.status(200).json({ message: 'Temporary data deleted successfully.' });
  } catch (error) {
      console.error('Error deleting temporary data:', error);
      res.status(500).json({ message: 'An error occurred while deleting data.', error });
  }
};

exports.deleteordersData = async (req, res) => {
  const { patientId } = req.params;

      const deleteQuery = `
          DELETE FROM patient_orders
          WHERE patient_id = ?;
      `;
      try {
        await db.query(deleteQuery, [patientId]);
        res.status(200).json({ message: 'Temporary data deleted successfully.' });
    } catch (error) {
        console.error('Error deleting order data:', error);
        res.status(500).json({ message: 'An error occurred while deleting order data.', error });
    }
 
};

exports.updateEvaluationStatus = async (req, res) => {
  const { patientId } = req.params;
  
  const updateQuery = `
    UPDATE evaluation
    SET issue = 'issued'
    WHERE patient_id = ?
  `;

  db.query(updateQuery, [patientId], (err, result) => {
    if (err) {
      console.error('Error updating issue status:', err);
      return res.status(500).json({ error: 'Failed to update issue status' });
    }
    
    res.status(200).json({ message: 'Issue status updated successfully' });
  });
};