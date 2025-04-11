import axios from "axios";

 const API_URL = import.meta.env.VITE_API_URL;

 const getMessages = async () => {
    const response = await axios.get(`${API_URL}/chat/GetListMessage`);
   //  console.log("response list message",response.data);
    return response.data;
 }

 const getMoreMessages = async (lastMessageTime) => {
   const response = await axios.get(`${API_URL}/chat/GetMoreMessages`, {
       params: { lastMessageTime }
   });
   return response.data;
}
 
 export { getMessages, getMoreMessages };
