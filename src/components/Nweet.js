import React, { useState } from "react";
import { dbService, storageService } from "../firbase";
import { deleteDoc, doc, updateDoc, } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  // const [imgAttachment, setImgAttachment] = useState(nweetObj.attachmentUrl);

  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const desertRef = ref(storageService, nweetObj.attachmentUrl);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      try {
        await deleteDoc(NweetTextRef);
        window.alert("Success to Delete");
        if (nweetObj.attachmentUrl !== "") {
          await deleteObject(desertRef);
        }
      } catch (error) {
        window.alert("Fail to Delete");
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };
  
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  // const onImgChange = (event) => {
  //   const {
  //     target: { files },
  //   } = event;
  //   const theFile = files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = (finishedEvent) => {
  //     const {
  //       currentTarget: { result },
  //     } = finishedEvent;
  //     setImgAttachment(result);
  //   };
  //   if (theFile) {
  //   reader.readAsDataURL(theFile);
  //   }
  // };
  // const fileInput = useRef();
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={onChange}
            />
            {/* <input
              type="file"
              accept="image/*"
              onChange={onImgChange}
              value={imgAttachment}
              ref={fileInput}
            /> */}
            <input type="submit" value="Update Nweet" />
            {/* {imgAttachment && (
              <div>
                <img src={imgAttachment} width="100px" height="100px" alt="img" />
              </div>
            )} */}
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && (
          <img src={nweetObj.attachmentUrl} width="100px" height="100px" alt="img" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;