document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    let search_string = `/searchDB/${encodeURIComponent(data.keywords)}/${encodeURIComponent(data.type)}`
    console.log((search_string));
    fetch(search_string)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((row) => {
            console.log(row);
        });
      });
  });
