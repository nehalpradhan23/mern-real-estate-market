import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [showListingsLoading, setShowListingsLoading] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [noListings, setNoListings] = useState(false);
  const dispatch = useDispatch();
  // ==================================================================
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  // ==================================================================
  const handleFileUpload = (file) => {
    const storage = getStorage(app); // for firebase
    const fileName = new Date().getTime() + file.name; // get unique filename
    const storageRef = ref(storage, fileName);
    // to get file upload percentage and errors
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  // =============================================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // =============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  // =============================================================
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  // =============================================================
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };
  // =============================================================
  const handleShowListings = async () => {
    setShowListingsLoading(true);
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      if (data.length === 0) {
        setNoListings(true);
      }
      setUserListings(data);
      setShowListingsLoading(false);
    } catch (error) {
      setShowListingsError(true);
      setShowListingsLoading(false);
    }
  };
  // =============================================================
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  // =============================================================
  return (
    <div className="p-3 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* for image upload */}
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`uploading ${filePerc}`} </span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border bg-gray-300 p-3 rounded-sm"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border bg-gray-300 p-3 rounded-sm"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border bg-gray-300 p-3 rounded-sm"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-sm p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white p-3 rounded-sm uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex gap-3 justify-end mt-5">
        <span
          onClick={handleDeleteUser}
          className="bg-red-700 hover:opacity-80 text-white p-3 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="bg-green-700 hover:opacity-80 text-white p-3 cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "user updated successfully" : ""}
      </p>
      {/*show listings button */}
      <button
        onClick={handleShowListings}
        className="bg-green-600 hover:opacity-80 py-3 text-white font-bold w-full"
      >
        {showListingsLoading ? "Loading listings..." : "Show Listings"}
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {/* display user listings ===========================*/}
      {noListings && (
        <h1 className="text-center mt-7 text-2xl font-semibold">
          You have no Listings
        </h1>
      )}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 ">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-gray-300 border rounded-lg p-3 flex justify-between items-center gap-4 flex-col w-full"
            >
              <div className="flex items-center w-full justify-between gap-2">
                <Link to={`/listing/${listing._id}`} className="w-[25%] h-28">
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-full w-full object-cover"
                  />
                </Link>
                {/* listing name and description */}
                <div className="flex flex-col w-[75%]">
                  <Link
                    className="flex-1 text-slate-700 font-semibold hover:underline truncate text-xl md:text-2xl"
                    to={`/listing/${listing._id}`}
                  >
                    <p className="">{listing.name}</p>
                  </Link>
                  <p className="line-clamp-3 text-sm md:text-lg">
                    {listing.description}
                  </p>
                </div>
              </div>
              {/* delete and edit buttons */}
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="bg-red-700 text-white py-2 px-8 uppercase hover:opacity-80"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-green-700 text-white py-2 px-8 uppercase hover:opacity-80">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
