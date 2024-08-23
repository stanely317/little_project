// 取得URL中的文章ID
const urlParams = new URLSearchParams(window.location.search);
const articleID = urlParams.get('id');

// 之後看上面的articleID能不能取代掉id(0823)
let id; // 用來儲存文章ID(為了insert用)
let category; // 用來儲存類別(同上)

// 查詢資料並顯示在表格中
fetch(`/content?id=${articleID}`)
  .then((response) => response.json())
  .then((data) => {
    const articleBlock = document.querySelector(".article_block");
    const commentBlock = document.querySelector(".comment_block");
    let article = data.article;
    let comment = data.comment;
    article.forEach((row) => {
      // Create article div
      const articleDiv = document.createElement("div");
      articleDiv.className = "article";

      // 標題
      const h2 = document.createElement("h2");
      h2.textContent = row.title; //
      articleDiv.appendChild(h2);

      // 內容
      const pContent = document.createElement("p");
      // 文字換行轉換
      let output_content = row.content.replace(/\n/g, "<br>");
      pContent.innerHTML = output_content;
      articleDiv.appendChild(pContent);

      // 留言數
      //   const pComments = document.createElement("p");
      //   pComments.textContent = `留言數: ${row.comments}`;
      //   articleDiv.appendChild(pComments);

      // 時間
      const pDate = document.createElement("p");
      pDate.className = "comments_time";
      // 轉換時間格式
      const tmp_Date = new Date(row.date);
      const formattedDate = tmp_Date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      pDate.textContent = `發佈時間: ${formattedDate}`;
      articleDiv.appendChild(pDate);

      // 將最新的文章插入在最上方
      articleBlock.insertBefore(articleDiv, articleBlock.children[1]);
      id = row.id;
      category = row.category;
    });
    comment.forEach((row) => {
      // Create article div
      const articleDiv = document.createElement("div");
      articleDiv.className = "article";

      // 留言內容 (因為輸入不是textarea所以沒有處理換行)
      const pComment = document.createElement("p");
      pComment.className = "comments"
      pComment.textContent = row.article_comment;
      articleDiv.appendChild(pComment);

      // 留言時間
      const pDate = document.createElement("p");
      pDate.className = "comments_time";
      // 轉換時間格式
      const tmp_Date = new Date(row.date);
      const formattedDate = tmp_Date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      pDate.textContent = `留言時間: ${formattedDate}`;
      articleDiv.appendChild(pDate);

      // 將最新的文章插入在最上方
      commentBlock.appendChild(articleDiv, commentBlock.children[1]);
    });
  });

// 提交新增資料
document
  .getElementById("insert_comments")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    data["id"] = id;
    data["category"] = category;
    // console.log(data);
    fetch("/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          alert("已成功新增留言");
          location.reload(); // 刷新頁面以更新表格
        } else {
          alert("資料提交失敗，原因: " + result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
