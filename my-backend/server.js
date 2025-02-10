require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(express.json()); // Middleware to parse JSON request bodies

// Setup session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set this to true if using https
      httpOnly: true, // Prevents JavaScript access to the cookie
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    }
  }));


// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Use your actual password
  database: 'e_retail'
});

db.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

// Helper function to generate JWT token
// Generate a JWT token for the user
const generateToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  console.log('JWT Secret Key:', process.env.JWT_SECRET || 'default-secret-key');
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role, name: user.name }, // Include name in the payload
    secretKey,
    { expiresIn: '1h' }
  );
};

// POST route for login
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  // Query the database to find the user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error during database query' });
    }

    const user = results[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = generateToken(user);
      console.log('Generated JWT:', token);

      // Respond token
      res.json({
        message: 'Login successful',
        token,
        //user: { name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error during password comparison' });
    }
  });
});

// Protected route example (requires authentication via session)
app.get('/users/protected', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({ message: 'This is a protected route.', user: req.session.user });
});

// Start the server
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });

  // Convert the callback style connection methods to promise-based
const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

app.post("/orders", async (req, res) => {
  try {
    const { user_id, articles, total_amount } = req.body;

    // Validate request data
    if (!user_id || !articles?.length || !total_amount) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Validate each article has a price
    for (const article of articles) {
      if (!article.price) {
        return res.status(400).json({ error: `Article with ID ${article.article_id} is missing a price` });
      }
    }

    // Insert into `orders` table
    const orderResult = await queryAsync(
      "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
      [user_id, total_amount]
    );
    const order_id = orderResult.insertId;

    // Insert order items into `order_items` table
    for (const article of articles) {
      // Ensure price is valid before inserting
      if (article.price === null || article.price === undefined) {
        return res.status(400).json({ error: `Invalid price for article ID ${article.article_id}` });
      }

      await queryAsync(
        "INSERT INTO order_items (order_id, article_id, quantity, price) VALUES (?, ?, ?, ?)",
        [order_id, article.article_id, article.quantity, article.price]
      );
    }

    // Successful response
    res.status(201).json({ message: "Order placed successfully!", order_id, status: "pending" });
  } catch (error) {
    console.error(error);  // Log error for debugging
    res.status(500).json({ error: "Order processing error" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch orders for the given user, ordering by order_date
    const orders = await queryAsync(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC", // Changed to use order_date
      [user_id]
    );

    // Fetch order items for each order
    for (const order of orders) {
      const orderItems = await queryAsync(
        "SELECT oi.article_id, oi.quantity, oi.price, a.name FROM order_items oi JOIN article a ON oi.article_id = a.article_id WHERE oi.order_id = ?",
        [order.order_id]
      );
      order.items = orderItems; // Updated to "items" instead of "articles"
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// Departments Routes
app.get('/departments', (req, res) => {
    db.query('SELECT * FROM department', (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(200).json(results);
    });
});


app.post('/departments', (req, res) => {
    const { name, description } = req.body;
    db.query('INSERT INTO department (name, description) VALUES (?, ?)', [name, description], (error, results) => {
        if (error) { 
            return res.status(500).json({ error });
        }
        res.status(201).json({ department_id: results.insertId, name, description });
    });
});


app.put('/departments/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
        console.error('Missing required fields: name or description');
        return res.status(400).json({ error: 'Name and description are required.' });
    }

    db.query('UPDATE department SET name = ?, description = ? WHERE department_id = ?', [name, description, id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error });
        }
        res.status(200).json({ id, name, description });
        console.log(name)
    });
});
app.delete('/departments/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM department WHERE department_id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(204).end();
    });
});

// New route to get categories by department ID
app.get('/departments/:id/categories', (req, res) => {
  const departmentId = req.params.id;

  const query = `
    SELECT c.category_id, c.name AS category_name
    FROM category c
    WHERE c.department_id = ?;
  `;

  db.query(query, [departmentId], (error, results) => {
      if (error) {
          console.error('Error fetching categories:', error);
          return res.status(500).json({ error: 'An error occurred while fetching categories.' });
      }
      res.status(200).json({ categories: results });
  });
});

