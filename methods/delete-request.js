const writeToFile = require("../util/write-to-file");
module.exports = (req, res) => {
      let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
      let id = req.url.split("/")[3];
      const regexV4 = new RegExp(/^tt\d{7}$/i);

      if (!regexV4.test(id)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
                  JSON.stringify({
                        title: "Validation Failed",
                        message: "IMDBID is not valid",
                  })
            );
      } else if (baseUrl === "/api/movies/" && regexV4.test(id)) {
            const index = req.movies.findIndex((movie) => {
                  return movie.imdbID === id;
            });
            if (index === -1) {
                  res.statusCode = 404;
                  res.write(
                        JSON.stringify({ title: "Not Found", message: "Movie not found" })
                  );
                  res.end();
            } else {
                  req.movies.splice(index, 1);
                  writeToFile(req.movies);
                  res.writeHead(204, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(req.movies));
            }
      } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
      }
};