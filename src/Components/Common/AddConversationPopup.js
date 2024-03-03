import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { Dialog, DialogContent } from "@mui/material";
import { gridCSS } from "../CommonStyles";
import { getAllHistoricalConversations } from "../../redux/Conversationreducer/ConversationReducer";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { isParent } from "../../Utils";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import "./AddConv.css";
import { itPositions, socket_io } from "../../Utils";
import useWindowDimensions from "./WindowSize";
const AddConversationPopup = ({
  receiverId,
  setReceiverId,
  receiverRole,
  IsAdmin,
}) => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);
  const [open, setOpen] = useState(false);
  const { email, role, verification, user_id } = useSelector(
    (state) => state.auth.loginDetails
  );
  const userPitches = useSelector((state) => state.conv.userLivePitches);
  const [selectedpitchId, setselectedpitchId] = useState("");
  const decidingRolesMessage = async (receiverId) => {
    if (email === process.env.REACT_APP_ADMIN_MAIL) {
      await ApiServices.directConversationCreation({
        userId: user_id,
        receiverId: receiverId,
        senderId: user_id,
        status: "approved",
      })
        .then((res) => {
          dispatch(getAllHistoricalConversations(user_id));
          dispatch(
            setToast({
              message: res.data,
              bgColor: ToastColors.success,
              visible: "yes",
            })
          );
          setOpen(false);
          setReceiverId("");
          socket.current.emit("sendNotification", {
            senderId: user_id,
            receiverId: receiverId,
          });
          document
            .getElementsByClassName("newConversation")[0]
            ?.classList?.remove("show");
        })
        .catch((err) => {
          // console.log(err);
          dispatch(
            setToast({
              message: `Error Occured`,
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
          setReceiverId("");
        });
    } else {
      await ApiServices.directConversationCreation({
        userId: user_id,
        receiverId: receiverId,
        senderId: user_id,
        status: "pending",
      })
        .then((res) => {
          dispatch(getAllHistoricalConversations(user_id));
          dispatch(
            setToast({
              message: res.data,
              bgColor: ToastColors.success,
              visible: "yes",
            })
          );
          setOpen(false);
          setReceiverId("");
          socket.current.emit("sendNotification", {
            senderId: user_id,
            receiverId: receiverId,
          });
          document
            .getElementsByClassName("newConversation")[0]
            ?.classList?.remove("show");
        })
        .catch((err) => {
          // console.log(err);
          dispatch(
            setToast({
              message: `Error Occured`,
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
          setReceiverId("");
        });
    }
  };
  useEffect(() => {
    if (receiverId !== "") {
      decidingRolesMessage(receiverId);
    }
  }, [receiverId]);

  return (
   <></>
  );
};

export default AddConversationPopup;
