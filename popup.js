document.addEventListener("DOMContentLoaded", function () {
  var login_button = document.getElementById("login");
  const login_screen = document.getElementById("login-screen");
  const loggedin_screen = document.getElementById("logged-in-screen");

  if (document.cookie) {
    login_screen.style.display = "none";
    loggedin_screen.style.display = "block";
    console.log("User ID saved in cookie: " + document.cookie);
  } else {
    login_screen.style.display = "block";
    loggedin_screen.style.display = "none";
    console.log("User ID not saved in cookie");
  }

  login_button.addEventListener("click", function () {
    // ユーザーが入力したIDを取得
    var input_id = document.getElementById("input-id").value;
    console.log("User ID: " + input_id);
    fetch("http://localhost:3001/api/user_auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: input_id }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API Request failed: " + response.status);
        }
        console.log("API Response: " + response.status);
        response.json().then(function (data) {
          // IDをクッキーに保存（セキュリティ上の観点から推奨されない）
          document.cookie =
            "user_id=" +
            data.user_id +
            "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
          console.log("User ID saved in cookie: " + data.user_id);
          login_screen.style.display = "none";
          loggedin_screen.style.display = "block";
        });
      })
      .catch(function (error) {
        console.error("API Request error: " + error);
      });

    var save_button = document.getElementById("save");
    save_button.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var current_url = tabs[0].url;
        console.log("Current URL: " + current_url);
        fetch("http://localhost:3001/api/summary?url=" + current_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error("API Request failed: " + response.status);
            }
            console.log("API Response: " + response.status);
            return response.text();
          })
          .then(function (data) {
            console.log("Saved: " + data);
            alert("保存しました");
            window.close(); // ポップアップを閉じる
          })
          .catch(function (error) {
            console.error("API Request error: " + error);
            alert("保存に失敗しました");
          });
      });
    });

    var close_button = document.getElementById("close");
    close_button.addEventListener("click", function () {
      window.close(); // ポップアップを閉じる
    });
  });
});
