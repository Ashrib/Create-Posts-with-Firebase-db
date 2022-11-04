import { useState, useEffect } from "react";
import './App.css';
import profilePic from "./images/profile.jpg";
// import axios from 'axios';
import moment from 'moment';
import { initializeApp } from "firebase/app";
import {
   getFirestore, collection, addDoc, 
   getDocs, doc, onSnapshot, query,
   updateDoc, serverTimestamp, orderBy, limit,
   deleteDoc 
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
  const [editing, setEditing] = useState(null);
  const [editingText, setEditingText] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe;
    const getRealTimeData = async () => {
      const q = query(collection(db, "posts"), orderBy("createdOn", "desc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allPosts = [];
      querySnapshot.forEach((doc) => {
        allPosts.push({...doc.data(), id:doc.id});
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
    document.querySelector(".post-input").value = "";
    console.log(postText);
    if(postText === ""){
        alert("Fill some text");
    }else{
      try {
        const docRef = await addDoc(collection(db, "posts"), {
          text: postText,
          createdOn: serverTimestamp(),
          // createdOn: new Date().getTime(),
          // postId: id
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    
  }
  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };
  const editPost = async (postId, updatedText) => {
    await updateDoc(doc(db, "posts", postId), {
      text: updatedText
    });
  };


  const viewOptions = (e) => {
    console.log(e)
    if(document.querySelector(".options-box").style.display === "flex"){
      document.querySelector(".options-box").style.display = "none"
    }else{

      document.querySelector(".options-box").style.display = "flex"
    }
  }

  return (
      <>
    <div className="container">
      {/* post create box */}
      <div className="create-box">
      <form onSubmit={createPost}>
        <input
        className="post-input"
          type="text"
          placeholder="What's in your mind...."
          onChange={(e) => {
            setPostText(e.target.value)
          }}
        />
        <button type="submit">post</button>
      </form>
      </div>
      {/* post create box end*/}

      <div className="allposts-box">
        {/* {(isLoading) ? "loading..." : ""} */}

        {posts.map((eachPost, i) => (
          <div className="post" key={i}>
            <div className="post-head">
              <div className="post-info">
              <img src={profilePic} alt="profile" />
              <div className="post-head-texts">
                <span className="user-name">Asharib Ali</span>
                <span className="post-time">
                  {
                  moment((eachPost?.createdOn?.seconds) ? 
                  eachPost?.createdOn?.seconds*1000 : 
                  undefined)
                    .format('Do MMMM, h:mm a')
                  }
                </span>
              </div>
              </div>
              <span className="post-options"  onClick={() =>{viewOptions(eachPost)}}>g
              <div className="options-box">
                <span className="option" onClick={()=> {
                deletePost(eachPost?.id);
                }}>delete</span>
                <span className="option" onClick={()=> {
                const updatedState = posts.map(eachItem => {
                  if(eachItem?.id === eachPost?.id){
                    return {...eachItem, isEditing: true}
                  }else{
                    return eachItem
                  }
                })
                setPosts(updatedState)
                }}>edit</span>
              </div>
              </span>
            </div>
            <h3>{(eachPost.isEditing) ? 
            <div>
              <form >
              <input type="text" value={editingText}
              onChange={(e)=>{
                setEditingText(e.target.value)
              }}
              />

              </form>
              <button onClick={(postId)=> {
                setEditing(postId)
                // const updatedState = posts.map(eachItem => {
                //   if(eachItem?.id === eachPost?.id){
                //     return {...eachItem, isEditing: !eachItem.isEditing}
                //   }else{
                //     return eachItem
                //   }
                // })
                // setPosts(updatedState)
              }}>ok</button>
              </div>:
            eachPost?.text}</h3>



             

          </div>
        ))}
      </div>

    </div>
    </>
  );
}

export default App;