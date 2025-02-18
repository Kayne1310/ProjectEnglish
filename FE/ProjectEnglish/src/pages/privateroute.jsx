import { useContext } from "react";
import { AuthContext } from "../components/layout/context/authContext";
import { Navigate } from "react-router-dom";
import { Result } from "antd";
import { Button } from "react-bootstrap";

const PrivateRoute = (props) => {

    const { userInfor } = useContext(AuthContext);

    if (userInfor&&userInfor.email) {
        return (
            <>
            {props.children}
            </>
        )
    }

    return (
        <>
           {/* <Navigate to="/loginuser" replace /> */}
           <Result
            status="403"
            title="403"
            subTitle="Bạn cần đăng nhập để truy cập trang này."
            extra={<Button type="primary">Back Home</Button>}
        />
        </>
    )

}

export default PrivateRoute;