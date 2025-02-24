import React, { createContext, useState } from 'react'
// Initiate Context
const userContext = createContext();
// Provide Context
export const UserProvider = ({ children }) => {
  const [userId, setUserID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState('');
//   const [age, setAge] = useState('');
//   const [address, setAddress] = useState('');
  return (
    <userContext.Provider value={{ userId,name, email, picture,setUserID,setEmail,setName,setPicture }}>
      {children}
    </userContext.Provider>
  )
}

export default userContext;
