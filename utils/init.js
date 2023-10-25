/**这个文件的作用主要就是用来初始化threeJS基础环境**/
// 初始化场景，摄像机，渲染器，轨道控制器，坐标轴，场景适配，渲染循环

// 引入threeJS
import * as THREE from "three"
// 引入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入将原生DOM转化为3D并且渲染到3D场景的方法(引入3d转换器与渲染器)
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'

// 声明场景、摄像机、3D渲染器、轨道控制器、3D原生DOM渲染器等全局变量
export let scene, camera, renderer, controls, css3dRenderer

// 初始化场景
(function init() {
    // 创建场景
    scene = new THREE.Scene();

    // 创建摄像机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    // 初始化摄像机位置
    camera.position.z = 0.1

    // 创建渲染器(画布 canvas)
    renderer = new THREE.WebGLRenderer({
        // 开启抗锯齿
        antialias: true
    })

    // 设置画布的大小
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 将渲染器添加到DOM
    document.body.appendChild(renderer.domElement)
})();

// 轨道控制器
(function createControls() {
    // 创建轨道控制器
    controls = new OrbitControls(camera, renderer.domElement)

    // 设置轨道控制器垂直方向旋转的角度
    controls.minPolarAngle = 0.25 * Math.PI

    // 开启阻尼效果
    controls.enableDamping = true

    // 禁止滚动缩放
    controls.enableZoom = false
})();

// 将原生dom3d渲染到3D场景中
(function create3dRenderer() {
    // 创建文本3d渲染器
    css3dRenderer = new CSS3DRenderer()
    // 设置文本渲染器的大小
    css3dRenderer.setSize(window.innerWidth, window.innerHeight)
    // 默认去除dom事件
    css3dRenderer.domElement.style.pointerEvents = "none"
    // 设置固定定位
    css3dRenderer.domElement.style.position = "fixed"
    // 设置距离左侧间距为0
    css3dRenderer.domElement.style.left = 0
    // 设置距离上侧间距为0
    css3dRenderer.domElement.style.top = 0
    // 添加到body中
    document.body.appendChild(css3dRenderer.domElement)
})();

// 坐标轴
(function createHelper() {
    // 创建坐标轴
    // const axesHelper = new THREE.AxesHelper()
    // 将坐标轴添加到场景
    // scene.add(axesHelper)
})();

// 场景适配
(function resizeRender() {
    // 监听浏览器窗口的变化
    window.addEventListener("resize", () => {
        //  重新设置画布大小
        renderer.setSize(window.innerWidth, window.innerHeight)
        // 重新设置摄像机宽高比
        camera.aspect = window.innerWidth / window.innerHeight
        // 重新更新锥体空间
        camera.updateProjectionMatrix()
    })
})();

// 循环渲染
(function renderLoop() {
    // 通过轨道控制器实例方法调用update实现场景更新
    controls.update()

    // 将场景和摄像机渲染到画布上面
    renderer.render(scene, camera)

    // 场景和摄像机渲染到文本画布上面
    css3dRenderer.render(scene, camera)

    // 渲染更新渲染
    requestAnimationFrame(renderLoop)
})()
