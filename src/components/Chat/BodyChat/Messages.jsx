import { useEffect, useRef } from "react";
import useGetSocketMessage from "../../../context/hooks/useGetSocketMessage";
import useGetMessage from "../../../context/hooks/useGetMessage";
import Message from "./Message";
import Spinner from "../../Spinner/Spinner";


function Messages() {

  // get messages from API
  const { loading, messages } = useGetMessage();

  

  // listen for incoming messages and send me
  useGetSocketMessage(); // listing incoming messages
  // console.log(messages);

  // auto scroll to last message
  const lastMsgRef = useRef();


  useEffect(() => {
    // scroll to last message
    setTimeout(() => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  }, [messages]);


  return (
    <div className="flex-1  ">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message._id} ref={lastMsgRef}>
                <Message message={message} />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-slate-500">
                Say! Hi to start the conversation
              </p>
            </div>
          )}
        </>
      )}
    </div>

  );
}

export default Messages;
