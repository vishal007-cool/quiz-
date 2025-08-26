// 1. Import the Mongoose library
// Mongoose is a tool that helps us interact with a MongoDB database
// by giving our data structure (schemas) and models.
const mongoose = require('mongoose');

// --- Main Function to Run Our Database Operations ---
// We use an async function to allow us to use 'await' for database operations.
async function main() {

    // 2. Connect to MongoDB
    // Mongoose will connect to the MongoDB server running on your computer.
    // If the 'school_db' database doesn't exist, Mongoose will create it for you.
    try {
        await mongoose.connect('mongodb://localhost:27017/school_db');
        console.log('✅ Successfully connected to MongoDB!');
    } catch (error) {
        console.error('❌ Connection error:', error);
        return; // Exit if we can't connect 
    }

    // 3. Define a Schema
    // A Schema is a blueprint that defines the structure of our documents.
    // Here, we're saying that every "Student" document will have a name, roll number, and major.
    const studentSchema = new mongoose.Schema({
        name: String,
        rollNumber: Number,
        major: String
    });

    // 4. Create a Model
    // A Model is a wrapper for our schema that provides an interface
    // to the database for creating, querying, updating, and deleting documents.
    // The first argument is the singular name of the collection your model is for.
    // Mongoose will automatically look for the plural, lowercased version of your model name (e.g., 'students').
    const Student = mongoose.model('Student', studentSchema);

    // 5. Create a New Document
    // We create a new student document (an instance of the Student model).
    const newStudent = new Student({
        name: 'Raj Kumar',
        rollNumber: 101,
        major: 'Computer Applications'
    });

    // 6. Save the Document to the Database
    // The .save() method is asynchronous, so we 'await' its completion.
    try {
        const savedStudent = await newStudent.save();
        console.log('\n📄 Student saved successfully:', savedStudent);
    } catch(error) {
        // This might fail if a student with the same unique properties already exists, for example.
        console.error('Error saving student:', error.message);
    }

    // 7. Find all Documents in the Collection
    // The .find() method retrieves documents from the collection.
    // Passing an empty object {} means "find all documents".
    try {
        const allStudents = await Student.find({});
        console.log('\n📚 Found all students in the database:');
        console.log(allStudents);
    } catch(error) {
        console.error('Error finding students:', error);
    }

    // 8. Disconnect from the Database
    // It's good practice to close the connection when you're done.
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB.');
}

// --- Run the main function ---
main();

/*
--- How to Run This Script ---

1.  **Save this code** in a file named `simple-mongoose.js`.
2.  **Make sure MongoDB is running** on your computer.
3.  **Open your terminal** and navigate to the directory where you saved the file.
4.  **Install Mongoose** by running the command:
    `npm install mongoose`
5.  **Run the script** with the command:
    `node simple-mongoose.js`

You will see the output in your terminal, showing the connection status, the saved document, and the list of all documents found.
*/
