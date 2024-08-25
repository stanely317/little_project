// 從網址取得搜尋關鍵字與類型
const urlParams = new URLSearchParams(window.location.search);
const keywords = urlParams.get("keywords");
const type = urlParams.get("type");

let search_string = `/searchDB/${encodeURIComponent(
  keywords
)}/${encodeURIComponent(type)}`;
// console.log(search_string);

fetch(search_string)
  .then((response) => response.json())
  .then((data) => {
      const articleBlock = document.querySelector(".article_block");
      // 動態生成文章上方小標題
      let head = document.createElement("h2");
      head.textContent = `搜尋[${type}]："${keywords}"，得到的結果為 `;
      articleBlock.appendChild(head);
      
      data.forEach((row) => {
            // 判斷類型，顯示不同內容
            if (type === '標題' || type === '內容') {
              displayArticle(row, articleBlock);
            } else {
              displayComment(row, articleBlock);
            }
      });
});

function displayArticle(row, articleBlock) {
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
    
      // 內容
      const content = document.createElement("h4");
      content.textContent = `文章內容: ${row.content}`;
      articleDiv.appendChild(content);
    
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
}

function displayComment(row, articleBlock) {
      // Create comment div
      const commentDiv = document.createElement("div");
      commentDiv.className = "article";
    
      // 顯示所屬文章標題
      const h3 = document.createElement("h3");
      const link = document.createElement("a");
      link.href = `/article/${row.article_id}`;
      link.textContent = `文章標題：${row.title}`;
      h3.appendChild(link);
      commentDiv.appendChild(h3);
    
      // 留言內容
      const pComment = document.createElement("p");
      pComment.className = "comments";
      pComment.textContent = `留言內容: ${row.article_comment}`;
      commentDiv.appendChild(pComment);
    
      // 時間
      const pDate = document.createElement("p");
      pDate.className = "comments_time";
      const tmp_Date = new Date(row.date); // 轉換時間格式
      const formattedDate = tmp_Date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      pDate.textContent = `發佈時間: ${formattedDate}`;
      commentDiv.appendChild(pDate);
    
      // 將最新的留言插入在最上方
      articleBlock.insertBefore(commentDiv, articleBlock.children[1]);
    }