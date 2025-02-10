///auth/userinfo.email
///auth/userinfo.profile
const CLIENT_ID =
  "97056897827-tupfn1ab82go4nsk88dgokjnkp5hlk2e.apps.googleusercontent.com";
const LINK_GET_TOKEN = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&include_granted_scopes=true&response_type=token&redirect_uri=http://localhost:5173/login&client_id=${CLIENT_ID}`;

document.addEventListener("DOMContentLoaded", () => {
  const signBtn = document.querySelector(".sign_btn");
  signBtn.addEventListener("click", () => {
    window.location.href = LINK_GET_TOKEN;
  });
});

const getToken = () => {
  const saveAccessToken = window.localStorage.getItem("access_token");
  if (saveAccessToken) {
    return saveAccessToken;
  } else {
    const url = new URLSearchParams(window.location.hash.substring(1));
    const token = url.get("access_token");
    window.localStorage.setItem("access-token", token);
    return token;
  }
};

const getUserInfo = async () => {
  const accessToken = getToken();
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}`
  );
  const data = await response.json();
  renderUI(data);
};
getUserInfo();
const renderUI = (data) => {
  const avatar = document.getElementById("avatar");
  const name = document.getElementById("name");
  const mail = document.getElementById("mail");
  avatar.src = data.picture;
  name.innerText = data.name;
  mail.innerText = data.mail;
  console.log(data);
};
