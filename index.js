const api_key = "api_key=d7342cf1c3cd80aa741d0f7486a48845";
const dropDown = document.getElementById("dropdown");
const ul = document.querySelector("#search-results");
const searchFieldElement = document.getElementById("search-input");
let searchTimeoutToken = 0;

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `There is an error: ${response.status}`;
    }
    return await response.json();
  } catch (error) {
    return error;
  }
};

const renderResult = (data) => {
  dropDown.style.display = "block";
  const result = data["results"]["artistmatches"]["artist"];
  if (result != "") {
    result.forEach((e) => {
      const item = document.createElement("li");
      item.innerHTML = `${e["name"]}`;
      ul.appendChild(item);
    });
  } else {
    const item = document.createElement("li");
    item.innerHTML = "There is no match result";
    ul.appendChild(item);
  }
};

const renderInfo = (info) => {
  const singerInfo = document.getElementById("singer-info");
  const img = document.getElementsByClassName("card-img-top")[0];
  const cardTitle = document.getElementsByClassName("card-title")[0];
  const cardText = document.getElementsByClassName("card-text")[0];
  const seeMore = document.getElementById("see-more");
  singerInfo.style.display = "block";
  img.src = info["artist"]["image"][2]["#text"];
  cardTitle.innerHTML = info["artist"]["name"];
  cardText.innerHTML = info["artist"]["bio"]["content"];
  seeMore.href = info["artist"]["url"];
};

const renderError = (error) => {
  dropDown.style.display = "block";
  const item = document.createElement("li");
  item.innerHTML = `${error}`;
  ul.appendChild(item);
};

const searchResult = () => {
  searchFieldElement.oninput = (e) => {
    ul.innerHTML = "";
    clearTimeout(searchTimeoutToken);
    const value = searchFieldElement.value;
    if (value.trim().length === 0) {
      dropDown.style.display = "none";
      return;
    }
    searchTimeoutToken = setTimeout(async () => {
      const url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
        value
      )}&${api_key}&format=json`;
      const data = await fetchData(url);
      if (data["results"]) {
        renderResult(data);
      } else {
        renderError(data);
      }
    }, 500);
  };
};

const getSingerInfo = async (name) => {
  dropDown.style.display = "none";

  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
    name
  )}&${api_key}&format=json`;
  const info = await fetchData(url);
  renderInfo(info);
};

window.onload = () => {
  searchResult();
};

ul.addEventListener("click", function (e) {
 searchFieldElement.value = "";
  if (e.target) {
    getSingerInfo(e.target.innerHTML);
  }
});
