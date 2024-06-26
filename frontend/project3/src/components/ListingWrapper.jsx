import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons";

const ListingWrapper = (props) => {
  const [isHover, setIsHover] = useState(false);

  const handleEdit = async () => {
    props.handleUpdate(props.listing);
  };

  const handleDelete = async (id) => {
    props.handleDelete(id);
  };

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex h-40 my-4"
    >
      <div className="flex min-w-0 gap-x-4 w-5/6 h-40">
        <img
          className="h-40 w-40 w-1/3 flex-none bg-gray-50 object-cover rounded-l"
          src={
            props.listing.image
              ? props.listing.image
              : "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
        />
        <div className="flex flex-col justify-between w-2/3 py-4">
          <div>
            <p className="text-xl font-semibold leading-6 text-indigo-900 flex truncate">
              {props.listing.name}{" "}
              <span className="text-xs bg-indigo-700 text-white rounded py-1 px-2 ml-2 border-none">
                {props.listing.category.charAt(0).toUpperCase() +
                  props.listing.category.slice(1)}
              </span>
            </p>
            <p className="mt-1 text-sm font-medium leading-5 text-indigo-700">
              {props.listing.merchant.merchantDetails.name} (
              {props.listing.merchant.merchantDetails.address})
            </p>
          </div>
          <div>
            <p className="mt-1 text-xs font-light leading-5 text-indigo-700 line-clamp-3">
              {props.listing.description || "No description"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-4 justify-between w-1/5">
        <div>
          <p className="text-sm leading-6 text-indigo-900 font-semibold">
            Remaining:{" "}
            {props.listing.quantity > 1
              ? props.listing.quantity + "pcs"
              : props.listing.quantity + "pc"}
          </p>
          <p className="mt-1 text-sm leading-5 text-gray-400">
            <s>S${props.listing.originalPrice.toFixed(2)}</s>{" "}
            <span className="text-indigo-700 font-semibold">
              S$
              {props.listing.discountedPrice.toFixed(2)}
            </span>
          </p>
        </div>
        <div className="mt-1 leading-5">
          <span className="text-xs text-indigo-700">Collect on </span>
          <br />
          <span className="text-sm font-medium text-indigo-700">
            {new Date(props.listing.collectionDate).toLocaleString("en-SG")}
          </span>
        </div>
      </div>
      <div className={isHover ? "flex flex-col justify-around" : "hidden"}>
        <button
          className="text-indigo-700 hover:bg-indigo-100 p-2 m-2 rounded"
          onClick={handleEdit}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          className="text-red-700 hover:bg-red-100 p-2 m-2 rounded"
          onClick={() => handleDelete(props.listing._id)}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
    </div>
  );
};

export default ListingWrapper;
