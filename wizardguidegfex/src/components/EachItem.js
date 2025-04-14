import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FolderIcon from "@material-ui/icons/Folder";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import Divider from '@mui/material/Divider';

const EachItem = ({ oItem, toDoDeleteHandler, icon, iconButtonHandler }) => {
  return (
    <>
    <ListItem >
       <ListItemIcon style={{color: 'rgb(0,98,152)'}}>
          {icon}
        </ListItemIcon>
      <ListItemText slotProps={{ primary: {fontSize: '0.9rem'} }} primary={oItem.text} />
      <ListItemSecondaryAction>     
        <IconButton       
          onClick={() => toDoDeleteHandler(oItem)}
          edge="end"
          aria-label="delete"
        >
          {iconButtonHandler}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider variant="inset" component="li" />
    </>
  );
};

export default EachItem;
