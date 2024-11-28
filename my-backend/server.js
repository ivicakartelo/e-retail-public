const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_retail'
});

db.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
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