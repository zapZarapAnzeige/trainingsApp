import i18n from "next-translate";

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
    pages: {
      "*": ["common"],
      "/": ["home", "example"],
      "/about": ["about"],
    },
  },
};

export default nextConfig;
