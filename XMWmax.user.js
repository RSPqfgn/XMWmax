// ==UserScript==
// @name         XMWmax
// @version      0.0.2
// @description  强大的小码王增强脚本
// @author       RSPqfgn
// @match        https://world.xiaomawang.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        #xmwmax-ui {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 800px;
            height: 600px;
            background: #fff;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            border-radius: 8px;
            z-index: 9999;
            display: flex;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        #xmwmax-trigger svg {
            width: 24px;
            height: 24px;
            color: white;
        }
        
        .xmwmax-sidebar {
            width: 70px;
            background: linear-gradient(180deg, #2c3e50, #1a2530);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px 0;
            transition: all 0.3s ease;
            box-shadow: 3px 0 10px rgba(0,0,0,0.1);
            z-index: 10;
        }
        
        .xmwmax-sidebar-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: transparent;
            border: none;
            cursor: pointer;
            margin-bottom: 15px;
            position: relative;
            transition: all 0.2s ease;
            color: #a0b3c6;
        }
        
        .xmwmax-sidebar-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            color: #ffffff;
            transform: translateY(-2px);
        }
        
        .xmwmax-sidebar-btn.active {
            background: rgba(255, 255, 255, 0.2);
            color: #64b5f6;
        }
        
        .xmwmax-sidebar-btn svg {
            width: 24px;
            height: 24px;
        }
        
        .xmwmax-sidebar-btn::after {
            content: attr(data-tooltip);
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 15px;
            padding: 6px 12px;
            background: #2c3e50;
            color: white;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .xmwmax-sidebar-btn:hover::after {
            opacity: 1;
            visibility: visible;
        }
        
        .xmwmax-main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            background: #f5f7fa;
        }
        
        .xmwmax-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            z-index: 5;
            user-select: none; /* 防止标题被选中 */
            cursor: move; /* 显示拖动光标 */
        }
        
        .xmwmax-header h2 {
            margin: 0;
            color: #2c3e50;
            font-size: 20px;
            font-weight: 600;
        }
        
        .xmwmax-close {
            background: #f1f5f9;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            color: #64748b;
        }
        
        .xmwmax-close:hover {
            background: #e2e8f0;
            transform: rotate(90deg);
        }
        
        .xmwmax-close svg {
            width: 20px;
            height: 20px;
        }
        
        .xmwmax-content-container {
            flex: 1;
            overflow: auto;
            padding: 20px;
        }
        
        .xmwmax-tab-content {
            display: none;
            animation: fadeIn 0.3s ease;
        }
        
        .xmwmax-tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .xmwmax-plugin-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .xmwmax-plugin-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }
        
        .xmwmax-plugin-card:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transform: translateY(-2px);
        }
        
        .xmwmax-plugin-info h3 {
            margin: 0 0 10px;
            color: #2c3e50;
            font-size: 18px;
        }
        
        .xmwmax-plugin-meta {
            display: flex;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .xmwmax-plugin-meta span {
            margin-right: 20px;
            color: #64748b;
        }
        
        .xmwmax-plugin-meta span strong {
            color: #2c3e50;
        }
        
        .xmwmax-plugin-description {
            color: #64748b;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .xmwmax-plugin-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .xmwmax-plugin-actions button {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .xmwmax-plugin-actions button:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        
        .xmwmax-toggle-btn {
            background: #3b82f6;
            color: white;
        }
        
        .xmwmax-toggle-btn:hover {
            background: #2563eb;
        }
        
        .xmwmax-toggle-btn.off {
            background: #94a3b8;
        }
        
        .xmwmax-toggle-btn.off:hover {
            background: #64748b;
        }
        
        .xmwmax-edit-btn {
            background: #f1f5f9;
            color: #334155;
        }
        
        .xmwmax-edit-btn:hover {
            background: #e2e8f0;
        }
        
        .xmwmax-delete-btn {
            background: #ef4444;
            color: white;
            margin-left: auto;
        }
        
        .xmwmax-delete-btn:hover {
            background: #dc2626;
        }
        
        .xmwmax-section {
            background: white;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }
        
        .xmwmax-section-title {
            margin-top: 0;
            color: #2c3e50;
            font-size: 18px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .xmwmax-form-group {
            margin-bottom: 20px;
        }
        
        .xmwmax-form-group label {
            display: block;
            margin-bottom: 8px;
            color: #334155;
            font-weight: 500;
        }
        
        .xmwmax-form-group textarea,
        .xmwmax-form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-family: inherit;
            font-size: 14px;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }
        
        .xmwmax-form-group textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        .xmwmax-form-group textarea:focus,
        .xmwmax-form-group input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        
        /* 特别设置样式名称输入框的宽度 */
        #style-name {
            width: 100%;
            max-width: 500px;
        }
        
        /* 关于页面样式 */
        .xmwmax-about-content {
            padding: 20px 0;
        }
        
        .xmwmax-about-item {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 5px;
            background-color: #f8fafc;
            display: flex;
            flex-wrap: wrap;
        }
        
        .xmwmax-about-item strong {
            width: 100px;
            color: #2c3e50;
            font-weight: 600;
        }
        
        .xmwmax-about-item span,
        .xmwmax-about-item a {
            flex: 1;
            color: #334155;
            text-decoration: none;
        }
        
        .xmwmax-about-item a:hover {
            text-decoration: underline;
            color: #3b82f6;
        }
        
        .xmwmax-btn {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        
        .xmwmax-btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .xmwmax-btn-primary:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }
        
        .xmwmax-empty-state {
            text-align: center;
            padding: 50px 20px;
            color: #94a3b8;
        }
        
        .xmwmax-empty-state svg {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            color: #cbd5e1;
        }
        
        .xmwmax-empty-state h3 {
            margin: 0 0 10px;
            color: #64748b;
        }
        
        .xmwmax-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }
        
        .xmwmax-notification.success {
            background: #10b981;
        }
        
        .xmwmax-notification.error {
            background: #ef4444;
        }
        
        .xmwmax-notification.info {
            background: #3b82f6;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
        
        .xmwmax-status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .xmwmax-status-enabled {
            background: #10b981;
        }
        
        .xmwmax-status-disabled {
            background: #ef4444;
        }
    `;
    document.head.appendChild(style);

    // 插件系统核心
    const XMWmax = {
        plugins: [],
        customStyles: {}, // 存储自定义样式
        styleElement: null, // 用于应用自定义样式的元素
        
        // 初始化自定义样式
        initCustomStyles: function() {
            // 创建样式元素
            this.styleElement = document.createElement('style');
            this.styleElement.id = 'xmwmax-custom-styles';
            document.head.appendChild(this.styleElement);
            
            // 加载已保存的样式
            this.loadCustomStyles();
        },

        // 加载已保存的样式
        loadCustomStyles: function() {
            const savedStyles = GM_getValue('xmwmax_custom_styles', {});
            this.customStyles = savedStyles;
            this.applyCustomStyles();
            this.updateStylesUI();
        },

        // 应用所有自定义样式
        applyCustomStyles: function() {
            if (!this.styleElement) return;
            
            let cssText = '';
            for (const name in this.customStyles) {
                if (this.customStyles[name].enabled !== false) {
                    cssText += `/* ${name} */\n${this.customStyles[name].code}\n\n`;
                }
            }
            this.styleElement.textContent = cssText;
        },

        // 加载单个样式（应用到页面）
        loadCustomStyle: function(name, code) {
            if (!this.styleElement) return;
            
            this.customStyles[name] = {
                code: code,
                enabled: true
            };
            
            this.applyCustomStyles();
        },

        // 保存样式到存储
        saveCustomStyle: function(name, code) {
            this.customStyles[name] = {
                code: code,
                enabled: true
            };
            
            GM_setValue('xmwmax_custom_styles', this.customStyles);
        },

        // 删除样式
        deleteCustomStyle: function(name) {
            delete this.customStyles[name];
            GM_setValue('xmwmax_custom_styles', this.customStyles);
            this.applyCustomStyles();
        },

        // 切换样式启用状态
        toggleCustomStyle: function(name) {
            if (this.customStyles[name]) {
                this.customStyles[name].enabled = !this.customStyles[name].enabled;
                GM_setValue('xmwmax_custom_styles', this.customStyles);
                this.applyCustomStyles();
            }
        },

        // 更新样式管理界面
        updateStylesUI: function() {
            if (!this.ui) return;
            
            const list = this.ui.querySelector('.xmwmax-style-list');
            if (!list) return;
            
            list.innerHTML = '';
            
            if (Object.keys(this.customStyles).length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'xmwmax-empty-state';
                emptyState.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                        <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                        <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                    <h3>暂无样式</h3>
                    <p>在上方添加自定义CSS样式</p>
                `;
                list.appendChild(emptyState);
            } else {
                for (const name in this.customStyles) {
                    const style = this.customStyles[name];
                    const item = document.createElement('li');
                    item.className = 'xmwmax-plugin-card';
                    item.innerHTML = `
                        <div class="xmwmax-plugin-info">
                            <h3>${name}</h3>
                            <div class="xmwmax-plugin-meta">
                                <span>
                                    <span class="xmwmax-status-indicator ${style.enabled ? 'xmwmax-status-enabled' : 'xmwmax-status-disabled'}"></span>
                                    ${style.enabled ? '已启用' : '已禁用'}
                                </span>
                            </div>
                            <div class="xmwmax-plugin-actions">
                                <button class="xmwmax-toggle-btn ${style.enabled ? '' : 'off'}" data-style="${name}">
                                    ${style.enabled ? '禁用' : '启用'}
                                </button>
                                <button class="xmwmax-delete-btn" data-style="${name}">删除</button>
                            </div>
                        </div>
                    `;
                    list.appendChild(item);
                }
                
                // 先移除之前添加的事件监听器，避免重复触发
                const newToggleButtons = list.querySelectorAll('.xmwmax-toggle-btn');
                const newDeleteButtons = list.querySelectorAll('.xmwmax-delete-btn');
                
                // 为切换按钮添加事件监听器
                newToggleButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const styleName = e.target.dataset.style;
                        this.toggleCustomStyle(styleName);
                        this.updateStylesUI();
                        this.showNotification(`样式 "${styleName}" 已${this.customStyles[styleName].enabled ? '启用' : '禁用'}`, 'success');
                    });
                });
                
                // 为删除按钮添加事件监听器
                newDeleteButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const styleName = e.target.dataset.style;
                        if (confirm(`确定要删除样式 "${styleName}" 吗?`)) {
                            this.deleteCustomStyle(styleName);
                            this.updateStylesUI();
                            this.showNotification(`样式 "${styleName}" 已删除`, 'info');
                        }
                    });
                });
            }
        },
        
        // 函数序列化方法
        serializeFunction: function(fn) {
            try {
                if (!fn || typeof fn !== 'function') return { type: 'function', source: 'function(){}' };
                
                // 使用Base64编码函数字符串
                const fnStr = btoa(unescape(encodeURIComponent(fn.toString())));
                return { 
                    type: 'function', 
                    source: fnStr,
                    encoded: true // 标记为已编码
                };
            } catch (e) {
                console.error('函数序列化失败:', e);
                return { type: 'function', source: 'function(){}' };
            }
        },
        
        // 函数反序列化方法
        deserializeFunction: function(obj) {
            try {
                if (typeof obj === 'function') return obj;
                if (!obj || obj.source === 'function(){}') return function(){};
                
                // 处理函数字符串
                let source = obj.source;
                
                // 如果是Base64编码的函数字符串，先解码
                if (obj.encoded || !obj.source.startsWith('function')) {
                    try {
                        // 尝试多种解码方式
                        try {
                            source = decodeURIComponent(escape(atob(source)));
                        } catch (e) {
                            console.warn('标准解码失败，尝试备用解码方式:', e);
                            // 备用解码方式
                            source = decodeURIComponent(atob(source).split('').map(function(c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join(''));
                        }
                        
                        // 确保函数格式正确
                        if (!source.startsWith('(') && !source.startsWith('function')) {
                            source = `(${source})`;
                        }
                    } catch (e) {
                        console.error('Base64解码失败:', e);
                        return function(){};
                    }
                }
                
                // 确保函数能够正确解析
                const fn = new Function(`return ${source}`)();
                if (typeof fn !== 'function') throw new Error('反序列化结果不是函数');
                
                // 添加调试信息
                console.log('成功解析函数:', source);
                
                return fn;
            } catch (e) {
                console.error('函数反序列化失败:', e);
                return function(){};
            }
        },
        
        // 初始化所有插件
        initPlugins: function() {
            // 注意：这里不再从存储加载插件，只初始化已存在的插件
            // 从存储加载插件已移至loadPluginsFromStorage方法中
            
            // 先更新UI显示当前状态
            this.updateUI();
            
            this.plugins.forEach(plugin => {
                try {
                    // 确保插件对象有效
                    if (!plugin || typeof plugin !== 'object') {
                        console.error('无效的插件对象');
                        return;
                    }
                    
                    // 在初始化前显示状态
                    if (plugin.enabled === false) {
                        console.log(`插件 ${plugin.name} 已禁用，跳过初始化`);
                        return;
                    }
                    
                    // 只有启用的插件才初始化
                    // 先反序列化init函数
                    const initFunction = typeof plugin.init === 'object' ? 
                        XMWmax.deserializeFunction(plugin.init) : 
                        plugin.init;
                    
                    if (typeof initFunction === 'function') {
                        initFunction();
                        console.log(`插件 ${plugin.name} 初始化完成`);
                    }
                } catch (e) {
                    console.error(`插件 ${plugin.name} 初始化失败:`, e);
                }
            });
        },
        
        // 从存储加载插件
        loadPluginsFromStorage: function() {
            const savedPlugins = GM_getValue('xmwmax_plugins', []);
            if (savedPlugins.length > 0) {
                let loadedCount = 0;
                let errorCount = 0;
                let replacedCount = 0;
                
                // 创建一个临时数组来存储插件，避免重复
                const tempPlugins = [];
                
                savedPlugins.forEach(plugin => {
                    try {
                        // 添加调试信息
                        console.log('加载插件:', plugin.name);
                        console.log('原始init:', plugin.init);
                        
                        // 检查是否已存在同名同作者的插件
                        const existsIndex = tempPlugins.findIndex(p => 
                            p.name === plugin.name && p.author === plugin.author
                        );
                        
                        // 如果存在同名插件，替换它
                        if (existsIndex !== -1) {
                            tempPlugins[existsIndex] = plugin;
                            replacedCount++;
                        } else {
                            // 不存在则直接添加
                            tempPlugins.push(plugin);
                        }
                        
                        loadedCount++;
                    } catch (e) {
                        console.error('加载保存的插件失败:', e);
                        errorCount++;
                    }
                });
                
                // 将临时数组赋值给插件列表
                this.plugins = tempPlugins;
                
                // 更新UI
                this.updateUI();
                
                // 显示一次性通知
                const messages = [];
                if (loadedCount > 0) {
                    messages.push(`已加载 ${loadedCount} 个插件`);
                }
                if (replacedCount > 0) {
                    messages.push(`已替换 ${replacedCount} 个重复插件`);
                }
                if (errorCount > 0) {
                    messages.push(`${errorCount} 个插件加载失败`);
                }
                
                if (messages.length > 0) {
                    this.showNotification(messages.join('，'), 'success');
                }
                
                // 保存插件到存储（重新序列化后保存）
                GM_setValue('xmwmax_plugins', this.plugins);
            }
        },
        
        // 从URL加载插件
        loadPluginFromUrl: function(url) {
            this.showNotification('正在加载插件...', 'info');
            fetch(url)
                .then(response => response.text())
                .then(code => {
                    const pluginObj = eval(`(${code})`);
                    
                    // 检查必需字段
                    if (!pluginObj.name || !pluginObj.author || !pluginObj.version || !pluginObj.description) {
                        throw new Error('插件缺少必要字段（name, author, version, description）');
                    }
                    
                    // 检查init函数是否存在
                    if (!pluginObj.init || typeof pluginObj.init !== 'function') {
                        throw new Error('插件必须包含init函数');
                    }
                    
                    // 检查是否已存在同名同作者的插件
                    const existsIndex = this.plugins.findIndex(p => 
                        p.name === pluginObj.name && p.author === pluginObj.author
                    );
                    
                    // 如果存在同名插件，询问是否替换
                    if (existsIndex !== -1) {
                        if (!confirm(`已存在同名同作者的插件 "${pluginObj.name}"，是否替换原插件？`)) {
                            this.showNotification('已取消加载插件', 'info');
                            return; // 用户选择不替换，直接返回
                        }
                        // 用户选择替换，先移除原插件
                        this.plugins.splice(existsIndex, 1);
                    }
                    
                    // 使用统一的函数反序列化方法
                    const plugin = {
                        ...pluginObj,
                        init: XMWmax.deserializeFunction(pluginObj.init)
                    };
                    
                    // 立即执行一次init函数以验证有效性
                    if (plugin.enabled !== false && typeof plugin.init === 'function') {
                        plugin.init();
                    }
                    
                    // 添加插件到列表
                    this.plugins.push({
                        ...plugin,
                        init: this.serializeFunction(plugin.init),
                        enabled: plugin.enabled !== undefined ? plugin.enabled : true
                    });
                    
                    this.showNotification(`插件 ${plugin.name} 已${existsIndex !== -1 ? '替换' : '加载'}`, 'success');
                    this.updateUI();
                    
                    // 保存插件到存储
                    GM_setValue('xmwmax_plugins', this.plugins);
                })
                .catch(err => {
                    console.error('插件加载失败:', err);
                    this.showNotification('插件加载失败: ' + err.message, 'error');
                });
        },
        
        // 显示通知
        showNotification: function(message, type) {
            // 移除现有的通知
            const existing = document.querySelector('.xmwmax-notification');
            if (existing) existing.remove();
            
            const notification = document.createElement('div');
            notification.className = `xmwmax-notification ${type}`;
            notification.innerHTML = `
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
            
            // 3秒后自动移除通知
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 3000);
        },
        
        // 创建插件管理窗口UI
        createUI: function() {
            const ui = document.createElement('div');
            ui.id = 'xmwmax-ui';
            
            // 设置初始位置（如果已保存）
            const savedPosition = GM_getValue('xmwmax_ui_position', null);
            if (savedPosition) {
                ui.style.left = savedPosition.left + 'px';
                ui.style.top = savedPosition.top + 'px';
            } else {
                // 默认位置
                ui.style.left = '20px';
                ui.style.top = '20px';
            }
            
            ui.innerHTML = `
                <div class="xmwmax-sidebar">
                    <button class="xmwmax-sidebar-btn active" data-tab="installed-plugins" data-tooltip="已安装插件">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                    </button>
                    <button class="xmwmax-sidebar-btn" data-tab="themes" data-tooltip="已安装样式">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="5"/>
                            <path d="M12 1v2"/>
                            <path d="M12 21v2"/>
                            <path d="M4.22 4.22l1.42 1.42"/>
                            <path d="M18.36 18.36l1.42 1.42"/>
                            <path d="M1 12h2"/>
                            <path d="M21 12h2"/>
                            <path d="M4.22 19.78l1.42-1.42"/>
                            <path d="M18.36 5.64l1.42-1.42"/>
                        </svg>
                    </button>
                    <button class="xmwmax-sidebar-btn" data-tab="add" data-tooltip="添加插件">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                    </button>
                    <button class="xmwmax-sidebar-btn" data-tab="settings" data-tooltip="系统设置">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                    </button>
                </div>
                <div class="xmwmax-main-content">
                    <div class="xmwmax-header">
                        <h2>XMWmax</h2>
                        <button class="xmwmax-close" title="关闭">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="xmwmax-content-container">
                        <div class="xmwmax-tab-content active" id="installed-plugins">
                            <div class="xmwmax-section">
                                <h3 class="xmwmax-section-title">已安装插件</h3>
                                <ul class="xmwmax-plugin-list"></ul>
                            </div>
                        </div>
                        <div class="xmwmax-tab-content" id="themes">
                            <div class="xmwmax-section">
                                <h3 class="xmwmax-section-title">样式管理</h3>
                                <div class="xmwmax-form-group">
                                    <label for="style-name">样式名称</label>
                                    <input type="text" id="style-name" placeholder="输入样式名称">
                                </div>
                                <div class="xmwmax-form-group">
                                    <label for="style-code">CSS代码</label>
                                    <textarea id="style-code" placeholder="输入CSS代码..."></textarea>
                                </div>
                                <button class="xmwmax-btn xmwmax-btn-primary xmwmax-add-style-btn">添加样式</button>
                            </div>
                            <div class="xmwmax-section">
                                <h3 class="xmwmax-section-title">已保存样式</h3>
                                <ul class="xmwmax-style-list"></ul>
                            </div>
                        </div>
                        <div class="xmwmax-tab-content" id="add">
                            <div class="xmwmax-section">
                                <h3 class="xmwmax-section-title">手动添加插件</h3>
                                <div class="xmwmax-form-group">
                                    <label for="plugin-code">插件代码</label>
                                    <textarea id="plugin-code" placeholder="粘贴插件代码..."></textarea>
                                </div>
                                <button class="xmwmax-btn xmwmax-btn-primary xmwmax-add-btn">添加插件</button>
                            </div>
                            <div class="xmwmax-section">
                                <h3 class="xmwmax-section-title">从URL添加</h3>
                                <div class="xmwmax-form-group">
                                    <label for="plugin-url">插件URL</label>
                                    <input type="text" id="plugin-url" placeholder="输入插件URL...">
                                </div>
                                <button class="xmwmax-btn xmwmax-btn-primary xmwmax-load-btn">加载插件</button>
                            </div>
                        </div>
                        <div class="xmwmax-tab-content" id="settings">
                            <div class="xmwmax-section">
                                <h3 class="xmwmax-section-title">关于 XMWmax</h3>
                                <div class="xmwmax-about-content">
                                    <div class="xmwmax-about-item">
                                        <strong>脚本名称:</strong>
                                        <span id="xmwmax-script-name"></span>
                                    </div>
                                    <div class="xmwmax-about-item">
                                        <strong>脚本版本:</strong>
                                        <span id="xmwmax-script-version"></span>
                                    </div>
                                    <div class="xmwmax-about-item">
                                        <strong>脚本作者:</strong>
                                        <span id="xmwmax-script-author"></span>
                                    </div>
                                    <div class="xmwmax-about-item">
                                        <strong>仓库地址:</strong>
                                        <a href="https://github.com/RSPqfgn/XMWmax" target="_blank" id="xmwmax-repo-link">https://github.com/RSPqfgn/XMWmax</a>
                                    </div>
                                    <div class="xmwmax-about-item">
                                        <strong>功能描述:</strong>
                                        <span>强大的小码王增强脚本，支持插件化扩展和自定义样式</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加事件监听
            ui.querySelector('.xmwmax-close').addEventListener('click', () => {
                ui.style.display = 'none';
            });
            
            // 初始化侧边栏按钮
            const sidebarBtns = ui.querySelectorAll('.xmwmax-sidebar-btn');
            sidebarBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.dataset.tab;
                    
                    // 移除所有按钮的active类
                    sidebarBtns.forEach(b => b.classList.remove('active'));
                    
                    // 为当前按钮添加active类
                    btn.classList.add('active');
                    
                    // 隐藏所有内容区域
                    ui.querySelectorAll('.xmwmax-tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    
                    // 显示对应的内容区域
                    ui.querySelector(`#${tabId}`).classList.add('active');
                });
            });
            
            // 手动添加插件
            ui.querySelector('.xmwmax-add-btn').addEventListener('click', () => {
                const code = ui.querySelector('#plugin-code').value;
                if (!code.trim()) return;
                
                try {
                    // 处理从编辑模式加载的插件
                    let pluginObj;
                    try {
                        pluginObj = JSON.parse(code);
                    } catch (e) {
                        // 如果不是标准JSON，尝试作为JavaScript对象直接解析
                        pluginObj = eval(`(${code})`);
                    }
                    
                    // 添加调试信息
                    console.log('解析插件代码:', pluginObj);
                    
                    // 检查必需字段
                    if (!pluginObj.name || !pluginObj.author || !pluginObj.version || !pluginObj.description) {
                        throw new Error('插件缺少必要字段（name, author, version, description）');
                    }
                    
                    // 检查init函数是否存在并处理不同格式
                    if (!pluginObj.init) {
                        throw new Error('插件必须包含init函数');
                    }
                    
                    let initFunction;
                    if (typeof pluginObj.init === 'string') {
                        // 如果init是字符串，尝试解析为函数
                        try {
                            initFunction = new Function(pluginObj.init);
                        } catch (e) {
                            throw new Error('插件init字段字符串无法解析为有效函数');
                        }
                    } else if (typeof pluginObj.init === 'function') {
                        // 如果init已经是函数
                        initFunction = pluginObj.init;
                    } else {
                        throw new Error('插件init字段必须是函数或可解析为函数的字符串');
                    }
                    
                    // 检查是否已存在同名同作者的插件
                    const existsIndex = this.plugins.findIndex(p => 
                        p.name === pluginObj.name && p.author === pluginObj.author
                    );
                    
                    // 如果存在同名插件，询问是否替换
                    if (existsIndex !== -1) {
                        if (!confirm(`已存在同名同作者的插件 "${pluginObj.name}"，是否替换原插件？`)) {
                            return; // 用户选择不替换，直接返回
                        }
                        // 用户选择替换，先移除原插件
                        this.plugins.splice(existsIndex, 1);
                    }
                    
                    // 构建插件对象
                    const plugin = {
                        ...pluginObj,
                        init: initFunction
                    };
                    
                    // 立即执行一次init函数以验证有效性
                    if (plugin.enabled !== false && typeof plugin.init === 'function') {
                        plugin.init();
                    }
                    
                    // 添加插件到列表
                    this.plugins.push({
                        ...plugin,
                        init: this.serializeFunction(plugin.init),
                        enabled: plugin.enabled !== undefined ? plugin.enabled : true
                    });
                    
                    this.showNotification(`插件 ${plugin.name} 已${existsIndex !== -1 ? '替换' : '加载'}`, 'success');
                    this.updateUI();
                    
                    // 保存插件到存储
                    GM_setValue('xmwmax_plugins', this.plugins);
                    
                    ui.querySelector('#plugin-code').value = '';
                } catch (e) {
                    console.error('插件代码无效:', e);
                    this.showNotification('插件代码无效: ' + e.message, 'error');
                }
            });
            
            // 从URL加载插件
            ui.querySelector('.xmwmax-load-btn').addEventListener('click', () => {
                const url = ui.querySelector('#plugin-url').value;
                if (!url.trim()) return;
                
                this.loadPluginFromUrl(url);
                ui.querySelector('#plugin-url').value = '';
            });
            
            document.body.appendChild(ui);
            this.ui = ui;
            this.updateUI();
            
            // 填充脚本信息到关于页面
            if (typeof GM_info !== 'undefined' && GM_info.script) {
                const scriptInfo = GM_info.script;
                document.getElementById('xmwmax-script-name').textContent = scriptInfo.name || 'XMWmax';
                document.getElementById('xmwmax-script-version').textContent = scriptInfo.version || '0.0.1';
                document.getElementById('xmwmax-script-author').textContent = scriptInfo.author || 'RSPqfgn';
            } else {
                // 如果GM_info不可用，显示获取失败
                document.getElementById('xmwmax-script-name').textContent = '获取失败';
                document.getElementById('xmwmax-script-version').textContent = '获取失败';
                document.getElementById('xmwmax-script-author').textContent = '获取失败';
            }
            
            // 添加拖动功能
            this.addDragFunctionality(ui);
            
            // 添加插件管理事件
            ui.addEventListener('click', (e) => {
                // 阻止事件在样式按钮上冒泡
                if (e.target.dataset.style) {
                    return;
                }
                
                if (e.target.classList.contains('xmwmax-toggle-btn')) {
                    // 插件切换按钮
                    const pluginName = e.target.dataset.plugin;
                    const pluginAuthor = e.target.dataset.author;
                    const plugin = this.plugins.find(p => 
                        p.name === pluginName && p.author === pluginAuthor
                    );
                    if (plugin) {
                        plugin.enabled = !plugin.enabled;
                        this.showNotification(
                            `插件 ${plugin.name} 已${plugin.enabled ? '启用' : '禁用'}`,
                            plugin.enabled ? 'success' : 'info'
                        );
                        GM_setValue('xmwmax_plugins', this.plugins);
                        this.updateUI();
                    }
                } else if (e.target.classList.contains('xmwmax-delete-btn')) {
                    // 插件删除按钮
                    const pluginName = e.target.dataset.plugin;
                    const pluginAuthor = e.target.dataset.author;
                    if (confirm(`确定要删除插件 ${pluginName} 吗?`)) {
                        this.plugins = this.plugins.filter(p => 
                            !(p.name === pluginName && p.author === pluginAuthor)
                        );
                        this.showNotification(`插件 ${pluginName} 已删除`, 'info');
                        GM_setValue('xmwmax_plugins', this.plugins);
                        this.updateUI();
                    }
                } else if (e.target.classList.contains('xmwmax-edit-btn')) {
                    const pluginName = e.target.dataset.plugin;
                    const pluginAuthor = e.target.dataset.author;
                    const plugin = this.plugins.find(p => 
                        p.name === pluginName && p.author === pluginAuthor
                    );
                    if (plugin) {
                        // 创建可编辑的插件对象
                        let pluginCode = {
                            name: plugin.name,
                            version: plugin.version,
                            author: plugin.author,
                            description: plugin.description,
                            enabled: plugin.enabled,
                            init: (() => {
                                try {
                                    // 获取原始函数代码
                                    const rawFunc = typeof plugin.init === 'object' ? 
                                        XMWmax.deserializeFunction(plugin.init) : 
                                        plugin.init;
                                    
                                    // 返回可读的函数字符串（仅返回函数体，不包含function()包装）
                                    const funcStr = rawFunc.toString();
                                    // 提取函数体部分
                                    const match = funcStr.match(/function\s*\(\)\s*{([\s\S]*)}/);
                                    if (match && match[1]) {
                                        return match[1].trim();
                                    }
                                    return funcStr;
                                } catch (e) {
                                    console.error('获取函数源码失败:', e);
                                    return 'alert("函数解析失败");';
                                }
                            })(),
                            meta: {
                                lastModified: new Date().toISOString(),
                                source: 'user_defined',
                                type: 'script'
                            }
                        };

                        // 仅记录调试信息，不进行严格验证
                        console.log('插件编辑:', plugin.name);
                        console.log('init函数源码:', pluginCode.init);

                        this.ui.querySelector('#plugin-code').value = JSON.stringify(pluginCode, null, 2);
                        // 切换到添加插件标签页
                        this.ui.querySelector('.xmwmax-sidebar-btn[data-tab="add"]').click();
                    }
                }
            });
            
            // 添加样式管理事件监听
            ui.querySelector('.xmwmax-add-style-btn').addEventListener('click', () => {
                const name = ui.querySelector('#style-name').value.trim();
                const code = ui.querySelector('#style-code').value.trim();
                
                if (!name || !code) {
                    this.showNotification('请填写样式名称和CSS代码', 'error');
                    return;
                }
                
                // 加载样式
                this.loadCustomStyle(name, code);
                
                // 保存样式
                this.saveCustomStyle(name, code);
                
                // 清空输入框
                ui.querySelector('#style-name').value = '';
                ui.querySelector('#style-code').value = '';
                
                // 更新样式列表
                this.updateStylesUI();
                
                this.showNotification(`样式 "${name}" 已添加`, 'success');
            });
            
            // 初始化自定义样式
            this.initCustomStyles();
        },
        
        // 更新UI
        updateUI: function() {
            if (!this.ui) return;
            
            const list = this.ui.querySelector('.xmwmax-plugin-list');
            list.innerHTML = '';
            
            if (this.plugins.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'xmwmax-empty-state';
                emptyState.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                        <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                        <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                    <h3>暂无插件</h3>
                    <p>点击左侧"添加插件"图标安装新插件</p>
                `;
                list.appendChild(emptyState);
            } else {
                this.plugins.forEach(plugin => {
                    const item = document.createElement('li');
                    item.className = 'xmwmax-plugin-card';
                    item.innerHTML = `
                        <div class="xmwmax-plugin-info">
                            <h3>${plugin.name}</h3>
                            <div class="xmwmax-plugin-meta">
                                <span><strong>版本:</strong> ${plugin.version}</span>
                                <span><strong>作者:</strong> ${plugin.author}</span>
                                <span>
                                    <span class="xmwmax-status-indicator ${plugin.enabled ? 'xmwmax-status-enabled' : 'xmwmax-status-disabled'}"></span>
                                    ${plugin.enabled ? '已启用' : '已禁用'}
                                </span>
                            </div>
                            <p class="xmwmax-plugin-description">${plugin.description}</p>
                            <div class="xmwmax-plugin-actions">
                                <button class="xmwmax-toggle-btn ${plugin.enabled ? '' : 'off'}" data-plugin="${plugin.name}" data-author="${plugin.author}">
                                    ${plugin.enabled ? '禁用' : '启用'}
                                </button>
                                <button class="xmwmax-edit-btn" data-plugin="${plugin.name}" data-author="${plugin.author}">编辑</button>
                                <button class="xmwmax-delete-btn" data-plugin="${plugin.name}" data-author="${plugin.author}">删除</button>
                            </div>
                        </div>
                    `;
                    list.appendChild(item);
                });
            }
        },
        
        // 切换UI可见性
        toggleUI: function() {
            if (!this.ui) {
                this.createUI();
                this.ui.style.display = 'flex'; // 首次创建时默认显示
            } else {
                this.ui.style.display = this.ui.style.display === 'none' ? 'flex' : 'none';
            }
        },
        
        // 添加拖动功能
        addDragFunctionality: function(ui) {
            const header = ui.querySelector('.xmwmax-header');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = parseInt(ui.style.left) || 0;
            let yOffset = parseInt(ui.style.top) || 0;
            
            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('mousemove', drag);
            
            function dragStart(e) {
                // 只有点击在标题栏且不是点击在按钮上时才允许拖动
                if (e.target === header || (header.contains(e.target) && e.target !== e.currentTarget.querySelector('.xmwmax-close'))) {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                    isDragging = true;
                }
            }
            
            function dragEnd() {
                initialX = currentX;
                initialY = currentY;
                
                isDragging = false;
                
                // 保存位置
                GM_setValue('xmwmax_ui_position', {
                    left: xOffset,
                    top: yOffset
                });
            }
            
            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    
                    xOffset = currentX;
                    yOffset = currentY;
                    
                    ui.style.left = currentX + 'px';
                    ui.style.top = currentY + 'px';
                }
            }
        },
    };
    
    // 暴露API到全局
    window.XMWmax = XMWmax;
    
    // 注册Tampermonkey菜单
    GM_registerMenuCommand('XMWmax', () => {
        XMWmax.toggleUI();
    });
    
    // 初始化自定义样式（在页面加载时立即生效）
    XMWmax.initCustomStyles();
    
    // 从存储加载插件
    XMWmax.loadPluginsFromStorage();
    
    // 页面加载完成后初始化插件
    window.addEventListener('load', () => {
        XMWmax.initPlugins();
    });
    
    // 添加触发按钮
    // 创建并添加触发按钮
    function createTriggerButton() {
        const triggerBtn = document.createElement('button');
        triggerBtn.id = 'xmwmax-trigger';
        triggerBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
        `;
        triggerBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9998;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #3b82f6;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            padding: 0;
        `;
        
        // 添加点击事件监听器
        triggerBtn.addEventListener('click', () => {
            console.log('XMWmax按钮被点击');
            XMWmax.toggleUI();
        });
        
        // 添加悬停效果
        triggerBtn.addEventListener('mouseenter', () => {
            triggerBtn.style.transform = 'translateY(-2px)';
            triggerBtn.style.boxShadow = '0 6px 15px rgba(59, 130, 246, 0.4)';
        });
        
        triggerBtn.addEventListener('mouseleave', () => {
            triggerBtn.style.transform = 'translateY(0)';
            triggerBtn.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.3)';
        });
        
        document.body.appendChild(triggerBtn);
        
        // 调试日志
        console.log('XMWmax触发按钮已创建:', triggerBtn);
    }
    
    // 在DOM加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createTriggerButton);
    } else {
        createTriggerButton();
    }
})();