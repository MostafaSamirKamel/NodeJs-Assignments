const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
    try {
        console.log('--- Collection Management ---');

        // 1. Explicit collection
        const res1 = await axios.post(`${BASE_URL}/collection/books`);
        console.log('1. POST /collection/books:', res1.data);

        // 2. Implicit collection
        const res2 = await axios.post(`${BASE_URL}/collection/authors`, { name: 'Author1', nationality: 'British' });
        console.log('2. POST /collection/authors:', res2.data);

        // 3. Capped collection
        const res3 = await axios.post(`${BASE_URL}/collection/logs/capped`);
        console.log('3. POST /collection/logs/capped:', res3.data);

        // 4. Index
        const res4 = await axios.post(`${BASE_URL}/collection/books/index`);
        console.log('4. POST /collection/books/index:', res4.data);

        console.log('\n--- Book Operations ---');

        // 5. Insert one
        const res5 = await axios.post(`${BASE_URL}/books`, {
            title: 'Book1',
            author: 'Ali',
            year: 1937,
            genres: ['Fantasy', 'Adventure']
        });
        console.log('5. POST /books:', res5.data);

        // 6. Insert batch
        const res6 = await axios.post(`${BASE_URL}/books/batch`, [
            { title: 'Future', author: 'George Orwell', year: 2028, genres: ['Science Fiction'] },
            { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, genres: ['Classic', 'Fiction'] },
            { title: 'Brave New World', author: 'Aldous Huxley', year: 2006, genres: ['Dystopian', 'Science Fiction'] }
        ]);
        console.log('6. POST /books/batch:', res6.data);

        // 7. Insert log
        const res7 = await axios.post(`${BASE_URL}/logs`, {
            book_id: res6.data.insertedIds['0'],
            action: 'borrowed'
        });
        console.log('7. POST /logs:', res7.data);

        // 8. Update
        const res8 = await axios.patch(`${BASE_URL}/books/Future`, { year: 2022 });
        console.log('8. PATCH /books/Future:', res8.data);

        // 9. Find by title
        const res9 = await axios.get(`${BASE_URL}/books/title?title=Brave New World`);
        console.log('9. GET /books/title:', res9.data);

        // 10. Find by year range
        const res10 = await axios.get(`${BASE_URL}/books/year?from=1990&to=2010`);
        console.log('10. GET /books/year:', res10.data);

        // 11. Find by genre
        const res11 = await axios.get(`${BASE_URL}/books/genre?genre=Science Fiction`);
        console.log('11. GET /books/genre:', res11.data);

        // 12. Skip Limit
        // Insert more to make skip/limit meaningful
        await axios.post(`${BASE_URL}/books/batch`, [
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, genres: ['Classic', 'Fiction'] },
            { title: 'Moby Dick', author: 'Herman Melville', year: 1851, genres: ['Adventure', 'Classic'] },
            { title: 'War and Peace', author: 'Leo Tolstoy', year: 1869, genres: ['Historical Fiction', 'Philosophy'] },
            { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, genres: ['Romance', 'Classic'] },
            { title: 'The Alchemist', author: 'Paulo Coelho', year: 1988, genres: ['Adventure', 'Philosophy'] }
        ]);
        const res12 = await axios.get(`${BASE_URL}/books/skip-limit`);
        console.log('12. GET /books/skip-limit:', res12.data);

        // 13. Year integer
        const res13 = await axios.get(`${BASE_URL}/books/year-integer`);
        console.log('13. GET /books/year-integer:', res13.data);

        // 14. Exclude genres
        const res14 = await axios.get(`${BASE_URL}/books/exclude-genres`);
        console.log('14. GET /books/exclude-genres:', res14.data);

        // 15. Delete
        const res15 = await axios.delete(`${BASE_URL}/books/before-year?year=2000`);
        console.log('15. DELETE /books/before-year:', res15.data);

        // 16. Aggregate 1
        const res16 = await axios.get(`${BASE_URL}/books/aggregate1`);
        console.log('16. GET /books/aggregate1:', res16.data);

        // 17. Aggregate 2
        const res17 = await axios.get(`${BASE_URL}/books/aggregate2`);
        console.log('17. GET /books/aggregate2:', res17.data);

        // 18. Aggregate 3
        const res18 = await axios.get(`${BASE_URL}/books/aggregate3`);
        console.log('18. GET /books/aggregate3:', res18.data);

        // 19. Aggregate 4
        const res19 = await axios.get(`${BASE_URL}/books/aggregate4`);
        console.log('19. GET /books/aggregate4:', res19.data);

        console.log('\n--- Populating Extra Data for Dashboard ---');

        // Extra Authors
        await axios.post(`${BASE_URL}/authors`, { name: 'J.K. Rowling', nationality: 'British' });
        await axios.post(`${BASE_URL}/authors`, { name: 'George R.R. Martin', nationality: 'American' });
        await axios.post(`${BASE_URL}/authors`, { name: 'Haruki Murakami', nationality: 'Japanese' });
        await axios.post(`${BASE_URL}/authors`, { name: 'Gabriel García Márquez', nationality: 'Colombian' });
        await axios.post(`${BASE_URL}/authors`, { name: 'Naguib Mahfouz', nationality: 'Egyptian' });

        // Extra Books
        const extraBooks = [
            { title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, genres: ['Fantasy', 'Adventure'] },
            { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', year: 1997, genres: ['Fantasy', 'Young Adult'] },
            { title: 'A Game of Thrones', author: 'George R.R. Martin', year: 1996, genres: ['Fantasy', 'Political Drama'] },
            { title: 'Kafka on the Shore', author: 'Haruki Murakami', year: 2002, genres: ['Magical Realism', 'Fiction'] },
            { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', year: 1967, genres: ['Magical Realism', 'Epic'] },
            { title: 'The Cairo Trilogy', author: 'Naguib Mahfouz', year: 1956, genres: ['Historical Fiction', 'Family Saga'] },
            { title: 'Norwegian Wood', author: 'Haruki Murakami', year: 1987, genres: ['Romance', 'Fiction'] },
            { title: 'Foundation', author: 'Isaac Asimov', year: 1951, genres: ['Science Fiction', 'Space Opera'] },
            { title: 'Dune', author: 'Frank Herbert', year: 1965, genres: ['Science Fiction', 'Political Drama'] },
            { title: '1984', author: 'George Orwell', year: 1949, genres: ['Dystopian', 'Political Fiction'] }
        ];

        const batchRes = await axios.post(`${BASE_URL}/books/batch`, extraBooks);
        console.log('Extra Books Batch inserted:', batchRes.data.insertedCount);

        // Extra Logs
        if (batchRes.data.insertedIds) {
            for (const id of Object.values(batchRes.data.insertedIds).slice(0, 3)) {
                await axios.post(`${BASE_URL}/logs`, { book_id: id, action: 'added_to_inventory' });
            }
        }

        console.log('--- Database Population Complete ---');

    } catch (error) {
        console.error('Test failed:', error.response ? error.response.data : error.message);
    }
}

runTests();
