module.exports = function (eleventyConfig) {
  // ✅ Copy the admin folder to _site/admin
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });

  // ✅ Copy images folder (now the source of all media)
  eleventyConfig.addPassthroughCopy("images");

  // ✅ Optional: if you have CSS, JS, or other assets in root folders
  eleventyConfig.addPassthroughCopy("css"); // This line is now active
  // eleventyConfig.addPassthroughCopy("js");

  // ✅ Collection for members
  eleventyConfig.addCollection("leadership", function (collectionApi) {
    return collectionApi.getFilteredByGlob("leadership/*.md").sort((a,b) => {
      return a.data.weight - b.data.weight;
    });
  });

  return {
    dir: {
      input: ".",      // Project root
      output: "_site" // Output folder
    }
  };
};
