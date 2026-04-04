// 改进方案：State结构体（原子性状态管理）
// 参考：Claude Code的State设计

class AgentState {
  constructor(initialState = {}) {
    // 所有状态字段集中管理
    this.state = {
      messages: initialState.messages || [],
      currentTask: initialState.currentTask || null,
      toolResults: initialState.toolResults || [],
      turnCount: initialState.turnCount || 0,
      lastCompactTime: initialState.lastCompactTime || Date.now(),
      errors: initialState.errors || [],
      context: {
        workingDirectory: process.cwd(),
        environment: {},
        userPreferences: {}
      },
      metrics: {
        totalTokens: 0,
        apiCalls: 0,
        toolExecutions: 0,
        startTime: Date.now()
      }
    };
  }

  // 原子性更新：返回新的State对象
  update(updates) {
    return new AgentState({
      ...this.state,
      ...updates,
      // 深度合并嵌套对象
      context: { ...this.state.context, ...(updates.context || {}) },
      metrics: { ...this.state.metrics, ...(updates.metrics || {}) }
    });
  }

  // 添加消息
  addMessage(message) {
    return this.update({
      messages: [...this.state.messages, message],
      turnCount: this.state.turnCount + 1
    });
  }

  // 添加工具结果
  addToolResult(toolName, result) {
    return this.update({
      toolResults: [...this.state.toolResults, { toolName, result, timestamp: Date.now() }]
    });
  }

  // 记录错误
  addError(error) {
    return this.update({
      errors: [...this.state.errors, { error, timestamp: Date.now() }]
    });
  }

  // 更新指标
  updateMetrics(updates) {
    return this.update({
      metrics: { ...this.state.metrics, ...updates }
    });
  }

  // 检查是否需要压缩
  needsCompaction(maxTokens = 100000) {
    const tokenCount = this.estimateTokens();
    const usageRatio = tokenCount / maxTokens;
    
    // 超过75%时触发压缩
    return usageRatio > 0.75;
  }

  // 估算当前token数
  estimateTokens() {
    let total = 0;
    for (const msg of this.state.messages) {
      total += JSON.stringify(msg).length / 4; // 粗略估计
    }
    for (const result of this.state.toolResults) {
      total += JSON.stringify(result).length / 4;
    }
    return total;
  }

  // 序列化（用于持久化）
  serialize() {
    return JSON.stringify(this.state);
  }

  // 反序列化
  static deserialize(json) {
    return new AgentState(JSON.parse(json));
  }
}

// 使用示例
let state = new AgentState();
state = state.addMessage({ role: 'user', content: 'Hello' });
state = state.addToolResult('Read', { content: 'File content...' });
state = state.updateMetrics({ totalTokens: 1000 });

if (state.needsCompaction()) {
  // 执行压缩
}
