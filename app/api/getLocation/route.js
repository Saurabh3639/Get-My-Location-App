import { NextResponse } from "next/server";

// User Check In
export async function POST(req) {
  try {
    const { lat, long } = await req.json();

    if (!lat || !long) {
      return NextResponse.json(
        { error: "Latitude and Longitude are required." },
        { status: 400 }
      );
    }

    // ---------------- 1) Using Openstreetmap api (free) ----------------
    // const response = await fetch(
    //   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`
    // );
    // const data = await response.json();

    // if (data && data.display_name) {
    //   const location = data.display_name;
    //   return NextResponse.json({ location }, { status: 200 });
    // } else {
    //   NextResponse.json(
    //     { error: "Failed to fetch location." },
    //     { status: 400 }
    //   );
    // }

    // ---------------- 2) Using Google map api ----------------
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data && data.results && data.results[0]) {
      // Set the formatted address as the location name
      const location = data?.results[0]?.formatted_address;
      // console.log(data?.results[0]);
      return NextResponse.json({ location }, { status: 200 });
    } else {
      NextResponse.json(
        { error: "Failed to fetch location." },
        { status: 400 }
      );
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
