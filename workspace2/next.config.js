module.exports = {
  assetPrefix: process.env.NODE_ENV === "production" ? "/meta-coffee" : "",
  "process.env.BACKEND_URL":
    process.env.NODE_ENV === "production" ? "/meta-coffee" : "",
  generateBuildId: async () => {
    return "current";
  }
};
