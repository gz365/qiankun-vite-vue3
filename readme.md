# qiankun 微应用 vite+vue3+qiankun 搭建案例

## 一、基座应用

### 1、路由

在原有应用中引入 qiankun  
`npm i qiankun -S`

在入口文件 main.js 中引入代码

```javascript
import { registerMicroApps, start } from 'qiankun';
registerMicroApps([
	{
		name: 'app0',
		entry: '//localhost:5000',
		container: '#yourContainer',
		activeRule: '/app0',
	},
	{
		name: 'app1',
		entry: '//localhost:5002',
		container: '#yourContainer',
		activeRule: '/app1',
	},
]);
```

### 2、微应用容器

```html
<div id="yourContainer"></div>
```

### 3、全局状态管理

```javascript
import { registerMicroApps, start } from 'qiankun';
const actions = initGlobalState({ msg: '状态初始化' });
actions.onGlobalStateChange((state, prev) => {
	console.log('base:', state, '←', prev);
});
const actions = initGlobalState({ msg: '状态初始化' });
// 监听状态改变
actions.onGlobalStateChange((state, prev) => {
	console.log('base:', state, '←', prev);
});
actions.setGlobalState({ msg: '基座改变状态' });
// 取消监听
actions.offGlobalStateChange();
```

## 二、微应用

### vite+vue3 案例

安装插件 `npm i vite-plugin-qiankun`  
修改 vite.config.js 中的配置

```javascript
import qiankun from 'vite-plugin-qiankun';
export default defineConfig({
	base: 'http://localhost:5000',
	plugins: [
		vue(),
		// 需要和基座路由中保持一致
		qiankun('app0', {
			useDevMode: true,
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 5000,
		cors: true,
		origin: 'http://localhost:5000',
	},
});
```

修改入口文件

```javascript
import {
	renderWithQiankun,
	qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper';
const qiankunEjected = qiankunWindow.__POWERED_BY_QIANKUN__;
let app;
function render(container) {
	app = createApp(App);
	app.use(createPinia());
	// 微应用路由路径需要进行判断
	app.use(createRouter(qiankunEjected ? '/app0' : '/'));
	app.mount(container ? container.querySelector('#app') : '#app');
}
// eslint-disable-next-line no-undef
console.log(qiankunEjected, '子应用注入qiankun');
if (!qiankunEjected) {
	render();
} else {
	const initQianKun = () => {
		renderWithQiankun({
			// 当前应用在主应用中的生命周期
			// 文档 https://qiankun.umijs.org/zh/guide/getting-started#
			mount(props) {
				render(props.container); //  可以通过props读取主应用的参数：msg
				// 监听主应用传值
				props.onGlobalStateChange((state, prev) => {
					console.log('app0:', state, '←', prev);
				});
				props.setGlobalState({
					msg: '子应用改变状态',
				});
			},
			bootstrap() {},
			unmount() {},
			update: function (props) {
				console.log(props, 'update');
				throw new Error('Function not implemented.');
			},
		});
	};
	initQianKun();
}
```
