# AI答题大师 API 文档

## 概述
AI答题大师提供RESTful API接口，供第三方应用调用AI出题服务。

## 基础信息
- **Base URL**: `https://371166758-qq.github.io/ai-quiz-game/api`
- **版本**: v1.0
- **格式**: JSON

## 接口列表

### 1. 获取题目
**GET /question**

获取一道随机AI生成的题目。

**请求参数:**
- `category` (可选): 题目类别 - tech/history/nature/medical/law
- `difficulty` (可选): 难度 - easy/medium/hard

**响应示例:**
```json
{
  "id": "q_12345",
  "question": "什么是人工智能(AI)？",
  "options": [
    "只能做数学计算的程序",
    "能够模拟人类智能的计算机系统",
    "只能下棋的程序",
    "只能识别图像的程序"
  ],
  "answer": 1,
  "explanation": "人工智能(AI)是指...",
  "category": "tech",
  "difficulty": "easy"
}
```

### 2. 批量获取题目
**POST /questions**

获取多道题目，适合批量导入。

**请求体:**
```json
{
  "count": 10,
  "category": "tech",
  "difficulty": "medium"
}
```

**定价:**
- 免费额度: 100次/月
- 基础版: $9.9/月 (1000次)
- 专业版: $49.9/月 (10000次)
- 企业版: $199.9/月 (无限制)

### 3. 提交答案
**POST /submit**

提交答案并获取评分。

**请求体:**
```json
{
  "question_id": "q_12345",
  "answer": 1
}
```

**响应:**
```json
{
  "correct": true,
  "explanation": "...",
  "score": 10
}
```

## 使用示例

### Python
```python
import requests

# 获取题目
response = requests.get('https://your-api.com/api/question?category=tech')
question = response.json()
print(question['question'])

# 提交答案
result = requests.post('https://your-api.com/api/submit', json={
    'question_id': question['id'],
    'answer': 0
})
print(result.json())
```

### JavaScript
```javascript
// 获取题目
const response = await fetch('https://your-api.com/api/question?category=tech');
const question = await response.json();
console.log(question.question);

// 提交答案
const result = await fetch('https://your-api.com/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question_id: question.id, answer: 0 })
});
console.log(await result.json());
```

## 错误处理
- 200: 成功
- 400: 请求参数错误
- 401: 未授权（API Key无效）
- 429: 请求频率超限
- 500: 服务器错误

## 联系方式
- Email: support@example.com
- GitHub: https://github.com/371166758-qq/ai-quiz-game/issues

---
*最后更新: 2026-04-03*
