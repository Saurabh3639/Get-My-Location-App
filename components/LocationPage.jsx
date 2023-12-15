"use client";

import {
  fetchLocationName,
  selectLocation,
  setLocation,
} from "@/slices/locationSlice";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapView from "./MapView";

const LocationPage = () => {
  const dispatch = useDispatch();
  const { latitude, longitude, locationName } = useSelector(selectLocation);

  // get user's location - (latitude, longitude and locationName)
  const getLocation = () => {
    if (navigator.geolocation) {
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
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // consoling getLocation
  console.log(
    "latitude",
    latitude,
    "longitude",
    longitude,
    "locationName",
    locationName
  );

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      <section className="text-gray-600 body-font w-full">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -mx-4 -mb-10 text-center">
            <div className="sm:w-1/2 mb-10 px-4">
              <div className="rounded-lg h-64 overflow-hidden">
                {latitude && longitude ? (
                  <MapView center={[latitude, longitude]} zoom={15} />
                ) : (
                  <Image
                    alt="content"
                    className="object-cover object-center h-full w-full"
                    src="/images/world-map.jpg"
                    width={1201}
                    height={501}
                  />
                )}
              </div>
              <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3 min-w-full">
                {locationName ? locationName : "Location Name"}
              </h2>
              <p className="leading-relaxed text-base min-w-full">
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
                Get Location
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LocationPage;
