from flask import Flask, render_template, jsonify, request
import pyodbc

app = Flask(__name__)

connection_string = (
    'DRIVER={SQL Server};'
    'SERVER=172.25.9.255;'
    'DATABASE=練習18;'
    'UID=sa;'
    'PWD=qwe123'
)

def get_data_from_sql():
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM 文章')

    # 獲取資料
    rows = cursor.fetchall()

    # 關閉連接
    conn.close()

    # 將資料轉換為字典列表
    data = []
    for row in rows:
        data.append({
            'id': row[0],
            'title': row[1],
            'content': row[2],
            'date': row[3],
            'category': row[4],
            'comments': row[5],
        })
    return data

def save_data_to_sql(data):
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()

    # 假設你要儲存到一個名為 YourTable 的表格
    cursor.execute('''
        INSERT INTO 文章 (標題, 內容, 文章種類)
        VALUES (?, ?, ?)
    ''', (data['title'], data['words'], data['category']))

    conn.commit()
    conn.close()

def get_content_from_article(id):
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    cursor.execute(f'SELECT * FROM 文章 WHERE 文章ID = {id}')

    # 獲取資料
    rows = cursor.fetchall()

    # 關閉連接
    conn.close()

    # 將資料轉換為字典列表
    data = []
    for row in rows:
        data.append({
            'id' : row[0],
            'title': row[1],
            'content': row[2],
            'date': row[3],
            'category': row[4],
            'comments': row[5],
        })
    return data

def save_comments_to_article(data):
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()

    # 假設你要儲存到一個名為 YourTable 的表格
    cursor.execute('''
        INSERT INTO 留言 (文章ID, 留言內容) 
        VALUES (?, ?)
    ''', (data['id'], data['comment']))
    conn.commit()
    conn.close()

def get_comments_from_article(id):
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    cursor.execute(f'SELECT * FROM 留言 WHERE 文章ID = {id}')
    # 獲取資料
    rows = cursor.fetchall()
    # 關閉連接
    conn.close()
    # 將資料轉換為字典列表
    data = []
    for row in rows:
        data.append({
            'comment_id' : row[0],
            'article_id': row[1],
            'article_comment': row[2],
            'date': row[3]
        })
    return data

def search_for_sql(keywords, type):
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    query = ""
    if type == '標題' or type == '內容':
        query = f"SELECT * FROM 文章 WHERE {type} LIKE ?"
    else:
        query = f"SELECT * FROM 留言 WHERE {type} LIKE ?"

    cursor.execute(query, ('%' + keywords + '%',))
    # 獲取資料
    rows = cursor.fetchall()
    # 關閉連接
    conn.close()
    # 將資料回傳依照type給予對應欄位與key值
    data = []
    if type == '標題' or type == '內容':
        for row in rows:
            data.append({
                'id' : row[0],
                'title': row[1],
                'content': row[2],
                'date': row[3],
                'category': row[4],
                'comments': row[5],
        })
    else:
        for row in rows:
            data.append({
                'comment_id' : row[0],
                'article_id': row[1],
                'article_comment': row[2],
                'date': row[3]
            })        
    return data

@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
    # 這是處理新增資料的邏輯
        data = request.get_json()
        print(data)
        try:
            save_data_to_sql(data)
            return jsonify({'status': 'success'}), 200
        except Exception as e:
            print(f"Error occurred: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        # 這是處理查詢資料的邏輯
        data = get_data_from_sql()
        return jsonify(data)

@app.route('/searchDB/<string:keywords>/<string:type>', methods=['GET'])
def search(keywords, type):
    result = search_for_sql(keywords, type)
    print(result, "after searching and get data")
    return jsonify(result)

@app.route('/content/<int:article_id>', methods=['GET', 'POST'])
def content(article_id):
    if request.method == 'POST':
    # 這是處理新增資料的邏輯
        data = request.get_json()
        print(data, "here is route")
        try:
            save_comments_to_article(data)
            return jsonify({'status': 'success'}), 200
        except Exception as e:
            print(f"Error occurred: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        # 從請求路由接收文章ID
        # article_id = request.args.get('id')
        # 這是處理查詢資料的邏輯
        article = get_content_from_article(article_id)
        comment = get_comments_from_article(article_id)

        # 將兩者合併到一個字典裡
        response_data = {
            'article': article,
            'comment': comment
        }
        return jsonify(response_data)

@app.route('/')
def index():
    return render_template('home.html') 

@app.route('/chat')
def chatpage():
    return render_template('chat.html')

@app.route('/search')
def searchpage():
    keywords = request.args.get('keywords')
    type = request.args.get('type')
    print(keywords, type)
    return render_template('search.html')

@app.route('/article/<int:article_id>')
def article_page(article_id):
    return render_template('single_article.html');

if __name__ == '__main__':
    app.run(debug=True)
