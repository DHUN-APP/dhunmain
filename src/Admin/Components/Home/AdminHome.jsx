import React from "react";
import { useAuth } from "../../../Context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const { user, userId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <div className="flex justify-center gap-3 flex-wrap my-10">
      <Link
        to="/admin/manageuser"
        className="rounded-lg w-48 h-24 flex justify-center items-center bg-slate-400 text-xl font-bold text-slate-900"
      >
        Manage Users
      </Link>
      <Link
        to="/admin/manageartist"
        className="rounded-lg w-48 h-24 flex justify-center items-center bg-slate-400 text-xl font-bold text-slate-900"
      >
        Manage Artists
      </Link>
      <Link
        to="/admin/manageplaylist"
        className="rounded-lg w-48 h-24 flex justify-center items-center bg-slate-400 text-xl font-bold text-slate-900"
      >
        Manage Playlists
      </Link>
    </div>
  );
};

export default AdminHome;
