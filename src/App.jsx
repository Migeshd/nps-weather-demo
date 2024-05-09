import Droplet from "./icons/droplet";
import Umbrella from "./icons/umbrella";
import LeftRightArrow from "./icons/leftRightArrow";
import { useEffect, useRef, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import dayjs from "dayjs";
import Sun from "./icons/sun";
import PartlyCloud from "./icons/partlyCloud";
import Drizzle from "./icons/drizzle";
import Fog from "./icons/fog";
import Rain from "./icons/Rain";
import { twMerge } from "tailwind-merge";

const weatherParamsCelcuis = {
  current: [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "rain",
    "weather_code",
    "wind_speed_10m",
  ],
  daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
  wind_speed_unit: "mph",
  timezone: "auto",
};

function getIcon(wetherCode, className, isSun) {
  if (wetherCode > 0 && wetherCode < 10) {
    return (
      <Sun
        className={twMerge(
          className,
          isSun ? "stroke-yellow-300 animate-[spin_5s_linear_infinite]" : ""
        )}
      />
    );
  } else if (wetherCode > 10 && wetherCode < 40) {
    return <PartlyCloud className={className} />;
  } else if (wetherCode > 50 && wetherCode < 60) {
    return <Fog className={className} />;
  } else if (wetherCode > 60 && wetherCode < 80) {
    return <Drizzle className={className} />;
  } else {
    return <Rain className={className} />;
  }
}

export default function App() {
  const [temScale, setTempScale] = useState("celsius");

  const [data, setData] = useState({
    current: {
      time: new Date(),
      temperature2m: 0,
      relativeHumidity2m: 0,
      precipitation: 0,
      rain: 0,
      weatherCode: 2,
      windSpeed10m: 0,
    },
    daily: {
      time: [],
      weatherCode: {},
      temperature2mMax: {},
      temperature2mMin: {},
    },
  });

  const [coordinates, setCoordinates] = useState({
    latitude: 27.7063799,
    longitude: 85.3348316,
  });

  const inputRef = useRef(null);

  async function fetchCoordinates(searchString) {
    const response = await (
      await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${searchString}&format=json&apiKey=0b02c4c2076a46bb9eb609bfdd77d90c`,
        { method: "get" }
      )
    ).json();
    if ("results" in response && response.results.length > 0) {
      setCoordinates({
        latitude: response.results[0].lat,
        longitude: response.results[0].lon,
      });
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((data) => {
        setCoordinates({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const url = "https://api.open-meteo.com/v1/forecast";

      const modifiedTemp = { ...weatherParamsCelcuis };

      if (temScale === "fahrenheit") {
        modifiedTemp["temperature_unit"] = "fahrenheit";
      }

      modifiedTemp["latitude"] = coordinates.latitude;
      modifiedTemp["longitude"] = coordinates.longitude;
      const responses = await fetchWeatherApi(url, modifiedTemp);

      // Helper function to form time ranges
      const range = (start, stop, step) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );

      // Process first location. Add a for-loop for multiple locations or weather models
      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();

      const current = response.current();
      const daily = response.daily();

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const weatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature2m: current.variables(0).value(),
          relativeHumidity2m: current.variables(1).value(),
          precipitation: current.variables(2).value(),
          rain: current.variables(3).value(),
          weatherCode: current.variables(4).value(),
          windSpeed10m: current.variables(5).value(),
        },
        daily: {
          time: range(
            Number(daily.time()),
            Number(daily.timeEnd()),
            daily.interval()
          ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          weatherCode: daily.variables(0).valuesArray(),
          temperature2mMax: daily.variables(1).valuesArray(),
          temperature2mMin: daily.variables(2).valuesArray(),
        },
      };

      setData(weatherData);
    }
    if (coordinates) {
      fetchData();
    }
  }, [coordinates, temScale]);

  console.log(coordinates, data);

  return (
    <main className="flex h-screen items-center justify-center bg-slate-100">
      <section className="flex gap-8 flex-col text-gray-500">
        <header className="flex items-center flex-col md:flex-row">
          <p>Right Now in </p>
          {"  "}
          <input
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchCoordinates(e.target.value);
              }
            }}
            onBlur={(e) => {
              fetchCoordinates(e.target.value);
            }}
            className="border-b bg-transparent outline-none font-bold text-black px-2"
          />
          ,<p>it mostly cloud.</p>
        </header>
        <article className="flex items-center justify-around flex-col md:flex-row gap-8 md:gap-0">
          <aside>
            {getIcon(
              data.current.weatherCode,
              "size-20",
              data.current.weatherCode > 0 || data.current.weatherCode < 10
            )}
          </aside>
          <main className="flex flex-col gap-2 items-center">
            <h2 className="text-6xl font-light text-black">
              {data.current.temperature2m?.toFixed(0)}
            </h2>
            <p className="flex gap-1 items-center text-[10px] text-slate-400">
              <span>
                {data.daily.temperature2mMin[0]?.toFixed(0)}
                <sup>&deg;</sup>
              </span>
              <span>/</span>
              <span>
                {data.daily.temperature2mMax[0]?.toFixed(0)}
                <sup>&deg;</sup>
              </span>
            </p>
          </main>
          <aside className="flex flex-col gap-2">
            <ShowTodaysWeatherInfo
              value={data.current.windSpeed10m?.toFixed(0)}
              subString="mph"
              icon={<LeftRightArrow className="stroke-current size-4" />}
            />
            <ShowTodaysWeatherInfo
              value={data.current.precipitation?.toFixed(0)}
              subString="%"
              icon={<Umbrella className="stroke-current size-5" />}
            />
            <ShowTodaysWeatherInfo
              value={data.current.relativeHumidity2m?.toFixed(0)}
              subString="%"
              icon={<Droplet className="stroke-current size-4" />}
            />
          </aside>
        </article>
        <section className="flex justify-around mt-2 flex-wrap gap-8 md:gap-0">
          {data.daily.time.map((_data, index) => {
            if ([0, 5, 6].includes(index)) {
              return null;
            }
            return (
              <ShowThisWeekWeatherForcast
                key={index}
                icon={getIcon(
                  data.daily.weatherCode[index],
                  "size-4 stroke-current",
                  false
                )}
                day={dayjs(_data).format("ddd")}
                startTemp={data.daily.temperature2mMin[index]?.toFixed(0)}
                endTemp={data.daily.temperature2mMax[index]?.toFixed(0)}
              />
            );
          })}
        </section>
        <section className="flex justify-center gap-1 text-xs mt-4">
          <button
            className={
              temScale === "fahrenheit"
                ? "mr-0.5 text-black font-medium"
                : "mr-0.5"
            }
            onClick={() => setTempScale("fahrenheit")}
          >
            &deg;F
          </button>
          <span className="text-black">|</span>
          <button
            className={temScale === "celsius" ? "text-black font-medium" : ""}
            onClick={() => setTempScale("celsius")}
          >
            &deg;C
          </button>
        </section>
      </section>
    </main>
  );
}

function ShowThisWeekWeatherForcast({ icon, startTemp, endTemp, day }) {
  return (
    <main className="flex flex-col items-center gap-1">
      <div>{icon}</div>
      <div className="flex text-sm gap-1 text-slate-3400">
        <p>{startTemp}&deg;</p>
        <p>/</p>
        <p>{endTemp}&deg;</p>
      </div>
      <p className="text-[10px] font-medium text-slate-400">{day}</p>
    </main>
  );
}

function ShowTodaysWeatherInfo({ value = 0, subString = "%", icon }) {
  return (
    <div className="flex items-baseline gap-2">
      {icon}
      <p className="align-text-bottom leading-6 text-xl">
        <span>{value}</span>
        <sub className="ml-1 text-[10px]">{subString}</sub>
      </p>
    </div>
  );
}
