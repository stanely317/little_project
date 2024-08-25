const currentUrl = window.location.pathname;
const category = currentUrl.substring(1);
let category_string;
// 藉由路徑來判斷文章類別
if (window.location.pathname.includes("chat")) {
  category_string = "閒聊";
} else if (window.location.pathname.includes("news")) {
  category_string = "新聞";
} else if (window.location.pathname.includes("sports")) {
  category_string = "運動";
} else if (window.location.pathname.includes("games")) {
  category_string = "遊戲";
} else {
  category_string = "其他";
}

let a_tag = document.getElementById(category);
a_tag.textContent = ` - ${category_string} - `;
a_tag.style = 'font-weight:bold';

// 查詢資料並顯示在表格中
fetch(`/category/${category}`)
  .then((response) => response.json())
  .then((data) => {
    const articleBlock = document.querySelector(".article_block");
   
    data.forEach((row) => {
      // Create article div
      const articleDiv = document.createElement("div");
      articleDiv.className = "article";

      // 標題
      const h3 = document.createElement("h3");
      const link = document.createElement("a");
      link.href = `/article/${row.id}`;
      link.textContent = row.title;
      h3.appendChild(link);
      articleDiv.appendChild(h3);

      // 類別
      const pCategory = document.createElement("p");
      pCategory.textContent = `分類: ${row.category}`;
      articleDiv.appendChild(pCategory);

      // 留言數
      const pComments = document.createElement("p");
      pComments.textContent = `留言數: ${row.comments}`;
      articleDiv.appendChild(pComments);

      // 時間
      const pDate = document.createElement("p");
      const tmp_Date = new Date(row.date); // // 轉換時間格式
      const formattedDate = tmp_Date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      pDate.textContent = `發佈時間: ${formattedDate}`;
      articleDiv.appendChild(pDate);

      // 將最新的文章插入在最上方
      articleBlock.insertBefore(articleDiv, articleBlock.children[1]);
    });
  });

// 提交新增資料
document
  .getElementById("insert-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    data['category'] = category_string;
    console.log(data);
    
    fetch("/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          alert("已成功新增文章");
          location.reload(); // 刷新頁面以更新表格
        } else {
          alert("資料提交失敗，原因: " + result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
