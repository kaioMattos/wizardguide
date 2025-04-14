import React from 'react';
import { List } from '@material-ui/core';
import EachItem from "../../components/EachItem";
import DeleteIcon from "@material-ui/icons/Delete";
import UndoIcon from '@mui/icons-material/Undo';

export default function CustomList({aValues, haveIconAction, activeItems, toDoDeleteHandler, icon, propKey}) {
  return (
    <List style={{
      width: '100%',
      position: 'relative',
      overflow: 'auto',
      maxHeight: 250,
    }}>
      {aValues
        .filter((item) => (item.status === activeItems))
        .map((item) => {
          return (
            <EachItem

              iconButtonHandler={haveIconAction ?
                activeItems ? <DeleteIcon color="error" /> : <UndoIcon color="primary" /> : ''
              }
              toDoDeleteHandler={toDoDeleteHandler}
              key={item[propKey]}
              oItem={item}
              icon={icon}
            />

          );
        })}
    </List>
  );
}
