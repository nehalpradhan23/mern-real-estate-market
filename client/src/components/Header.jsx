import { useEffect, useState } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  let location = useLocation(); // to know change in route
  const { currentUser } = useSelector((state) => state.user);
  const [dropMenu, setDropMenu] = useState(true);
  const showMenu = () => {
    setDropMenu(!dropMenu);
  };
  // close drop menu after resizing when it's open
  const handleResize = () => {
    // console.log(window.innerWidth);
    const windowWidth = window.innerWidth;
    if (windowWidth < 640) {
      setDropMenu(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    setDropMenu(false);
  }, [location]);
  // ====================================================
  return (
    <header className="bg-slate-300 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-lg sm:text-xl flex flex-wrap">
            <span className="text-slate-500">My</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        {/* search bar */}
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search...."
            className="bg-transparent outline-none w-40 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        {/* right menu */}
        <ul className="flex gap-4">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="hidden sm:inline rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Sign in
              </li>
            )}
          </Link>
          <FaBars className="sm:hidden text-2xl" onClick={showMenu} />
        </ul>
      </div>
      {/* open drop menu */}
      <div
        className={`fixed bg-slate-600 right-0 sm:hidden ${
          dropMenu ? "inline" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-2 items-center text-white ">
          <Link to={"/"}>
            <li className=" hover:underline p-1 px-9 py-3 hover:bg-slate-800">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className=" hover:underline p-1 px-9 py-3 hover:bg-slate-800">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover mb-4"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" hover:underline p-1 px-9 py-3 hover:bg-slate-800">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
