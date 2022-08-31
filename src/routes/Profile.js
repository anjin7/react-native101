import React, { useState, } from "react";
import { useHistory } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";

function Profile({ userObj }) {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhoto, setNewPhoto] = useState()
  const auth = getAuth();
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
        photoURL: newPhoto,
      });
    }
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
      setNewPhoto(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

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
        
        {attachment && (
          <div>
            <img src={attachment} width="100px" height="100px" alt="img" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;