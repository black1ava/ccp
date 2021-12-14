import React, { useEffect, useState, createContext } from 'react';
import 'amazon-connect-streams';

import CallBlock from './CallBlock';
import Callback from './Callback';
import Alert from './alert/Alert';

const url = 'https://knitpeople.awsapps.com/connect/ccp-v2';
export const AlertContext = createContext();

function App(){

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {

    const container = document.querySelector('#container'); //document.getElementById('container);
  
    window.connect.core.initCCP(container, {
      ccpUrl: url,            // REQUIRED
      loginPopup: true,               // optional, defaults to `true`
      loginPopupAutoClose: true,      // optional, defaults to `true`
      loginOptions: {                 // optional, if provided opens login in new window
        autoClose: true,              // optional, defaults to `false`
        height: 600,                  // optional, defaults to 578
        width: 400,                   // optional, defaults to 433
        top: 0,                       // optional, defaults to 0
        left: 0                       // optional, defaults to 0
      },
      region: "eu-central-1",         // REQUIRED for `CHAT`, optional otherwise
      softphone: {                    // optional
        allowFramedSoftphone: true,   // optional
        disableRingtone: false,       // optional
        ringtoneUrl: "./ringtone.mp3" // optional
      },
      pageOptions: { //optional
        enableAudioDeviceSettings: false, //optional, defaults to 'false'
        enablePhoneTypeSettings: true //optional, defaults to 'true' 
      }  
    });

    window.connect.agent(function (agent) {
      console.log("Subscribing to events for agent " + agent.getName());
      console.log("Agent is currently in status of " + agent.getStatus().name);
      agent.onRefresh(handleAgentRefresh);
    });
    function handleAgentRefresh(agent) {
      var status = agent.getStatus().name;
      console.log("[agent.onRefresh] Agent data refreshed. Agent status is " + status);
  
      //if status == Missed Call, 
      //    set it to Available after 25 seconds."
      //For example -but maybe this is not the best approach
  
      if (status === "MissedCallAgent") { //PLEASE review if "Missed" and "Availble"  are proper codes
          setTimeout(function () {
              agent.setState("Available", {
                  success: function () {
                      console.log(" Agent is now Available");
                  },
                  failure: function (err) { 
                      console.log("Couldn't change Agent status to Available. Maybe already in another call?");
                  }
              });
              ;
          }, 1000);
      }
    }

    let mAgent;
    window.connect.agent(function(agent) {
      mAgent = agent;
    }); 

    function logAgentOut(){
      const now = new Date();
      const hour = now.getHours();

      if(hour >= 21){
        if (mAgent != null) {
            let states = mAgent.getAgentStates();
            // "states" is an array of changeable states. You can filter the desired state to change by name.
            let offlineState = states.filter(state => state.name === "Offline")[0];
                          
            // Change agent state
            mAgent.setState(offlineState, {
            success: function() {
                console.log("SetState succeeded");
            },
            failure: function() {
            console.log("SetState failed");
            }
          });
        }
      }

      window.requestAnimationFrame(logAgentOut);
    }

    window.requestAnimationFrame(logAgentOut);
  }, []);

  function handleAlertShowToggle(){
    setShowAlert(prevState => !prevState);
  }

  return (
    <AlertContext.Provider value={{ toggle: handleAlertShowToggle }}>
      <div className="container">
        <Alert active={ showAlert } toggle={ handleAlertShowToggle }/>
        <div className="content">
          <div className="card" id="container" style={{ width: '400px', height: '600px' }}></div>
          <CallBlock />
          <Callback />
        </div>
      </div>
    </AlertContext.Provider>
  );
}

export default App;