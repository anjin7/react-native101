import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from '../firbase';
import { getAuth, updateProfile } from "firebase/auth";
// import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot, query, doc, updateDoc, serverTimestamp, } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

function Profile({ refreshUser, userObj }) {
  const history = useHistory();
  const [profile, setProfile] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  // const [profileImg, setProfileImg] = useState("");
  const auth = getAuth();
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };
  const DisplayNameRef = doc(dbService,"profile", `${userObj.displayName}`)

    useEffect(() => {
    const q = query(
      collection(dbService, "profile"),
    );
    onSnapshot(q, (snapshot) => {
      const profileArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfile(profileArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName){
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      refreshUser();
    };
    // let attachmentUrl = "";
    // if (profileImg !== "") {
    //   const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    //   const response = await uploadString(attachmentRef, profileImg, "data_url");
    //   attachmentUrl = await getDownloadURL(response.ref);
    // }
    const profileObj = {
      text: newDisplayName,
      creatorId: userObj.uid,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(dbService, "profile"), profileObj);
    await updateDoc(collection(dbService,"profile"), {
      text: newDisplayName,
    });
    setNewDisplayName(newDisplayName);
    // setProfileImg("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  //   const onFileChange = (event) => {
  //   const {
  //     target: { files },
  //   } = event;
  //   const theFile = files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = (finishedEvent) => {
  //     const {
  //       currentTarget: { result },
  //     } = finishedEvent;
  //     setProfileImg(result);
  //   };
  //   if (theFile) {
  //     reader.readAsDataURL(theFile);
  //   }
  // };
  // const onClearAttachment = () => {
  //   setProfileImg("")
  // };
  // const fileInput = useRef();
  console.log(profile);
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
        {/* <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} /> */}
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
        {/* {profileImg && (
          <div>
            <img src={profileImg} width="100px" height="100px" alt="profile-img" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )} */}
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;