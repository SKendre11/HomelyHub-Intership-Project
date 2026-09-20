import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updatePassword } from "../../store/User/user-action";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (!passwordCurrent || !password || !passwordConfirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("New passwords do not match");
      return;
    }

    dispatch(updatePassword({ passwordCurrent, password, passwordConfirm }));
    toast.success("Password updated successfully");
    navigate("/profile");
  };


  return (
    <>

      <div className="row wrapper">
        <div className="col-10 col-lg-5 updateprofile">
          <form onSubmit={submitHandler}>
            <h1 className="password_title">Update Password</h1>
            <div className="form-group">
              <label htmlFor="passwordCurrent_field">Current Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_confirm_field">
                New Password Confirm
              </label>
              <input
                type="password"
                id="new_password_confirm_field"
                className="form-control"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-block py-3 password-btn"

            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
