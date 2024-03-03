import React, { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { Country } from "country-state-city";
import CachedIcon from "@mui/icons-material/Cached";
import SingleUserDetails from "./SingleUserDetails";
import "./users.css";
import { allLanguages, allskills, fetchRating } from "../../Utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { setLoading } from "../../redux/AuthReducers/AuthReducer";

import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import useWindowDimensions from "../Common/WindowSize";
import { Search } from "@mui/icons-material";
import { getAllHistoricalConversations } from "../../redux/Conversationreducer/ConversationReducer";
import AddConversationPopup from "../Common/AddConversationPopup";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const tabs = ["Name", "Skills", "Country", "Language", "Other"];
const AllUsers = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const totalRoles = useSelector((state) => state.auth.totalRoles);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [IsAdmin, setIsAdmin] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState([]);
  const [tag, settag] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const [filledStars, setFilledStars] = useState(0);
  const [search, setSearch] = useState("");
  const [receiverRole, setreceiverRole] = useState("");
  const [pitchSendTo, setPitchSendTo] = useState("");
  const [filters, setFilters] = useState({
    role: [],
    languagesKnown: [],
    skills: [],
    email: [],
    state: [],
    country: [],
    userColleges: [],
    verification: false,
    userName: [],
    review: 0,
  });
  useEffect(() => {
    setFilters((prev) => ({ ...prev, review: filledStars }));
  }, [filledStars]);
  // const [universities, setUniversities] = useState([])
  // useEffect(() => {
  //     axios.get('http://universities.hipolabs.com/search').then(res => {
  //         setUniversities(res.data)
  //     })
  // }, [])
  useEffect(() => {
    dispatch(setLoading({ visible: "yes" }));
    ApiServices.getAllUsers({ type: "" }).then((res) => {
      // console.log(res.data);
      setData(res.data);
      dispatch(setLoading({ visible: "no" }));
    });
  }, []);

  const [isSpinning, setSpinning] = useState(false);
  const handleReloadClick = () => {
    setSpinning(true);
    setFilters({
      role: [],
      email: [],
      state: [],
      country: [],
      skills: [],
      languagesKnown: [],
      userColleges: [],
      verification: false,
      userName: [],
      review: 0,
    });
    setFilledStars(0);
  };
  const [connectStatus, setConnectStatus] = useState({});
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const historicalConversations = useSelector(
    (state) => state.conv.historicalConversations
  );
  useEffect(() => {
    dispatch(getAllHistoricalConversations(user_id));
  }, []);

  useEffect(() => {
    // console.log(historicalConversations.reduce(
    //   (prev, cur) => ({
    //     ...prev,
    //     [cur.members.filter((f) => f._id !== user_id)[0]._id]: {
    //       status: cur.status,
    //       id: cur._id,
    //     },
    //   }),
    //   {}
    // ));
    setConnectStatus(
      historicalConversations.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.members.filter((f) => f._id !== user_id)[0]?._id]: {
            status: cur.status,
            id: cur._id,
          },
        }),
        {}
      )
    );
  }, [historicalConversations]);
  return (
    <>
      <div className="users-main-box">
        {width < 770 && (
          <div className="user-nav-bar">
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <button className="nav-bar-buttons">
              <i class="fa fa-sort-amount-desc"></i>
              Sort by
            </button> */}
              <input
                type="text"
                style={{ marginTop: "2px", marginLeft: "8px", width: "150px" }}
                className="nav-bar-buttons"
                value={search}
                placeholder="Search user"
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value !== "") {
                    setFilteredData(
                      filteredData.filter((f) => {
                        return f.userName.includes(e.target.value);
                      })
                    );
                  } else {
                    setFilteredData(data);
                  }
                }}
                label="Search.."
                variant="standard"
              />
            </div>
          </div>
        )}
        <div className="usersWrapper">
          <div className="user-cards-panel">
            {width > 770 && (
              <Box
                className="search-box"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 3,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Search sx={{ color: "action.active", width: 20, mx: 1 }} />
                <input
                  className="search-input"
                  style={{ height: 10, padding: 10, margin: 0 }}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setFilteredData(
                      e.target.value !== ""
                        ? filteredData.filter((f) =>
                            f.userName
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          )
                        : data
                    );
                  }}
                  placeholder="Search Users.."
                  variant="standard"
                />
              </Box>
            )}
            <div className="userscontainer">
              {filteredData.length > 0 ? (
                filteredData?.map((d) => (
                  <SingleUserDetails
                    d={d}
                    setIsAdmin={setIsAdmin}
                    connectStatus={connectStatus}
                    setPitchSendTo={setPitchSendTo}
                    pitchSendTo={pitchSendTo}
                    receiverRole={receiverRole}
                    setreceiverRole={setreceiverRole}
                  />
                ))
              ) : (
                <div
                  className="no-users"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src="/Search.gif" />
                  <div>No users available</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <AddConversationPopup
          receiverId={pitchSendTo}
          setReceiverId={setPitchSendTo}
          receiverRole={receiverRole}
          IsAdmin={IsAdmin}
        />
      </div>
    </>
  );
};

export default AllUsers;
