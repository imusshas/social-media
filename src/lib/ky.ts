import ky from "ky";

const kyInstance = ky.create({
  prefixUrl: typeof window === "undefined" ? "http://localhost:3000" : "",
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) {
        return new Date(value);
      }
      return value;
    }),
});

export default kyInstance;
