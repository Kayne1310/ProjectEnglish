import ModalCreactUser from "./ModalCreacteUser";
import "./ManageUsers.scss";

const ManageUsers = () => {
  return (
    <div className="user-container">
      <div className="title">Manage User</div>
      <div className="user-content">
        <div>
          <button>Add new user</button>
        </div>
        <div>
          table user
          {/* <ModalCreactUser /> */}
        
      </div>

      <ModalCreactUser />
      </div>
    </div>
  );
};

export default ManageUsers;
