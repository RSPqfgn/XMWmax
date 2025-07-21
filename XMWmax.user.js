// ==UserScript==
// @name         XMWmax
// @version      0.0.1
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
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: #fff;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            border-radius: 8px;
            z-index: 9999;
            overflow: hidden;
            display: none;
        }
        
        .xmwmax-header {
            background: #4a6baf;
            color: white;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .xmwmax-header h2 {
            margin: 0;
            font-size: 16px;
        }
        
        .xmwmax-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }
        
        .xmwmax-tabs {
            display: flex;
            border-bottom: 1px solid #eee;
        }
        
        .xmwmax-tabs button {
            flex: 1;
            padding: 10px;
            background: none;
            border: none;
            cursor: pointer;
        }
        
        .xmwmax-tabs button.active {
            border-bottom: 2px solid #4a6baf;
        }
        
        .xmwmax-content {
            padding: 16px;
            max-height: calc(80vh - 120px);
            overflow-y: auto;
        }
        
        .xmwmax-tab-content {
            display: none;
        }
        
        .xmwmax-tab-content.active {
            display: block;
        }
        
        .xmwmax-plugin-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .xmwmax-plugin-list li {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        
        .xmwmax-plugin-info h4 {
            margin: 0 0 8px;
            color: #4a6baf;
        }
        
        .xmwmax-plugin-info p {
            margin: 4px 0;
            font-size: 14px;
            color: #666;
        }
        
        .xmwmax-plugin-actions {
            margin-top: 10px;
            display: flex;
            gap: 8px;
        }
        
        .xmwmax-plugin-actions button {
            padding: 4px 8px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: #f5f5f5;
            cursor: pointer;
        }
        
        .xmwmax-plugin-actions button:hover {
            background: #e5e5e5;
        }
        
        .xmwmax-plugin-actions .xmwmax-toggle-btn {
            background: #4a6baf;
            color: white;
            border-color: #3a5a9f;
        }
        
        .xmwmax-plugin-actions .xmwmax-delete-btn {
            background: #f44336;
            color: white;
            border-color: #d32f2f;
        }
        
        .xmwmax-upload-area,
        .xmwmax-url-area {
            margin-bottom: 16px;
        }
        
        .xmwmax-upload-area textarea {
            width: 100%;
            height: 200px;
            padding: 8px;
            margin-bottom: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            min-height: 200px;
        }
        
        .xmwmax-url-area input {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .xmwmax-add-btn,
        .xmwmax-load-btn {
            background: #4a6baf;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .xmwmax-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 4px;
            color: white;
            z-index: 10000;
            animation: fadeIn 0.3s;
        }
        
        .xmwmax-notification.success {
            background: #4CAF50;
        }
        
        .xmwmax-notification.error {
            background: #F44336;
        }
        
        .xmwmax-notification.info {
            background: #2196F3;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 插件系统核心
    const XMWmax = {
        plugins: [],
        
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
        
        // 注册插件
        registerPlugin: function(plugin) {
            // 先处理已序列化的插件对象
            let pluginToRegister = {...plugin};
            
            // 如果是序列化的函数，先反序列化
            if (plugin.init && typeof plugin.init === 'object' && plugin.init.type === 'function') {
                try {
                    pluginToRegister.init = XMWmax.deserializeFunction(plugin.init);
                    console.log('反序列化后的init函数:', pluginToRegister.init.toString());
                } catch (e) {
                    console.error(`插件 ${plugin.name} 函数反序列化失败:`, e);
                    return; // 静默失败，不抛出错误
                }
            }
            
            // 验证插件对象有效性
            if (!pluginToRegister || typeof pluginToRegister !== 'object') {
                throw new Error('无效的插件对象');
            }
            
            // 检查必需字段
            if (!pluginToRegister.name || !pluginToRegister.author || !pluginToRegister.version || !pluginToRegister.description) {
                throw new Error('插件缺少必要字段（name, author, version, description）');
            }
            
            // 验证init函数
            if (!pluginToRegister.init || typeof pluginToRegister.init !== 'function') {
                    console.error('插件必须包含有效的init函数:', pluginToRegister.init);
                    return; // 静默失败，不抛出错误
            }
            
            // 添加调试信息
            console.log('注册插件:', pluginToRegister.name);
            console.log('init函数类型:', typeof pluginToRegister.init);
            
            // 检查是否已存在同名同作者的插件
            const exists = this.plugins.some(p => 
                p.name === plugin.name && p.author === plugin.author
            );
            
            if (exists) {
                throw new Error('已存在同名同作者的插件');
            }
            
            // 保留原始启用状态，如果没有设置则默认启用
            pluginToRegister.enabled = plugin.enabled !== undefined ? plugin.enabled : true;
            
            // 序列化init函数用于存储，同时保留其他属性
            const serializedPlugin = {
                ...pluginToRegister,
                init: this.serializeFunction(pluginToRegister.init),
                enabled: pluginToRegister.enabled  // 确保启用状态被保留
            };
            
            // 添加调试信息
            console.log('序列化后的插件:', serializedPlugin);
            
            // 添加插件到列表
            this.plugins.push(serializedPlugin);
            this.showNotification(`插件 ${plugin.name} 已加载`, 'success');
            this.updateUI();
            
            // 保存插件到存储
            GM_setValue('xmwmax_plugins', this.plugins);
        },
        
        // 初始化所有插件
        initPlugins: function() {
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
                    if (typeof plugin.init === 'function') {
                        plugin.init();
                        console.log(`插件 ${plugin.name} 初始化完成`);
                    }
                } catch (e) {
                    console.error(`插件 ${plugin.name} 初始化失败:`, e);
                }
            });
        },
        
        // 从URL加载插件
        loadPluginFromUrl: function(url) {
            this.showNotification('正在加载插件...', 'info');
            fetch(url)
                .then(response => response.text())
                .then(code => {
                    const plugin = eval(`(${code})`);
                    this.registerPlugin(plugin);
                })
                .catch(err => {
                    console.error('插件加载失败:', err);
                });
        },
        
        // 显示通知
        showNotification: function(message, type) {
            const notification = document.createElement('div');
            notification.className = `xmwmax-notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        },
        
        // 创建UI
        createUI: function() {
            const ui = document.createElement('div');
            ui.id = 'xmwmax-ui';
            ui.innerHTML = `
                <div class="xmwmax-header">
                    <h2>XMWmax 插件管理器</h2>
                    <button class="xmwmax-close">×</button>
                </div>
                <div class="xmwmax-tabs">
                    <button class="active">已安装插件</button>
                    <button>添加插件</button>
                </div>
                <div class="xmwmax-content">
                    <div class="xmwmax-tab-content active" id="installed-plugins">
                        <ul class="xmwmax-plugin-list"></ul>
                    </div>
                    <div class="xmwmax-tab-content" id="add-plugin">
                        <div class="xmwmax-upload-area">
                            <h3>手动添加插件</h3>
                            <textarea placeholder="粘贴插件代码..."></textarea>
                            <button class="xmwmax-add-btn">添加插件</button>
                        </div>
                        <div class="xmwmax-url-area">
                            <h3>从URL添加</h3>
                            <input type="text" placeholder="输入插件URL...">
                            <button class="xmwmax-load-btn">加载插件</button>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加事件监听
            ui.querySelector('.xmwmax-close').addEventListener('click', () => {
                ui.style.display = 'none';
            });
            
            ui.querySelectorAll('.xmwmax-tabs button').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    ui.querySelectorAll('.xmwmax-tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    ui.querySelectorAll('.xmwmax-tabs button').forEach(b => {
                        b.classList.remove('active');
                    });
                    btn.classList.add('active');
                    ui.querySelector(`.xmwmax-tab-content:nth-child(${index + 1})`).classList.add('active');
                });
            });
            
            // 手动添加插件
            ui.querySelector('.xmwmax-add-btn').addEventListener('click', () => {
                const code = ui.querySelector('textarea').value;
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
                    
                    // 检查init函数是否存在
                    if (!pluginObj.init || typeof pluginObj.init !== 'function') {
                        throw new Error('插件必须包含init函数');
                    }
                    
                    // 使用统一的函数反序列化方法
                    const plugin = {
                        ...pluginObj,
                        init: XMWmax.deserializeFunction(pluginObj.init)
                    };
                    
                    // 添加调试信息
                    console.log('解析后init函数:', plugin.init.toString());
                    
                    if (typeof plugin.init !== 'function') {
                        throw new Error('插件必须包含有效的init函数');
                    }
                    
                    // 立即执行一次init函数以验证有效性
                    if (plugin.enabled !== false && typeof plugin.init === 'function') {
                        plugin.init();
                    }
                    
                    this.registerPlugin(plugin);
                    ui.querySelector('textarea').value = '';
                } catch (e) {
                    console.error('插件代码无效:', e);
                }
            });
            
            // 从URL加载插件
            ui.querySelector('.xmwmax-load-btn').addEventListener('click', () => {
                const url = ui.querySelector('input[type="text"]').value;
                if (!url.trim()) return;
                
                this.loadPluginFromUrl(url);
                ui.querySelector('input[type="text"]').value = '';
            });
            
            document.body.appendChild(ui);
            this.ui = ui;
            this.updateUI();
            
            // 添加插件管理事件
            ui.addEventListener('click', (e) => {
                if (e.target.classList.contains('xmwmax-toggle-btn')) {
                    const pluginName = e.target.dataset.plugin;
                    const pluginAuthor = e.target.dataset.author;
                    const plugin = this.plugins.find(p => 
                        p.name === pluginName && p.author === pluginAuthor
                    );
                    if (plugin) {
                        plugin.enabled = !plugin.enabled;
                        this.showNotification(
                            `插件 ${plugin.name} 已${plugin.enabled ? '启用' : '禁用'}`,
                            plugin.enabled ? 'success' : 'warning'
                        );
                        GM_setValue('xmwmax_plugins', this.plugins);
                        this.updateUI();
                    }
                } else if (e.target.classList.contains('xmwmax-delete-btn')) {
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
                                    
                                    // 返回可读的函数字符串
                                    return rawFunc.toString();
                                } catch (e) {
                                    console.error('获取函数源码失败:', e);
                                    return 'function() {\n    // 函数解析失败\n}';
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

                        this.ui.querySelector('textarea').value = JSON.stringify(pluginCode, null, 2);
                        this.ui.querySelector('.xmwmax-tabs button:nth-child(2)').click();
                    }
                }
            });
        },
        
        // 更新UI
        updateUI: function() {
            if (!this.ui) return;
            
            const list = this.ui.querySelector('.xmwmax-plugin-list');
            list.innerHTML = '';
            
            if (this.plugins.length === 0) {
                const emptyMsg = document.createElement('li');
                emptyMsg.className = 'xmwmax-empty';
                emptyMsg.innerHTML = `
                    <div class="xmwmax-plugin-info">
                        <h4>暂无插件</h4>
                        <p>请点击"添加插件"标签安装新插件</p>
                    </div>
                `;
                list.appendChild(emptyMsg);
            } else {
                this.plugins.forEach(plugin => {
                    const item = document.createElement('li');
                    item.innerHTML = `
                        <div class="xmwmax-plugin-info">
                            <h4>${plugin.name}</h4>
                            <p>版本: ${plugin.version}</p>
                            <p>作者: ${plugin.author}</p>
                            <p>${plugin.description}</p>
                            <div class="xmwmax-plugin-actions">
                                <button class="xmwmax-toggle-btn" data-plugin="${plugin.name}" data-author="${plugin.author}" style="${plugin.enabled === false ? 'opacity:0.7;' : ''}">
                                    ${plugin.enabled ? '禁用' : '启用'}
                                </button>
                                <span style="margin-left:8px;color:${plugin.enabled === false ? '#f44336' : '#4CAF50'}">
                                    ${plugin.enabled === false ? '已禁用' : '已启用'}
                                </span>
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
                this.ui.style.display = 'block'; // 首次创建时默认显示
            } else {
                this.ui.style.display = this.ui.style.display === 'none' ? 'block' : 'none';
            }
        }
    };
    
    // 暴露API到全局
    window.XMWmax = XMWmax;
    
    // 注册Tampermonkey菜单
    GM_registerMenuCommand('打开XMWmax管理', () => {
        XMWmax.toggleUI();
    });
    
    // 从存储加载插件
    const savedPlugins = GM_getValue('xmwmax_plugins', []);
    if (savedPlugins.length > 0) {
        savedPlugins.forEach(plugin => {
            try {
                // 添加调试信息
                console.log('加载插件:', plugin.name);
                console.log('原始init:', plugin.init);
                
                    // 检查是否是已序列化的插件
                    if (plugin.init && typeof plugin.init === 'object' && plugin.init.type === 'function') {
                        // 使用XMWmax.deserializeFunction恢复函数，同时保留原始状态
                        const restoredPlugin = {
                            ...plugin,
                            init: XMWmax.deserializeFunction(plugin.init),
                            enabled: plugin.enabled !== undefined ? plugin.enabled : true  // 确保状态正确恢复
                        };
                    
                    // 添加调试信息
                    console.log('解析后init函数:', restoredPlugin.init.toString());
                    
                    // 立即执行一次init函数以验证有效性
                    if (restoredPlugin.enabled !== false && typeof restoredPlugin.init === 'function') {
                        restoredPlugin.init();
                    }
                    
                    XMWmax.registerPlugin(restoredPlugin);
                } else {
                    // 处理旧格式的插件
                    const restoredPlugin = {
                        ...plugin,
                        init: typeof plugin.init === 'object' ? 
                            XMWmax.deserializeFunction(plugin.init) : 
                            (typeof plugin.init === 'function' ? plugin.init : function(){})
                    };
                    
                    // 添加调试信息
                    console.log('解析后init函数:', restoredPlugin.init.toString());
                    
                    // 立即执行一次init函数以验证有效性
                    if (restoredPlugin.enabled !== false && typeof restoredPlugin.init === 'function') {
                        restoredPlugin.init();
                    }
                    
                    XMWmax.registerPlugin(restoredPlugin);
                }
            } catch (e) {
                console.error('加载保存的插件失败:', e);
                // 即使单个插件加载失败，也要继续加载其他插件
                this.showNotification(`插件 ${plugin.name} 加载失败`, 'error');
            }
        });
    }
    
    // 添加触发按钮
    // 创建并添加触发按钮
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'xmwmax-trigger';
    triggerBtn.innerHTML = 'XMWmax';
    triggerBtn.style.position = 'fixed';
    triggerBtn.style.bottom = '20px';
    triggerBtn.style.right = '20px';
    triggerBtn.style.zIndex = '9998';
    triggerBtn.style.padding = '8px 16px';
    triggerBtn.style.background = '#4a6baf';
    triggerBtn.style.color = 'white';
    triggerBtn.style.border = 'none';
    triggerBtn.style.borderRadius = '4px';
    triggerBtn.style.cursor = 'pointer';
    triggerBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    // 添加点击事件监听器
    triggerBtn.addEventListener('click', () => {
        console.log('XMWmax按钮被点击');
        XMWmax.toggleUI();
    });
    
    document.body.appendChild(triggerBtn);
    
    // 页面加载完成后初始化插件
    window.addEventListener('load', () => {
        XMWmax.initPlugins();
    });
})();