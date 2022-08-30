import React, { useState, useRef } from "react";
import { dbService, storageService } from "../firbase";
import { deleteDoc, doc, updateDoc, serverTimestamp, } from 'firebase/firestore';
import { deleteObject, ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newAttachment, setNewAttachment] = useState(nweetObj.attachmentUrl);

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
    let newAttachmentUrl = "";
    if (newAttachmentUrl !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, newAttachment, "data_url");
      newAttachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: newNweet,
      createdAt: serverTimestamp(),
      newAttachmentUrl,
    };
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    await updateDoc(desertRef, {
      file: newAttachment,
    });
    setEditing(false);
  };
  
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
    setNewAttachment(value);
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
      setNewAttachment(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };
  const fileInput = useRef();
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
            <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
            <input type="submit" value="Update Nweet" />
            {newAttachment && (
              <div>
                <img src={newAttachment} width="100px" height="100px" alt="img" />
              </div>
            )}
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