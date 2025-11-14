// 1. Find all books in a specific genre (Example: Science Fiction)
db.books.find({ genre: "Science Fiction" });

// 2. Find books published after a certain year (Example: After 2000)
db.books.find({ published_year: { $gt: 2000 } });

// 3. Find books by a specific author (Example: Jane Austen)
db.books.find({ author: "Jane Austen" });


/**
 * UPDATE OPERATION (UPDATE)
 */

// 4. Update the price of a specific book (Example: "The Great Gatsby" to $15.50)
db.books.updateOne(
    { title: "The Great Gatsby" },
    { $set: { price: 15.50 } }
);

/**
 * DELETE OPERATION (DELETE)
 */

// 5. Delete a book by its title (Example: "Moby Dick")
db.books.deleteOne({ title: "Moby Dick" });


// ----------------------------------------------------------------------
// --- Task 3: Advanced Queries ---
// ----------------------------------------------------------------------

// 1. Find books that are both in stock and published after 2010
db.books.find({
    in_stock: true,
    published_year: { $gt: 2010 }
});

// 2. Use projection to return only the title, author, and price fields (excluding _id)
db.books.find(
    { genre: "Fantasy" },   // Query criteria
    { title: 1, author: 1, price: 1, _id: 0 } // Projection
);

// 3. Implement sorting to display books by price (ascending: 1)
db.books.find().sort({ price: 1 });

// 4. Implement sorting to display books by price (descending: -1)
db.books.find().sort({ price: -1 });

// 5. Use limit and skip for pagination (Page 1: first 5 books)
db.books.find().limit(5).skip(0);

// 6. Use limit and skip for pagination (Page 2: next 5 books)
db.books.find().limit(5).skip(5);


// ----------------------------------------------------------------------
// --- Task 4: Aggregation Pipelines ---
// ----------------------------------------------------------------------

// 1. Calculate the average price of books by genre
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            average_price: { $avg: "$price" },
            total_books: { $sum: 1 }
        }
    },
    { $sort: { average_price: -1 } }
]);

// 2. Find the author with the most books in the collection
db.books.aggregate([
    {
        $group: {
            _id: "$author",
            book_count: { $sum: 1 }
        }
    },
    {
        $sort: { book_count: -1 } // Sort descending by count
    },
    {
        $limit: 1 // Only return the top author
    }
]);

// 3. Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
    {
        $group: {
            // Calculate the start year of the decade (e.g., 2015 -> 2010)
            _id: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] },
            count: { $sum: 1 }
        }
    },
    {
        // Rename the decade field and sort it
        $project: {
            _id: 0,
            decade_start: "$_id",
            count: 1
        }
    },
    { $sort: { decade_start: 1 } }
]);


// ----------------------------------------------------------------------
// --- Task 5: Indexing ---
// ----------------------------------------------------------------------

// 1. Create a single-field index on the 'title' field for faster searches
db.books.createIndex({ title: 1 });

// 2. Create a compound index on 'author' (ascending) and 'published_year' (descending)
db.books.createIndex({ author: 1, published_year: -1 });

// 3. View all existing indexes
db.books.getIndexes();

// 4. Use the explain() method to demonstrate the performance improvement with indexes
// Run this query before the index was created, then after, and compare the execution time.
db.books.find({ title: "The Name of the Wind" }).explain("executionStats");

// 5. Example of explaining a query using the compound index
// Note: This query uses both fields covered by the index.
db.books.find({ author: "Jane Austen" }).sort({ published_year: -1 }).explain("executionStats");