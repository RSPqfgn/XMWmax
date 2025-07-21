# XMWmax 插件开发指南

## 插件基本结构

一个XMWmax插件是一个JavaScript对象，需要包含以下属性：

插件对象必须包含以下属性：
- `name`: 插件名称
- `version`: 插件版本
- `author`: 作者信息
- `description`: 插件描述
- `init`: 必须的函数，作为插件初始化入口

```javascript
{
    name: '插件名称',
    version: '0.1',
    description: '插件描述',
    author: '作者名',
    
    // 必须实现的初始化函数
    init: function() {
        // 在这里实现插件功能
    }
}
```
### 示例插件
```javascript
{
    name: '示例插件',
    version: '1.0',
    author: '开发者',
    description: '这是一个示例插件',
    enabled: true,
    init: function() {
        alert('示例插件已加载！');
    }
}
```

## 插件加载方式

### 1. 手动加载

在浏览器控制台中执行：
```javascript
XMWmax.registerPlugin({
    name: '示例插件',
    version: '1.0.0',
    author: '作者名',
    description: '插件描述',
    enabled: true,
    init: function() {
        
    }
});
```

### 2. 从URL加载

```javascript
// 从URL加载插件
const pluginUrl = 'https://example.com/path/to/plugin.js';

fetch(pluginUrl)
    .then(response => response.text())
    .then(code => {
        const plugin = eval(`(${code})`);
        XMWmax.registerPlugin(plugin);
    })
    .catch(err => {
        console.error('插件加载失败:', err);
        XMWmax.showNotification('插件加载失败', 'error');
    });
```

### 3. 通过Tampermonkey菜单加载

1. 点击浏览器右上角的Tampermonkey图标
2. 选择"打开XMWmax管理"菜单项
3. 在管理界面中选择"添加插件"标签
4. 可以选择手动粘贴插件代码或输入插件URL加载

## 插件开发建议

1. 为插件添加唯一的名称和版本号
2. 在init函数中添加try-catch处理错误
3. 避免修改XMWmax核心代码
4. 插件应保持独立，不依赖其他特定插件

## 插件管理

插件可以通过UI界面进行管理，包括以下功能：

1. **启用/禁用插件**：点击插件卡片上的"启用"或"禁用"按钮切换插件状态
2. **编辑插件**：点击"编辑"按钮可将插件完整代码（包括init函数）加载到编辑区进行修改。系统会正确处理函数序列化问题。
3. **删除插件**：点击"删除"按钮并确认后移除插件
4. **重名检测**：系统会检查插件名称和作者是否已存在，防止重复注册

## 插件发布

~~插件市场之类的还没写~~
将你的插件代码发布到任意可访问的URL，用户可以通过URL加载你的插件。