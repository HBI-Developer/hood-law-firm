import { useState, useEffect } from "react";
import type { Country } from "react-phone-number-input";

const CACHE_KEY = "user_country_code";
const DEFAULT_COUNTRY: Country = "SD";

export function useGetUserCountry() {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);

  useEffect(() => {
    const fetchCountry = async () => {
      // 1. Check cache first
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setCountry(cached as Country);
        return;
      }

      // 2. Fetch if not cached
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("Failed to fetch country");

        const data = await response.json();
        const countryCode = data.country_code;

        if (
          countryCode &&
          typeof countryCode === "string" &&
          countryCode.length === 2
        ) {
          setCountry(countryCode as Country);
          sessionStorage.setItem(CACHE_KEY, countryCode);
        }
      } catch (error) {
        console.warn("Failed to detect user country, using default:", error);
        // Fallback is already set via initial state
      }
    };

    fetchCountry();
  }, []);

  return country;
}
