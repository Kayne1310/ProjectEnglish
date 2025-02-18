import { use } from "react";
import { createContext, useState, useContext } from "react";


// Tạo Context
export const AuthContext = createContext({
    userName: "",
    email: "",
    picture: null,
    facebookId: null,
    googleId: null,
});

// // Tạo Context
// export const AuthContext = createContext(null); // Đặt giá trị mặc định là null

// Tạo AuthWrapprer để bọc 
export const AuthWrapper = (props) => {

    const [userInfor, setUser] = useState({
        userName: "",
        email: "",
        picture: null,
        facebookId: null,
        googleId: null,
    });
    const [isAppLoading, setIsAppLoading] = useState(true);

    return (
        <>
            <AuthContext.Provider value={{
                userInfor, setUser,
                isAppLoading, setIsAppLoading
            }}>
                {props.children}
            </AuthContext.Provider>
        </>
    );
};

