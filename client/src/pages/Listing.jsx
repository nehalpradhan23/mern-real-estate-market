import { list } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      setError(false);
      setLoading(true);
      setListing(null);
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <>
          <p className="text-center my-7 text-2xl text-red-700">
            Something went wrong!
          </p>{" "}
          <Link to={"/profile"}>
            <p className="text-center my-7 text-2xl hover:underline">
              Go to Profile
            </p>
          </Link>
        </>
      )}
      {/* ======================================= */}
      {listing && !loading && !error && (
        <div className="flex mt-1 md:mt-12 p-4 md:px-8 gap-4 max-lg:flex-col">
          {/* main image slider =========================== */}
          <div className="bg-red-400 w-[40%] max-lg:w-full">
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* end image slider ================================ */}
          <div className="mt-5 mb-10 px-4 flex flex-col gap-4">
            {/* name and price --------------*/}
            <div className="flex flex-col gap-2">
              <div className="flex">
                <p className="text-3xl font-bold">
                  {listing.name} - ${" "}
                  {listing.offer
                    ? listing.discountPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && " / month"}
                </p>
              </div>
              {/* address ------- */}
              <div className="flex gap-2">
                <div className="text-green-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="1.7rem"
                    width="1.7rem"
                  >
                    <path d="M18.27 6c1.01 2.17.78 4.73-.33 6.81-.94 1.69-2.29 3.12-3.44 4.69-.5.7-1 1.45-1.37 2.26-.13.27-.22.55-.32.83-.1.28-.19.56-.28.84-.09.26-.2.57-.53.57-.39 0-.5-.44-.58-.74-.24-.73-.48-1.43-.85-2.1-.42-.79-.95-1.52-1.49-2.23L18.27 6M9.12 8.42l-3.3 3.92c.61 1.29 1.52 2.39 2.39 3.49.21.25.42.51.62.78L13 11.67l-.04.01c-1.46.5-3.08-.24-3.66-1.68-.08-.17-.14-.37-.18-.57a3.05 3.05 0 010-1v-.01m-2.54-3.8l-.01.01c-1.62 2.05-1.9 4.9-.93 7.31L9.63 7.2l-.05-.05-3-2.53m7.64-2.26L11 6.17l.04-.01c1.34-.46 2.84.12 3.52 1.34.15.28.27.58.31.88.06.38.08.65.01 1.02v.01l3.2-3.8a6.988 6.988 0 00-3.85-3.24l-.01-.01M9.89 6.89l3.91-4.65-.04-.01C13.18 2.08 12.59 2 12 2c-1.97 0-3.83.85-5.15 2.31l-.02.01 3.06 2.57z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  {listing.address}
                </p>
              </div>
            </div>
            {/* type and discount ------------------------ */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="">
                <p className="bg-red-700 px-8 py-2 w-[190px] text-white rounded-md text-center font-semibold text-lg">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
              </div>
              {/* if discount */}
              <div className="">
                {listing.offer && (
                  <p className="bg-green-700 px-8 py-2 w-[190px] text-white rounded-md text-center font-semibold text-lg">
                    $ {listing.regularPrice - listing.discountPrice} OFF
                  </p>
                )}
              </div>
            </div>
            {/* description ----------------------------- */}
            <div className="">
              <p className="text-lg">
                <span className="font-bold">Description: </span>
                {listing.description}
              </p>
            </div>
            {/* other details----------------------------- */}
            <div className="flex gap-6 text-lg font-bold text-green-700 flex-col sm:flex-row">
              {/* bed -------------------- */}
              <div className="flex gap-2">
                <svg
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  height="1.7rem"
                  width="1.7rem"
                >
                  <path d="M432 230.7a79.44 79.44 0 00-32-6.7H112a79.51 79.51 0 00-32 6.69A80.09 80.09 0 0032 304v112a16 16 0 0032 0v-8a8.1 8.1 0 018-8h368a8.1 8.1 0 018 8v8a16 16 0 0032 0V304a80.09 80.09 0 00-48-73.3zM376 80H136a56 56 0 00-56 56v72a4 4 0 005.11 3.84A95.5 95.5 0 01112 208h4.23a4 4 0 004-3.55A32 32 0 01152 176h56a32 32 0 0131.8 28.45 4 4 0 004 3.55h24.46a4 4 0 004-3.55A32 32 0 01304 176h56a32 32 0 0131.8 28.45 4 4 0 004 3.55h4.2a95.51 95.51 0 0126.89 3.85A4 4 0 00432 208v-72a56 56 0 00-56-56z" />
                </svg>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </div>
              <div className="flex gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1.7rem"
                  width="1.7rem"
                >
                  <path d="M9 22h8v-2.5c2.41-1.63 4-4.38 4-7.5V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v8H3c0 3.09 2 6 6 7.5V22m-3.71-8h13.42A7.017 7.017 0 0115 18.33V20h-4v-1.67C9 18 5.86 15.91 5.29 14M15 4h4v8h-4V4m1 1v3h2V5h-2z" />
                </svg>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms`
                  : `${listing.bathrooms} bathroom`}
              </div>
              <div className="flex gap-2">
                <svg
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  height="1.7rem"
                  width="1.7rem"
                >
                  <path d="M959 413.4L935.3 372a8 8 0 00-10.9-2.9l-50.7 29.6-78.3-216.2a63.9 63.9 0 00-60.9-44.4H301.2c-34.7 0-65.5 22.4-76.2 55.5l-74.6 205.2-50.8-29.6a8 8 0 00-10.9 2.9L65 413.4c-2.2 3.8-.9 8.6 2.9 10.8l60.4 35.2-14.5 40c-1.2 3.2-1.8 6.6-1.8 10v348.2c0 15.7 11.8 28.4 26.3 28.4h67.6c12.3 0 23-9.3 25.6-22.3l7.7-37.7h545.6l7.7 37.7c2.7 13 13.3 22.3 25.6 22.3h67.6c14.5 0 26.3-12.7 26.3-28.4V509.4c0-3.4-.6-6.8-1.8-10l-14.5-40 60.3-35.2a8 8 0 003-10.8zM264 621c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm388 75c0 4.4-3.6 8-8 8H380c-4.4 0-8-3.6-8-8v-84c0-4.4 3.6-8 8-8h40c4.4 0 8 3.6 8 8v36h168v-36c0-4.4 3.6-8 8-8h40c4.4 0 8 3.6 8 8v84zm108-75c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zM220 418l72.7-199.9.5-1.3.4-1.3c1.1-3.3 4.1-5.5 7.6-5.5h427.6l75.4 208H220z" />
                </svg>
                {listing.parking ? "Parking" : "No Parking"}
              </div>
              <div className=" flex gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1.7rem"
                  width="1.7rem"
                >
                  <path d="M19 13V4c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2v9a1 1 0 00-1 1v8h2v-5h12v5h2v-8a1 1 0 00-1-1zm-2-9v9h-2V4h2zm-4 0v9h-2V4h2zM7 4h2v9H7V4z" />
                </svg>
                {listing.furnished ? "Furnished" : "Not Furnished"}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
