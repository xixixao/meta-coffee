const repoNameURIPrefix =
  process.env.NODE_ENV === "production" ? "/meta-coffee" : "";

module.exports = {
  assetPrefix: repoNameURIPrefix,
  env: {
    linkPrefix: repoNameURIPrefix
  }
};
