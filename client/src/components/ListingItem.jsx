import React from "react";
import { Link } from "react-router-dom";

export default function ListingItem({ listing }) {
  return (
    <div className="hover:bg-gradient-to-r from-blue-400 to-purple-700 p-1 rounded-lg transition-all max-sm:w-full">
      <div className="bg-white hover:bg-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden rounded-lg w-full sm:w-[330px]">
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="h-[180px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
          {/* details ========================== */}
          <div className="p-3 flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold text-slate-700 truncate ">
              {listing.name}
            </p>
            {/* address  */}
            <div className="flex gap-1 items-center">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                // height="1.7rem"
                // width="1.7rem"
                className="w-5 h-5 text-green-700"
              >
                <path d="M18.27 6c1.01 2.17.78 4.73-.33 6.81-.94 1.69-2.29 3.12-3.44 4.69-.5.7-1 1.45-1.37 2.26-.13.27-.22.55-.32.83-.1.28-.19.56-.28.84-.09.26-.2.57-.53.57-.39 0-.5-.44-.58-.74-.24-.73-.48-1.43-.85-2.1-.42-.79-.95-1.52-1.49-2.23L18.27 6M9.12 8.42l-3.3 3.92c.61 1.29 1.52 2.39 2.39 3.49.21.25.42.51.62.78L13 11.67l-.04.01c-1.46.5-3.08-.24-3.66-1.68-.08-.17-.14-.37-.18-.57a3.05 3.05 0 010-1v-.01m-2.54-3.8l-.01.01c-1.62 2.05-1.9 4.9-.93 7.31L9.63 7.2l-.05-.05-3-2.53m7.64-2.26L11 6.17l.04-.01c1.34-.46 2.84.12 3.52 1.34.15.28.27.58.31.88.06.38.08.65.01 1.02v.01l3.2-3.8a6.988 6.988 0 00-3.85-3.24l-.01-.01M9.89 6.89l3.91-4.65-.04-.01C13.18 2.08 12.59 2 12 2c-1.97 0-3.83.85-5.15 2.31l-.02.01 3.06 2.57z" />
              </svg>
              <p className="text-sm text-gray-600 truncate w-full">
                {listing.address}
              </p>
            </div>
            {/* description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {listing.description}
            </p>
            <p className="text-slate-500 mt-2 font-semibold">
              ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.offer && " / month"}
            </p>
            {/* other details ========================== */}
            <div className="text-slate-700 flex gap-4">
              <div className="font-bold text-sm">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </div>
              <div className="font-bold text-sm">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
