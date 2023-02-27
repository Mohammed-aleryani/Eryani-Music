const api_key = "api_key=d7342cf1c3cd80aa741d0f7486a48845";
const searchResults = document.getElementById("search-results");
const dropDown = document.getElementById("dropdown");
const ul = document.querySelector("#search-results");

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `There is an error: ${response.status}`;
    }
    return await response.json();
  } catch (error) {
    // console.error(`This is ${error}`);
    console.log("The first catch block executed");
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

const renderError = (error) => {
  dropDown.style.display = "block";
  console.log(error + "dfasfd");
  let item = document.createElement("li");
  item.innerHTML = `${error}`;
  ul.appendChild(item);
};

let searchTimeoutToken = 0;

const getResults = () => {
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
        console.log(data);
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
  console.log(info);
  renderInfo(info);
};

const renderInfo = (info) => {
  let singerInfo = document.getElementById("singer-info");
  let img = document.getElementsByClassName("card-img-top")[0];
  let cardTitle = document.getElementsByClassName("card-title")[0];
  let cardText = document.getElementsByClassName("card-text")[0];
  let seeMore = document.getElementById("see-more");
  singerInfo.style.display = "block";
  img.src = info["artist"]["image"][2]["#text"];
  cardTitle.innerHTML = info["artist"]["name"];
  cardText.innerHTML = info["artist"]["bio"]["content"];
  seeMore.href = info["artist"]["url"];
};

window.onload = () => {
  getResults();
};

ul.addEventListener("click", function (e) {
  if (e.target) {
    console.log(e.target.innerHTML);
    getSingerInfo(e.target.innerHTML);
  }
});
