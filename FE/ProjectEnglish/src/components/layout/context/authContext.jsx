import { use, useEffect } from "react";
import { createContext, useState, useContext } from "react";
import authService from "../../../service/authService";


// Tạo Context
export const AuthContext = createContext({
    userInfor: {
        userName: "",
        email: "",
        address: "",
        age: "",
        phone: "",
        gender: "",
        picture: null,
        facebookId: null,
        googleId: null,
        userId: "",
        role: "",
    },
    setUser: () => { },
    isAppLoading: false,
    setIsAppLoading: () => { },
});

// // Tạo Context
// export const AuthContext = createContext(null); // Đặt giá trị mặc định là null

// Tạo AuthWrapprer để bọc 
export const AuthWrapper = (props) => {
    const [userInfor, setUser] = useState(null); // Bắt đầu với null
    const [isAppLoading, setIsAppLoading] = useState(true);

    const fetchUser = async () => {
        const userData = await authService.getUserInfor();
        if (userData.returnCode==1) {
            setUser({
                userName: userData.user.userName,
                email: userData.user.email,
                address: userData.user.address,
                age: userData.user.age,
                phone: userData.user.phone,
                gender: userData.user.gender,
                picture: userData.user.picture,
                facebookId: userData.user.facebookId,
                googleId: userData.user.googleId,
                userId: userData.user.userID,
                role: userData.user.role,
            });
 
            
        } else {
            setUser(null); // Token hết hạn hoặc lỗi => user là null
        }
        setIsAppLoading(false);
    };

    useEffect(() => {
        setIsAppLoading(true);
        const timer = setTimeout(() => {
        fetchUser();
        }, 500);

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, []);

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

export const useAuth = () => useContext(AuthContext);