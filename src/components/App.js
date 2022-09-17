import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../firbase";
import { updateProfile } from "firebase/auth";
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* border: 1px solid blue; */
`;

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (user) => updateProfile(user, { displayName: user.displayName }),
        });
      }else {
        setUserObj(null);
      } 
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (user) => updateProfile(user, { displayName: user.displayName }),
    });
  };
  return (
    <Container>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </Container>
  );
}

export default App;