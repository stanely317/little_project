fetch('/home')
  .then((response) => response.json())
  .then((data) => {
    const newest_article_block = document.querySelector(".newest_article_five");
    const most_comments_block = document.querySelector(".most_comments_five");
    let newest_five = data.newest_five;
    let comments_five = data.comments_five;
    
    newest_five.forEach((row) => {
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
      newest_article_block.appendChild(articleDiv, newest_article_block.children[1]);
    });
    comments_five.forEach((row) => {
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
        most_comments_block.appendChild(articleDiv, most_comments_block.children[1]);
      });
  });