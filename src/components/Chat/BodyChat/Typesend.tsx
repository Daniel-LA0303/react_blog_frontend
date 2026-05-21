import { useState } from "react";
import useSendMessage from "../../../context/hooks/useSendMessage";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import useGlobalDataContext from "../../../context/hooks/useGlobalDataContext";


function Typesend() {

  // we set message state
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);

  // we get loading and sendMessages from the custom hook
  const { loading, sendMessages } = useSendMessage();

  const { globalData } = useGlobalDataContext();

  // we handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (sending || !message.trim()) return; // evita doble envío
    setSending(true);
    await sendMessages(message);
    setMessage("");
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md pb-1 px-1">
      <div className={`
          flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-md shadow
          ${globalData.themeGlobal ? ' bgt-light text-black' : 'bgt-dark  text-white'}
        `}>

        {/* Input */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Type here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`
              flex items-center w-full py-1 px-2 rounded-xl grow outline-none text-base sm:text-base
              ${globalData.themeGlobal ? ' bgt-light text-black placeholder-gray-500' : 'bgt-dark text-white placeholder-gray-400'}
              `}
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 rounded-lg duration-300 flex items-center justify-center px-2 sm:px-3 py-2 text-white"
        >
          <SendOutlinedIcon />
        </button>
      </div>
    </form>


  );
}

export default Typesend;
