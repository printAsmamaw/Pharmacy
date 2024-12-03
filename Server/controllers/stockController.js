const db = require('../config/db');

// Controller to fetch all medicine stocks
exports.getAllStocks = (req, res) => {
  const query = `
    SELECT 
      id,
      manifacturer,
      item_measure,
      code,
      name,
      batchNo,
      quantity,
      price,
      sell,
      expiry,
      created_at
    FROM medicine_stocks
    ORDER BY created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching medicine stocks:', err);
      return res.status(500).json({ error: 'Failed to fetch medicine stocks' });
    }

    res.status(200).json(results);
  });
};


// Controller to save medicine shelf data
// exports.saveMedicineShelf = (req, res) => {
//   const medicineShelfData = req.body;

//   if (!Array.isArray(medicineShelfData) || medicineShelfData.length === 0) {
//     return res.status(400).json({ error: 'Invalid or empty data' });
//   }

//   const query = `
//     INSERT INTO medicine_shelf (
//       medicine_stock_id,
//       user_id,
//       item_measure,
//       code,
//       name,
//       batchNo,
//       quantity,
//       price,
//       expiry
//     ) VALUES ?
//   `;

//   // Prepare data for bulk insert
//   const values = medicineShelfData.map(item => [
//     item.medicine_stock_id,
//     item.user_id,
//     item.item_measure,
//     item.code,
//     item.name,
//     item.batchNo,
//     item.quantity,
//     item.price,
//     item.expiry,
//   ]);

//   db.query(query, [values], (err, result) => {
//     if (err) {
//       console.error('Error saving medicine shelf data:', err);
//       return res.status(500).json({ error: 'Failed to save medicine shelf data' });
//     }

//     res.status(201).json({ message: 'Medicine shelf data saved successfully', result });
//   });
// };

// Controller to create store_description and link to medicine_shelf
exports.createStoreDescription = (req, res) => {
  const { userId, account, from_date, to_date, request_type, store, medicines } = req.body;

  if (!userId || !account || !from_date || !to_date || !request_type || !store || !Array.isArray(medicines)) {
    return res.status(400).json({ error: 'Invalid or missing data' });
  }

  // Insert into store_description table
  const storeDescriptionQuery = `
    INSERT INTO store_description (user_id, account, from_date, to_date, request_type, store)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const storeDescriptionValues = [userId, account, from_date, to_date, request_type, store];

  db.query(storeDescriptionQuery, storeDescriptionValues, (err, result) => {
    if (err) {
      console.error('Error inserting store description:', err);
      return res.status(500).json({ error: 'Failed to create store description' });
    }

    const storeDescriptionId = result.insertId;

    // Insert into medicine_shelf table
    const medicineShelfQuery = `
      INSERT INTO medicine_shelf (
        medicine_stock_id,
        user_id,
        item_measure,
        code,
        name,
        batchNo,
        quantity,
        price,
        expiry,
        store_description_id
      ) VALUES ?
    `;

    const medicineShelfValues = medicines.map(medicine => [
      medicine.medicine_stock_id,
      medicine.user_id,
      medicine.item_measure,
      medicine.code,
      medicine.name,
      medicine.batchNo,
      medicine.quantity,
      medicine.price,
      medicine.expiry,
      storeDescriptionId,
    ]);

    db.query(medicineShelfQuery, [medicineShelfValues], (err, result) => {
      if (err) {
        console.error('Error inserting medicine shelf data:', err);
        return res.status(500).json({ error: 'Failed to save medicine shelf data' });
      }

      res.status(201).json({ message: 'Store description and medicine shelf data saved successfully' });
    });
  });
};

// Controller to fetch all store descriptions
exports.getAllStoreDescriptions = (req, res) => {
  const query = `
    SELECT 
      sd.id,
      sd.user_id,
      sd.account,
      sd.from_date,
      sd.to_date,
      sd.request_type,
      sd.store,
      sd.generated_by,
      sd.status,
      sd.created_at,
      u.fname AS first_name,
      u.lname AS last_name
    FROM store_description sd
    JOIN users u ON sd.user_id = u.id
    ORDER BY sd.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching store descriptions:', err);
      return res.status(500).json({ error: 'Failed to fetch store descriptions' });
    }

    res.status(200).json(results);
  });
};


exports.getStockData = (req, res) => {
  const { id } = req.params; // `id` refers to `store_description_id`
  const query = `
      SELECT 
        shelf.name AS shelf_name, 
        shelf.item_measure, 
        shelf.batchNo, 
        shelf.code,
        shelf.price AS shelf_price, 
        shelf.quantity AS shelf_quantity,
        stocks.quantity AS stock_quantity
      FROM 
        medicine_shelf AS shelf
      INNER JOIN 
        medicine_stocks AS stocks
      ON 
        shelf.medicine_stock_id = stocks.id
      WHERE 
        shelf.store_description_id = ?;
  `;

  db.query(query, [id], (err, results) => {
      if (err) {
          console.error('Error fetching stock data with medicine_stock_id:', err);
          return res.status(500).json({ error: 'Failed to fetch stock data' });
      }

      res.status(200).json(results);
  });
};



exports.updatetheStatusApprove = async (req, res) => {
  const { id } = req.params;


      const query = 'UPDATE medicine_shelf SET status = "approve" WHERE store_description_id = ?';

      db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating status' });
        }
        res.json({ message: 'Status updated to Pending' });
    });
  };

exports.updatethestatuswithpending = (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE medicine_shelf SET status = "Pending" WHERE store_description_id = ?';

  db.query(query, [id], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error updating status' });
      }
      res.json({ message: 'Status updated to Pending' });
  });
};

