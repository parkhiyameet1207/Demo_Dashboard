import "../styles/AddList.css";

import React, { Component, useState } from "react";
import { connect } from "react-redux";
import ListEditor from "./ListEditor";
import shortid from "shortid";
import EditButtons from "./EditButtons";
import axios from "axios";

function AddList(props) {
  const [state, setState] = useState({
    title: "",
  })

  const { title } = state;

  const handleChangeTitle = e => setState({ title: e.target.value });

  const createList = async () => {
    const { dispatch } = props;
    const listId = shortid.generate()
    let data = { listId, title }
    
    try {
      const response = await axios.post('http://localhost:5000/api/board/addlist', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
      dispatch({
        type: "ADD_LIST",
        payload: { listId: response.data._id, listTitle: response.data.title }
      });

    } catch (error) {
      console.log(error);
    }
    props.toggleAddingList();


  };
  const { toggleAddingList } = props;



  return (
    <div className="Add-List-Editor">
      <ListEditor
        title={title}
        handleChangeTitle={handleChangeTitle}
        onClickOutside={toggleAddingList}
        saveList={createList}
      />

      <EditButtons
        handleSave={createList}
        saveLabel={"Add list"}
        handleCancel={toggleAddingList}
      />
    </div>
  );
}

export default connect()(AddList);