// Categories Routes
app.get('/categories', (req, res) => {
    db.query('SELECT * FROM category', (error, results) => {
        if (error) return res.status(500).json({ error });
        console.log(results);
        res.status(200).json(results);
    });
});

app.post('/categories', (req, res) => {  // Corrected route definition
    const { department_id, name, description } = req.body;
    db.query('INSERT INTO category (department_id, name, description) VALUES (?, ?, ?)', [department_id, name, description], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(201).json({ category_id: results.insertId, department_id, name, description });
    });
});

app.delete('/categories/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM category WHERE category_id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(204).end();
    });
});

app.put('/categories/:id', (req, res) => {
    const { id } = req.params;
    const { department_id, name, description } = req.body;

    if (!department_id || !name || !description) {
        console.error('Missing required fields: name or description');
        return res.status(400).json({ error: 'department_id and Name and description are required.' });
    }

    db.query('UPDATE category SET department_id = ?, name = ?, description = ? WHERE category_id = ?', [department_id, name, description, id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error });
        }
        res.status(200).json({ id, department_id, name, description });
        console.log(id, department_id, name, description)
    });
});

// New route to get articles by category ID
app.get('/categories/:categoryId/articles', (req, res) => {
  const categoryId = req.params.categoryId;

  const query = `
      SELECT a.*
      FROM article a
      JOIN category_article ca ON a.article_id = ca.article_id
      WHERE ca.category_id = ?;
  `;

  db.query(query, [categoryId], (error, results) => {
      if (error) {
          console.error('Error fetching articles:', error);
          return res.status(500).json({ error: 'An error occurred while fetching articles.' });
      }
      res.status(200).json({ articles: results });
  });
});

// Articles Routes

// Get all articles
app.get('/articles', (req, res) => {
    db.query('SELECT * FROM article', (error, results) => {
      if (error) return res.status(500).json({ error });
      res.status(200).json(results);
    });
  });

// Get article by ID including its associated categories
app.get('/article/:id', (req, res) => {
  const { id } = req.params;

  // Update the SQL query to include the 'price' field
  const query = `
    SELECT 
      a.article_id, a.name, a.description, a.image_1, a.image_2, 
      a.promotion_at_homepage_level, a.promotion_at_department_level, a.price,  -- Added price
      GROUP_CONCAT(ca.category_id) AS category_ids
    FROM 
      article a
    LEFT JOIN 
      category_article ca ON a.article_id = ca.article_id
    WHERE 
      a.article_id = ?
  `;

  db.query(query, [id], (error, results) => {
      if (error) return res.status(500).json({ error });

      if (results.length > 0) {
          const article = results[0];
          console.log(article);  // Logging the article data to the console
          
          // Process category_ids to convert them into an array of numbers
          article.category_ids = article.category_ids ? article.category_ids.split(',').map(Number) : [];
          
          // Send the article with the 'price' field
          res.status(200).json(article);
      } else {
          res.status(404).json({ message: 'Article not found' });
      }
  });
});

// New route to get associated categories
app.get('/articles/:id/categories', (req, res) => {
    const articleId = req.params.id;
  
    const query = `
      SELECT c.category_id, c.name AS category_name
      FROM category c
      JOIN category_article ca ON c.category_id = ca.category_id
      WHERE ca.article_id = ?;
    `;
  
    db.query(query, [articleId], (error, results) => {
      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'An error occurred while fetching categories.' });
      }
      res.status(200).json({ categories: results });
    });
  });

//New route to get no-associated categories
app.get('/articles/:id/no-associate-categories', (req, res) => {
  const articleId = req.params.id;

  const query = `
      SELECT c.category_id, c.name AS category_name
      FROM category c
      LEFT JOIN category_article ca ON c.category_id = ca.category_id AND ca.article_id = ?
      WHERE ca.category_id IS NULL
  `;

  db.query(query, [articleId], (error, results) => {
      if (error) {
          console.error('Error fetching non-associated categories:', error);
          return res.status(500).json({ error: 'An error occurred while fetching categories.' });
      }
      res.status(200).json({ categories: results });
  });
});


