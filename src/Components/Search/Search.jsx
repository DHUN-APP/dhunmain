import React from "react";
import { IoIosSearch } from "react-icons/io";

const Search = () => {
  return (
    <div>
      <div className="flex mt-10 bg-slate-600 rounded-full md:hidden text-white font-semibold text-xl p-3 mx-5">
        <IoIosSearch size={30} />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none bg-slate-600 rounded-full px-1"
        />
      </div>

      <div className="text-xl text-textcolor">Search</div>
    </div>
  );
};

export default Search;
