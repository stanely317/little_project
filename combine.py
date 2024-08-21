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
            'c1': row[1],
            'c2': row[2],
            'c3': row[3],
            'c4': row[5],
            'c5': row[4],
        })
    return data

def save_data_to_sql(data):
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()

    print(data, "haha")
    # 假設你要儲存到一個名為 YourTable 的表格
    cursor.execute('''
        INSERT INTO 文章 (標題, 內容, 文章種類)
        VALUES (?, ?, ?)
    ''', (data['column1'], data['column2'], data['column3']))

    conn.commit()
    conn.close()


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
         
@app.route('/')
def index():
    return render_template('data.html') 

if __name__ == '__main__':
    app.run(debug=True)
