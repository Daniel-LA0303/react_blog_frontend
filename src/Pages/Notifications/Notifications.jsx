import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";

const Notifications = () => {

    const [activeTab, setActiveTab] = useState("1");
    const [tabM, setTabM] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
      };

  return (
    <div>
      <Sidebar />
      <div class="">
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
              <Tab label="Follows" value="2" />
              <Tab label="Responses" value="3" />
            </TabList>
            {/* </div> */}
          </TabContext>
        </aside>
        <div className="">
          <TabContext value={activeTab}>
            <TabPanel value="1">
              <div className="  text-white ">
                <div
                //   className={` grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 grid  gap-4`}
                >
                  Content1
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className="   text-white">
                <div
                //   className={` grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 grid  gap-4`}
                >
                  conten 2
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="  text-white">
                <div
                //   className={` grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 grid  gap-4`}
                >
                  content 3
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </div>
  );
}

export default Notifications