import { use } from "react";
import { createContext, useState, useContext } from "react";

// // Tạo Context
// export const AuthContext = createContext({
//     userName: "",
//     email: "",
//     picture: null,
//     facebookId: null,
//     googleId: null,
// });

// Tạo Context
export const AuthContext = createContext(null); // Đặt giá trị mặc định là null

// Tạo AuthWrapprer để bọc 
export const AuthWrapper = ({ children }) => {


    const storedUser = localStorage.getItem("user");


    const [user, setUser] = useState({
        userName: "",
        email: "",
        picture: null,
        facebookId: null,
        googleId: null,
    });



//     const [user, setUser] = useState(() => {
//     try {
//         return storedUser ? JSON.parse(storedUser) : {
//             userName: "",
//             email: "",
//             picture: null,
//             facebookId: null,
//             googleId: null,
//         };
//     } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//         return {
//             userName: "",
//             email: "",
//             picture: null,
//             facebookId: null,
//             googleId: null,
//         };
//     }
// });

//     // Chỉ cập nhật localStorage nếu user thay đổi
//     useEffect(() => {
//         if (user) {
//             localStorage.setItem("user", JSON.stringify(user));
//         }
//     }, [user]);

//     console.log("Current user:", user);

//     return (
//         <AuthContext.Provider value={{ user, setUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Custom Hook để sử dụng AuthContext dễ dàng hơn
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };
















    console.log("check set user:", setUser)
    // console.log("check use ", user)

    return (
        <>
            <AuthContext.Provider value={{ user, setUser }}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

// Custom Hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
