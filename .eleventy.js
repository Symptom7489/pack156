module.exports = function (eleventyConfig) {
  // Pass-through a few folders to the _site directory
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("css");

  // Create an explicit collection for leadership
  eleventyConfig.addCollection("leadership", function (collectionApi) {
    return collectionApi.getFilteredByGlob("leadership/*.md").sort((a,b) => {
      return a.data.weight - b.data.weight;
    });
  });

  // Create an explicit collection for adventures
  eleventyConfig.addCollection("adventures", function (collectionApi) {
    return collectionApi.getFilteredByGlob("adventures/*.md");
  });

  // Set the input and output directories
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
