import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentCard from '../../components/NotificationsCards/CommentCard';
import Spinner from '../../components/Spinner/Spinner';
import { comment } from 'postcss';
import FollowCard from '../../components/NotificationsCards/FollowCard';

const Notifications = () => {

    const params = useParams();

    const link = useSelector(state => state.posts.linkBaseBackend);
    const theme = useSelector(state => state.posts.themeW);

    const [activeTab, setActiveTab] = useState("1");
    const [tabM, setTabM] = useState(false);
    const [notifications, setNotifications] = useState({
      comments: [],
      replyComments: [],
      like: [],
      follow: [],
    });
    const [loading, setLoading] = useState(true);

    // const {comments, replyComments, like, follow} = notifications;

    useEffect(() => {
      
      const getUserNotifications = async() => {
        try {
          const res = await axios.get(`${link}/users/user-notifications/${params.id}`);
          setNotifications({
            comments: res.data.comment,
            replyComments: res.data.reply,
            like: res.data.like,
            follow: res.data.follow,
          });
          setLoading(false);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      }

      getUserNotifications();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
      };



  return (
    <div>
      <Sidebar />
      {
        loading ? <Spinner /> : 
        <div class="w-full md:w-11/12 lg:w-11/12 xl:w-8/12 mx-auto mb-10">
        <aside className="w-full text-white  bg-[#313131] border-l border-[#525252] ">
          <TabContext value={activeTab}>
            {/* <div className="icon-container"> */}
            <TabList
              // className={tabM ? '' : 'horizontal-scroll'}
              variant="scrollable"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#408b8e",
                //   display: "flex",
                //   justifyContent: "center", 
                },
              }}
              
              aria-label="Tabs"
              onChange={handleTabChange}
              orientation={"horizontal"}
              sx={{
                "& .Mui-selected": {
                  color: "#408b8e",
                },
                display: "flex",
                justifyContent: "center",
              }}
              textColor="#408b8e"
              classes={{ indicator: "#408b8e" }}
            >
              <Tab label="Comments" value="1" />
              <Tab label="Responses" value="2" />
              <Tab label="Likes" value="3" />
              <Tab label="Follows" value="4" />
            </TabList>
            {/* </div> */}
          </TabContext>
        </aside>

        <div className='grid grid-cols-5 gap-4'>
          <div className='col-span-5 md:col-span-1 xl:col-span-1'>
            <p className={`${theme ? 'text-black' : ' text-white'} ml-5 md:ml-0  mt-5 font-bold text-2xl`}>Notifications</p>
          </div>
          <div className="col-span-5 md:col-span-4 xl:col-span-4">
            <TabContext value={activeTab}>
              <TabPanel value="1">
                <div className="  text-white ">
                  <div
                  //   className={` grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 grid  gap-4`}
                  >
                    {
                      notifications.comments.map((notification) => (
                        <CommentCard 
                          key={notification._id}
                          notification={notification} 
                        />
                      ))
                    }
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="   text-white">
                  <div
                  //   className={` grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 grid  gap-4`}
                  >
                    {
                      notifications.replyComments.map((notification) => (
                        <CommentCard 
                          key={notification._id}
                          notification={notification} 
                        />
                      ))
                    }
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="3">
                <div className="  text-white">
                  <div
                  //   className={` grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 grid  gap-4`}
                  >
                    {
                      notifications.like.map((notification) => (
                        <CommentCard 
                          key={notification._id}
                          notification={notification} 
                        />
                      ))
                    }
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="4">
                <div className="  text-white">
                  <div
                  //   className={` grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 grid  gap-4`}
                  >
                    {
                      notifications.follow.map((notification) => (
                        <FollowCard 
                          key={notification._id}
                          notification={notification} 
                        />
                      ))
                    }
                  </div>
                </div>
              </TabPanel>
            </TabContext>
          </div>
        </div>
      </div>
      }
    </div>
  );
}

export default Notifications