// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyA5V96TQnZFtxIH6ycHpYxlTqBDscaV1xo",
    authDomain: "fir-crud-1c2e3.firebaseapp.com",
    projectId: "fir-crud-1c2e3",
    storageBucket: "fir-crud-1c2e3.firebasestorage.app",
    messagingSenderId: "192703514267",
    appId: "1:192703514267:web:58b909ee78159e7c0fe83e",
    measurementId: "G-XN77LGYVDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



//   Create a new post in Firestore
const create_post = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    console.log(name, email);

    try {

        // Add document to Firestore
        const docRef = await addDoc(collection(db, "posts"), {
            name: name,
            email: email
        });
        console.log("Document written with ID: ", docRef.id);
        e.target.reset(); // Reset the form after submission
        get_posts(); // Refresh the list of posts

    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

document.querySelector("form").addEventListener("submit", create_post);

// Get and display posts from Firestore
const get_posts = async () => {

    const result = document.querySelector(".result");
    result.innerHTML = ""; // Clear previous results

    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            result.innerHTML += `<p><strong>${post.name}</strong> - ${post.email}</p> <button onclick="edit_post('${doc.id}')">Edit</button> <button onclick="delete_post('${doc.id}')">Delete</button>`;

            console.log(`${doc.id} => ${post.name} - ${post.email}`);
        });
    } catch (error) {
        console.error("Error fetching posts: ", error);
    }
}
get_posts();


// Delete post function
async function delete_post(id) {
    console.log("Delete post with ID: ", id);

    try {
        await deleteDoc(doc(db, "posts", id));
        console.log("Deleted successfully");
        get_posts(); // Refresh the list
    } catch (error) {
        console.error("Error deleting: ", error);
    }
}
window.delete_post = delete_post;


// Edit post function
const edit_post = async (id) => {
    console.log("Edit post with ID: ", id);

    // fetch data
    try {
        const postRef = doc(db, "posts", id);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            const currentData = postDoc.data();

            // Popup form
            const newName = prompt("Edit Name:", currentData.name);
            const newEmail = prompt("Edit Email:", currentData.email);

            if (newName !== null && newEmail !== null) { // Cancel check
                await updateDoc(postRef, {
                    name: newName,
                    email: newEmail
                });
                console.log("Document updated successfully");
                get_posts(); // Refresh the list
                alert("User updated successfully!");
            }
        }
    } catch (error) {
        console.error("Error: ", error);
        alert("Error updating user");
    }
}

window.edit_post = edit_post;