// Create a new article and link to a category
app.post('/articles', (req, res) => {
    const {
        name,
        description,
        image_1,
        image_2,
        promotion_at_homepage_level,
        promotion_at_department_level,
        category_ids, // Array of selected category IDs
    } = req.body;

    // Validate required fields
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required.' });
    }

    // Insert the new article
    db.query(
        'INSERT INTO article (name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level],
        (insertErr, results) => {
            if (insertErr) {
                return res.status(500).json({ error: insertErr });
            }

            const articleId = results.insertId; // Get the new article ID

            // Prepare the values for inserting into category_article
            const categoryArticleValues = category_ids.map((category_id) => [category_id, articleId]);

            // Insert into category_article for each selected category
            db.query(
                'INSERT INTO category_article (category_id, article_id) VALUES ?',
                [categoryArticleValues],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    }
                    res.status(201).json({ id: articleId, name });
                }
            );
        }
    );
});




// Update an existing article and its categories
app.put('/articles/:id', (req, res) => {
    const { id } = req.params;
    const {
      name,
      description,
      image_1,
      image_2,
      promotion_at_homepage_level,
      promotion_at_department_level,
      category_ids = [] // Ensure this is always an array, even if empty
    } = req.body;
  
    console.log('Received payload:', req.body); // Log the payload for debugging
  
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required.' });
    }
  
    // Update the article
    db.query(
      'UPDATE article SET name = ?, description = ?, image_1 = ?, image_2 = ?, promotion_at_homepage_level = ?, promotion_at_department_level = ? WHERE article_id = ?',
      [name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level, id],
      (error) => {
        if (error) return res.status(500).json({ error });
  
        // Delete existing category relations
        db.query('DELETE FROM category_article WHERE article_id = ?', [id], (err) => {
          if (err) return res.status(500).json({ error: err });
  
          // Insert new category relations if category_ids is not empty
          if (category_ids.length > 0) {
            const categoryArticleValues = category_ids.map((category_id) => [category_id, id]);
            db.query(
              'INSERT INTO category_article (category_id, article_id) VALUES ?',
              [categoryArticleValues],
              (insertErr) => {
                if (insertErr) return res.status(500).json({ error: insertErr });
                return res.status(200).json({ message: 'Article updated successfully' });
              }
            );
          } else {
            return res.status(200).json({ message: 'Article updated successfully without categories' });
          }
        });
      }
    );
  });

// Delete an article
app.delete('/articles/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM article WHERE article_id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(204).end();
    });
});
// New route to remove categories associated with an article
app.delete('/articles/:id/remove-categories', (req, res) => {
    const articleId = req.params.id;
    const { category_ids } = req.body;
  
    if (!category_ids || category_ids.length === 0) {
      return res.status(400).json({ error: 'No categories provided for removal.' });
    }
  
    const query = `DELETE FROM category_article WHERE article_id = ? AND category_id IN (?)`;
  
    db.query(query, [articleId, category_ids], (error, results) => {
      if (error) {
        console.error('Error removing categories:', error);
        return res.status(500).json({ error: 'An error occurred while removing categories.' });
      }
  
      res.status(200).json({ message: 'Categories removed successfully.' });
    });
  });
  
  //New route to insert new categories no-associated with an article
  app.post('/articles/:id/assign-categories', (req, res) => {
    const articleId = req.params.id;
    const { category_ids } = req.body;

    if (!category_ids || category_ids.length === 0) {
        return res.status(400).json({ error: 'No categories selected for assignment.' });
    }

    const categoryArticleValues = category_ids.map((category_id) => [category_id, articleId]);

    // Insert selected categories into category_article
    db.query(
        'INSERT INTO category_article (category_id, article_id) VALUES ?',
        [categoryArticleValues],
        (error, results) => {
            if (error) {
                console.error('Error assigning categories:', error);
                return res.status(500).json({ error: 'An error occurred while assigning categories.' });
            }
            res.status(201).json({ message: 'Categories assigned successfully.' });
        }
    );
});

