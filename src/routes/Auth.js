import React from "react";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import AuthForm from '../components/AuthForm';
import styled from 'styled-components';

const Container = styled.div`
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid red; */
`;

function Auth() {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const auth = getAuth();
    const data = await signInWithPopup(auth, provider);
    console.log(data);
  };
  return (
    <Container>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </Container>
  )
}

export default Auth;