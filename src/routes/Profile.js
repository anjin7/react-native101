import React from "react";
import { getAuth } from "firebase/auth"
import { useHistory } from "react-router-dom";

function Profile() {
  const history = useHistory();
  const auth = getAuth();
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;