exports.updateStoreDescription = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Update the status in the database (example using SQL)
  const query = 'UPDATE store_description SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, result) => {
      if (err) {
          console.error('Error updating status:', err);
          return res.status(500).send('Failed to update status');
      }
      res.send({ message: 'Status updated successfully', id, status });
  });
}

exports.updateQuantity = (req, res) => {
  const requestId = req.params.id;

  db.query(`
      SELECT ms.id AS stock_id, ms.quantity AS stock_quantity, 
             sh.quantity AS shelf_quantity
      FROM medicine_shelf sh
      JOIN medicine_stocks ms ON sh.medicine_stock_id = ms.id
      WHERE sh.store_description_id = ?
  `, [requestId], (err, shelfData) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to fetch shelf data.' });
      }

      const updatePromises = shelfData.map(item => {
          const newQuantity = item.stock_quantity - item.shelf_quantity;

          return new Promise((resolve, reject) => {
              db.query(`
                  UPDATE medicine_stocks
                  SET quantity = ?
                  WHERE id = ?
              `, [newQuantity, item.stock_id], (err) => {
                  if (err) reject(err);
                  else resolve();
              });
          });
      });

      Promise.all(updatePromises)
          .then(() => res.status(200).json({ message: 'Request approved and stock quantities updated.' }))
          .catch(error => {
              console.error(error);
              res.status(500).json({ message: 'Failed to update stock quantities.' });
          });
  });
};

exports.getStoreDescriptionsByUserId = (req, res) => {
  const { userId } = req.query; // Get userId from the query parameters

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = `
    SELECT 
      id,
      account,
      from_date,
      to_date,
      request_type,
      store,
      generated_by,
      status,
      created_at
    FROM store_description
    WHERE user_id = ?  -- Filter by user ID
    ORDER BY created_at DESC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching store descriptions:', err);
      return res.status(500).json({ error: 'Failed to fetch store descriptions' });
    }

    res.status(200).json(results);
  });
};
 
exports.getMedicine = (req, res) => {
  const query = 'SELECT * FROM medicine_stocks WHERE quantity > 0';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch drugs' });
    }
    res.status(200).json(results);
  });
};


exports.getMedicineShelf = (req, res) => {
  const query = `
    SELECT 
      id,
      name,
      item_measure,
      code,
      batchNo,
      quantity,
      price,
      expiry,
      status 
    FROM 
      medicine_shelf
    WHERE 
      status = 'approve' AND 
      quantity > 0
    ORDER BY 
      created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching medicine shelf data:', err);
      return res.status(500).json({ error: 'Failed to fetch medicine shelf data' });
    }

    res.status(200).json(results);
  });
};

exports.getCounseledItems = (req, res) => {
  const { date } = req.query;

  const query = `
    SELECT 
      ci.id,
      ci.item,
      ci.quantity,
      ci.description,
      ci.unit_price,
      ci.total_price,
      ci.created_at AS counseled_date,
      p.name,
      p.fname
    FROM 
      counseled_items ci
    JOIN 
      patients p ON ci.patient_id = p.id
    ${date ? `WHERE DATE(ci.created_at) = ?` : ''}
    ORDER BY 
      ci.created_at DESC;
  `;

  const values = date ? [date] : [];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error fetching counseled items data:', err);
      return res.status(500).json({ error: 'Failed to fetch counseled items data' });
    }

    res.status(200).json(results);
  });
};

exports.addStoreWithdraw = (req, res) => {
  const { store_description_id, shelfData } = req.body;

  if (!shelfData || !shelfData.length) {
    return res.status(400).json({ error: 'No data provided for shelf items.' });
  }

  const values = shelfData.map(item => [
    store_description_id,
    item.item,
    item.unit,
    item.batch_number,
    item.code,
    item.price,
    item.balanced_quantity,
    item.requested_quantity,
  ]);

  const query = `
    INSERT INTO store_withdraw 
    (store_description_id, item, unit, batch_number, code, price, balanced_quantity, requested_quantity)
    VALUES ?
  `;

  db.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error inserting into store_withdraw:', err);
      return res.status(500).json({ error: 'Failed to insert data into store_withdraw table' });
    }

    res.status(200).json({ message: 'All items approved and stored successfully.' });
  });
};

exports.getWithdrawals = (req, res) => {
  const query = `
    SELECT 
      w.id,
      CONCAT(u.fname, ' ', u.lname) AS requested_by,
      w.item,
      w.unit,
      w.batch_number,
      w.code,
      w.price,
      w.balanced_quantity,
      w.requested_quantity,
      w.created_at
    FROM 
      store_withdraw w
    JOIN 
      store_description sd ON w.store_description_id = sd.id
    JOIN 
      users u ON sd.user_id = u.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching withdrawals:', err);
      return res.status(500).json({ error: 'Failed to fetch withdrawal data' });
    }

    res.status(200).json(results);
  });
};

exports.getShelfProducts = (req, res) => {
  const query = `
    SELECT 
      ms.id,
      ms.item_measure,
      ms.name AS product,
      ms.code,
      ms.batchNo AS batch_number,
      ms.quantity,
      ms.price,
      ms.expiry AS expire_date,
      CONCAT(u.fname, ' ', u.lname) AS requested_by
    FROM 
      medicine_shelf ms
    JOIN 
      users u ON ms.user_id = u.id
    WHERE 
      ms.status = 'approve';
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching approved medicines:', err);
      return res.status(500).json({ error: 'Failed to fetch approved medicines' });
    }

    res.status(200).json(results);
  });
};