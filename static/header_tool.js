function get_search_string(event) {
    // 停止表單的預設提交行為
    event.preventDefault();

    const formData = new FormData(document.getElementById("search-form"));
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value.trim(); // 去除空格
    });

    // 生成新的URL
    let search_string = `/search?keywords=${encodeURIComponent(
      data.keywords
    )}&type=${encodeURIComponent(data.type)}`;

    // 使用新URL進行跳轉
    window.location.href = search_string;

    // 為了保持頁面跳轉，返回false阻止表單提交
    return false;
  }

  function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let hamburger = document.querySelector(".hamburger");
    let mainContent = document.querySelector(".content");

    // 切換側邊欄顯示
    sidebar.classList.toggle("visible");
    hamburger.classList.toggle("selected");

    // 切換主要內容區域的 margin-left
    if (sidebar.classList.contains("visible")) {
      mainContent.style.marginLeft = "15%";
    } else {
      mainContent.style.marginLeft = "0";
    }
  }


