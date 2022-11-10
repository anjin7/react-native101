import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from '../firbase';
import { getAuth, updateProfile } from "firebase/auth";
import { addDoc, doc,collection, onSnapshot, query,  updateDoc, serverTimestamp, } from "firebase/firestore";


function Profile({ refreshUser, userObj }) {
  const history = useHistory();
  // const [profile, setProfile] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.id);
  const auth = getAuth();
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };
  const DisplayNameRef = doc(dbService, "profile", `${userObj.id}`)

    useEffect(() => {
    const q = query(
      collection(dbService, "profile"),
    );
    onSnapshot(q, (snapshot) => {
      const profileArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewDisplayName(profileArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();    
    if(userObj.displayName !== newDisplayName){
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      refreshUser();
    };
    // const profileObj = {
    //   text: newDisplayName,
    //   creatorId: userObj.uid,
    //   createdAt: serverTimestamp(),
    // };
    // await addDoc(collection(dbService, "profile"), profileObj);
    // await updateDoc(collection(dbService, "profile"), profileObj);
    // await updateDoc(collection(dbService, "profile"), {
    //   text: newDisplayName,
    // });
    setNewDisplayName(newDisplayName);

  };
  const onChange = ({target:{value}}) => {
    setNewDisplayName(value)
  };
  // console.log(profile);
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          required
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;