"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  fetchLocationName,
  selectLocation,
  setLocation,
} from "@/slices/locationSlice";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LocationPage = () => {
  const dispatch = useDispatch();
  const { latitude, longitude, locationName } = useSelector(selectLocation);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // get user's location - (latitude, longitude and locationName)
  const getLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true); // Start loading
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(
            setLocation({
              latitude: latitude.toFixed(6),
              longitude: longitude.toFixed(6),
            })
          );
          dispatch(
            fetchLocationName({
              lat: latitude.toFixed(6),
              long: longitude.toFixed(6),
            })
          );
          setIsLoading(false); // Stop loading
        },
        (error) => {
          console.error(error.message);
          setIsLoading(false); // Stop loading on error
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false); // Stop loading if geolocation not supported
    }
  };

  // useEffect(() => {
  //   getLocation();
  // }, []);

  return (
    <>
      <section
        className={`text-gray-600 body-font min-w-full min-h-screen ${
          theme === "dark" ? "dark-mode" : "light-mode"
        }`}
      >
        <div className="flex items-center justify-end py-2">
          <div className="checkbox-wrapper">
            <label className="switch">
              <input type="checkbox" onClick={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap justify-center -mx-4 -mb-10 text-center">
            <div className="sm:w-1/2 mb-10 px-4">
              <div className="rounded-lg h-64 flex justify-center items-center overflow-hidden">
                <Image
                  alt="content"
                  className="object-cover object-center customImgSize"
                  src="/images/location-img.svg"
                  width={1201}
                  height={501}
                />
              </div>
              <h2 className="title-font text-2xl font-medium text-gray-900 text-title mt-6 mb-3 min-w-full">
                {locationName ? locationName : "Location Name"}
              </h2>
              <p className="leading-relaxed text-base min-w-full text-body">
                {latitude && longitude
                  ? `${latitude}, ${longitude}`
                  : "Latitude, Longitude"}
              </p>
              <button
                onClick={() => {
                  getLocation();
                }}
                className="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded"
              >
                {isLoading ? "Loading..." : "Get Location"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LocationPage;
