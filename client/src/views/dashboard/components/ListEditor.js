import "../styles/ListEditor.css";

import React, { Component } from "react";
import { useDispatch } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import shortid from "shortid";

function ListEditor(props) {
  const dispatch = useDispatch();
  
  const ref = React.createRef();
  
  const onEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      props.saveList();
    }
  };
 


  const { title, handleChangeTitle, deleteList } = props;
    return (
      <div className="List-Title-Edit" ref={ref}>
        <TextareaAutosize
          autoFocus
          className="List-Title-Textarea"
          placeholder="Enter list title..."
          value={title}
          onChange={handleChangeTitle}
          onKeyDown={onEnter}
          style={{ width: deleteList ? 220 : 245 }}
        />
        {deleteList && <ion-icon name="trash" onClick={deleteList} />}
      </div>
    );
  
}

export default ListEditor;
