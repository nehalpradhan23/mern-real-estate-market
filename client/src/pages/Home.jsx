import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    // fetch data one by one ------------------------
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaletListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaletListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  // ==========================================================
  return (
    <div>
      <div className="relative">
        {/* top */}
        {/* <div className="flex flex-col items-center gap-6 py-28 px-3 max-w-6xl mx-auto"> */}
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="flex flex-col items-center gap-6 py-[140px] absolute  z-50 w-[90%]">
            <h1 className="text-slate-950 py-4 px-6 font-bold text-3xl sm:text-5xl md:text-6xl bg-white/50 backdrop-blur-xl text-center">
              Find your next perfect
              <br />
              place with ease
            </h1>
            <div className="text-balck p-3 text-xs sm:text-sm md:text-xl bg-white/60 backdrop-blur-xl">
              MyEstate is the best place to find your next perfect place to live
              <br />
              We have a wide range of properties to choose from.
            </div>
            <Link
              to={"/search"}
              className="text-xs sm:text-lg xl:text-2xl text-white font-bold bg-gradient-to-r from-sky-500 to-purple-500 flex items-center gap-1 w-fit py-3 px-12 hover:scale-110 transition-all"
            >
              <span>See all Listings</span>
              <span className="mt-1">
                <FaArrowRight />
              </span>
            </Link>
          </div>
        </div>
        {/* swiper ====================================*/}
        <Swiper navigation className="">
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                  key={listing._id}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      {/* listings ===================== */}
      <div className="max-w-[1400px] mx-auto p-3 flex flex-col gap-8 my-10">
        {/* offer listings ============================ */}
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-4xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-md text-blue-800 hover:underline"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {/* rent listings ============================ */}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-4xl font-semibold text-slate-600">
                For rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-md text-blue-800 hover:underline"
              >
                Show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {/* sale listings ============================ */}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-4xl font-semibold text-slate-600">
                For sale
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-md text-blue-800 hover:underline"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
