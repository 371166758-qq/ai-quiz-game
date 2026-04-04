// 改进方案：工具结果预算控制
// 参考：Claude Code的applyToolResultBudget

class ToolResultBudget {
  constructor(maxTokens = 5000) {
    this.maxTokens = maxTokens;
    this.externalFileThreshold = 10000; // 超过10000字符外联
  }

  // 检查工具结果大小
  checkResultSize(result, toolName) {
    const tokenCount = this.estimateTokens(result);
    
    if (tokenCount > this.externalFileThreshold) {
      // 外联到文件，返回引用
      const filePath = this.saveToExternalFile(result, toolName);
      return {
        type: 'external',
        path: filePath,
        message: `结果过大（${tokenCount} tokens），已保存到 ${filePath}`,
        preview: result.substring(0, 500) + '...'
      };
    }
    
    if (tokenCount > this.maxTokens) {
      // 截断处理
      return {
        type: 'truncated',
        content: result.substring(0, this.maxTokens * 4), // 粗略估计
        message: `结果已截断（${tokenCount} → ${this.maxTokens} tokens）`,
        fullSize: tokenCount
      };
    }
    
    return { type: 'full', content: result };
  }

  // 估算token数
  estimateTokens(text) {
    // 中文约1.5字符/token，英文约4字符/token
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars / 1.5 + otherChars / 4);
  }

  // 保存到外部文件
  saveToExternalFile(content, toolName) {
    const fs = require('fs');
    const path = require('path');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `tool-result-${toolName}-${timestamp}.txt`;
    const filePath = path.join('/tmp', fileName);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
}

// 使用示例
const budget = new ToolResultBudget(5000);
const result = budget.checkResultSize(largeOutput, 'Bash');
