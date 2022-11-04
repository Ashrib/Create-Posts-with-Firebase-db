import { useState, useEffect } from "react";
import './App.css';
// import axios from 'axios';
import moment from 'moment';
import { initializeApp } from "firebase/app";
import {
   getFirestore, collection, addDoc, 
   getDocs, doc, onSnapshot, query 
  } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyC0qVw4uBTksLcf2gP-Eci_Q6jYQfBhAJo",
  authDomain: "posts-firebase-database.firebaseapp.com",
  projectId: "posts-firebase-database",
  storageBucket: "posts-firebase-database.appspot.com",
  messagingSenderId: "136045010484",
  appId: "1:136045010484:web:cc6423cacaaf7077387461",
  measurementId: "G-EEF0BB1Z3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function App() {

  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);




  useEffect(() => {
      const getData = async() => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>` , doc.data());
        setPosts((prev)=> {
          let newArray = [...prev, doc.data()]
          return newArray
        });
      });
    }
    // getData();
    let unsubscribe;
    const getRealTimeData = async () => {
      const q = query(collection(db, "posts"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allPosts = [];
      querySnapshot.forEach((doc) => {
        allPosts.push(doc.data());
      });
      setPosts(allPosts);
      console.log("Posts: ", allPosts);
    });
    }
    getRealTimeData();


    ///unsubscribtion
    return () => {
    unsubscribe();
    }
    
  }, [])




  const createPost = async (e) => {
    e.preventDefault();

    console.log(postText);
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        text: postText,
        createdOn: new Date().getTime(),
        // postId: id
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    
  }


  return (
    <div>

      <form onSubmit={createPost}>
        <input
          type="text"
          placeholder="What's in your mind...."
          onChange={(e) => {
            setPostText(e.target.value)
          }}
        />
        <button type="submit">post</button>
      </form>

      <div>
        {/* {(isLoading) ? "loading..." : ""} */}

        {posts.map((eachPost, i) => (
          <div className="post" key={i}>

             
            <h3>{eachPost?.text}</h3>

            <span>{
              moment(eachPost?.createdOn)
                .format('Do MMMM, h:mm a')
            }</span>


             

          </div>
        ))}
      </div>

    </div>
  );
}

export default App;