const api_key = "api_key=d7342cf1c3cd80aa741d0f7486a48845";
const api_key2 = "xqHRhT3lnPCiMe-Mr_tInWpm469C_-JJDc7kjP52ypg";
const dropDown = document.getElementById("dropdown");
const ul = document.querySelector("#search-results");
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
  let result = data["results"]["artistmatches"]["artist"];
  if (result != "") {
    result.forEach((e) => {
      let item = document.createElement("li");
      item.innerHTML = `${e["name"]}`;
      ul.appendChild(item);
    });
  } else {
    let item = document.createElement("li");
    item.innerHTML = "There is no match result";
    ul.appendChild(item);
  }
};

const renderInfo = (info) => {
  let singerInfo = document.getElementById("singer-info");
  // let img = document.getElementsByClassName("card-img-top")[0];
  let cardTitle = document.getElementsByClassName("card-title")[0];
  let cardText = document.getElementsByClassName("card-text")[0];
  let seeMore = document.getElementById("see-more");
  singerInfo.style.display = "block";
  // img.src = info["artist"]["image"][2]["#text"];
  cardTitle.innerHTML = info["artist"]["name"];
  cardText.innerHTML = info["artist"]["bio"]["content"];
  seeMore.href = info["artist"]["url"];
};

const renderPhoto = (photo_url) => {
  let img = document.getElementsByClassName("card-img-top")[0];
  img.src = photo_url;
};

const renderError = (error) => {
  dropDown.style.display = "block";
  let item = document.createElement("li");
  item.innerHTML = `${error}`;
  ul.appendChild(item);
};

const searchResult = () => {
  const searchFieldElement = document.getElementById("search-input");
  searchFieldElement.onkeyup = (e) => {
    ul.innerHTML = "";
    clearTimeout(searchTimeoutToken);
    let value = searchFieldElement.value;
    if (value.trim().length === 0) {
      dropDown.style.display = "none";
      return;
    }
    searchTimeoutToken = setTimeout(async () => {
      let url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
        value
      )}&${api_key}&format=json`;
      let data = await fetchData(url);
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

  let url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
    name
  )}&${api_key}&format=json`;
  let info = await fetchData(url);
  renderInfo(info);
};

const getSingerPhoto = async (name) => {
  let url = `https://api.unsplash.com/search/photos?client_id=${api_key2}&page=1&query=${name}`;
  let photo = await fetchData(url);
  renderPhoto(photo["results"][0]["urls"]["small"]);
};
window.onload = () => {
  searchResult();
};

ul.addEventListener("click", function (e) {
  if (e.target) {
    getSingerInfo(e.target.innerHTML);
    getSingerPhoto(e.target.innerHTML);
  }
});
