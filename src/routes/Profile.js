import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { dbService, storageService } from '../firbase';
import { getAuth, updateProfile } from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot, query, } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function Profile({ userObj }) {
  const history = useHistory();
  const [profile, setProfile] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profileImg, setProfileImg] = useState("");
  const auth = getAuth();
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };
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
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
        photoURL: profileImg,
      });
    }
    let attachmentUrl = "";
    if (profileImg !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, profileImg, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const profileObj = {
      text: newDisplayName,
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "profile"), profileObj);
    setNewDisplayName("");
    setProfileImg("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
    const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setProfileImg(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };
  const onClearAttachment = () => {
    setProfileImg("")
  };
  const fileInput = useRef();

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
        <input type="submit" value="Update Profile" />
        {profileImg && (
          <div>
            <img src={profileImg} width="100px" height="100px" alt="profile-img" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;