// Search for articles and category by name or description
app.get('/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request's query parameter

  if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
  }

  // SQL query to search for articles by name or description
  const articleSearchQuery = `
      SELECT a.*, GROUP_CONCAT(ca.category_id) AS category_ids
      FROM article a
      LEFT JOIN category_article ca ON a.article_id = ca.article_id
      WHERE a.name LIKE ? OR a.description LIKE ?
      GROUP BY a.article_id;
  `;

  // Escape the query to avoid SQL injection
  const searchTerm = `%${query}%`;

  db.query(articleSearchQuery, [searchTerm, searchTerm], (error, articleResults) => {
      if (error) {
          console.error('Error searching for articles:', error);
          return res.status(500).json({ error: 'An error occurred while searching for articles.' });
      }

      // Process the result to format category_ids into an array
      articleResults.forEach((article) => {
          article.category_ids = article.category_ids ? article.category_ids.split(',').map(Number) : [];
      });

      // SQL query to search for categories by name or description
      const categorySearchQuery = `
          SELECT * FROM category
          WHERE name LIKE ? OR description LIKE ?;
      `;

      db.query(categorySearchQuery, [searchTerm, searchTerm], (error, categoryResults) => {
          if (error) {
              console.error('Error searching for categories:', error);
              return res.status(500).json({ error: 'An error occurred while searching for categories.' });
          }

          // Return the search results for both articles and categories
          res.status(200).json({
              articles: articleResults,
              categories: categoryResults,
          });
      });
  });
});

// Users Routes

// Get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
      if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ error });
      }
      res.status(200).json(results);
  });
});

// Add a new user
app.post('/users', async (req, res) => {
  const { name, email, password, role, delivery_address, billing_address } = req.body; // Include delivery and billing addresses

  // Validate required fields
  if (!name || !email || !password || !role || !delivery_address || !billing_address) {
      console.error('Missing required fields: name, email, password, role, delivery_address, or billing_address');
      return res.status(400).json({ error: 'Name, email, password, role, delivery_address, and billing_address are required.' });
  }

  try {
      // Hash the password
      const saltRounds = 10; // Number of hashing rounds
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the user with the hashed password and addresses into the database
      db.query(
          'INSERT INTO users (name, email, password, role, delivery_address, billing_address) VALUES (?, ?, ?, ?, ?, ?)', // Include delivery and billing addresses
          [name, email, hashedPassword, role, delivery_address, billing_address],
          (error, results) => {
              if (error) {
                  console.error('Database error:', error);
                  return res.status(500).json({ error });
              }
              res.status(201).json({
                  user_id: results.insertId,
                  name,
                  email,
                  role,
                  delivery_address,
                  billing_address,
              });
          }
      );
  } catch (error) {
      console.error('Error during password hashing:', error);
      res.status(500).json({ error: 'Server error during password hashing' });
  }
});

// Update an existing user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role, delivery_address, billing_address } = req.body; // Include delivery and billing addresses

  // Validate required fields
  if (!name || !email || !role || !delivery_address || !billing_address) {
      console.error('Missing required fields: name, email, role, delivery_address, or billing_address');
      return res.status(400).json({ error: 'Name, email, role, delivery_address, and billing_address are required.' });
  }

  db.query(
      'UPDATE users SET name = ?, email = ?, role = ?, delivery_address = ?, billing_address = ? WHERE user_id = ?', // Include delivery and billing addresses
      [name, email, role, delivery_address, billing_address, id],
      (error, results) => {
          if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error });
          }

          // Check if a row was affected (i.e., the user_id exists)
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'User not found.' });
          }

          res.status(204).end(); // Return no content on successful update
      }
  );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  // Soft delete: set the `deleted_at` column to the current timestamp
  db.query(
      'UPDATE users SET deleted_at = NOW() WHERE user_id = ?',
      [id],
      (error, results) => {
          if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error });
          }

          // Check if a row was affected (i.e., the user_id exists)
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'User not found.' });
          }

          res.status(204).end(); // Return no content on successful deletion
      }
  );
});