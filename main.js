// 目标1：初始化项目
// 1.1 创建 vite 模板项目，命令 npm create vite@latest
// 1.2 清除默认代码，只保留 html，css，js 文件和 package.json
// 1.3 下载核心包：命令，npm i three dat.gui

// 目标2：three.js 基础环境
// 2. 在 utils/init.js 中初始化三要素，轨道控制器，坐标轴，循环渲染

// 目标3：three.js 适配和立方体
// 3.1 在 utils/init.js 设置适配
// 3.2 在 main.js 中创建立方体对象并返回立方体对象到全局常量上

// 目标4：创建第一个场景（数据->视图） // 数据影响视图
// 4.1 定义数据对象相关属性和值
// 4.2 准备创建纹理贴图函数
// 4.3 准备创建地上热点标记函数
// 4.4 准备 dat.gui 工具函数调整位置

// 目标5：创建第二个场景
// 5.1 定义场景里数据对象相关属性和值（这次有 2 个地上热点标记）
// 5.2 与 3D 物体交互事件绑定
// 5.3 准备清除函数，清除当下热点标记
// 5.4 切换纹理，重新创建当前场景下的热点标记

// 目标6：创建第三个场景
// 6. 准备相关的数据对象

// 目标7：创建第四个场景
// 7.1 准备数据相关属性和值
// 7.2 准备创建 DOM 标记的函数
// 7.3 在 init.js 加入 CSS3DObject 渲染器

// 目标8：创建第五个场景
// 8.1 准备数据相关属性和值
// 8.2 准备创建 Video 物体的函数
// 8.3 控制轨道控制器拉动和旋转范围

import './style.css'

// 引入初始化场景
import { scene, camera } from "./utils/init.js"

// 引入将dom 2d 转化为3d方法
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'

// 引入threejs
import * as THREE from "three"

// 引入gui工具
import guiMove from "./utils/gui.js"

let video
let videoStatus

// 创建分组
let group = new THREE.Group()

// 准备纹理贴图所需要的数据
const sceneInfoObj = {
  // 第一个场景的数据
  one: {
    // 纹理加载的公共资源路径
    publicPath: "technology/1/",
    // 纹理加载需要加载的图片资源
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    // 准备标记点的数据, 当前空间中所有标记信息对象
    markList: [
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [-0.46, -0.11, -0.11],
        // 物体的旋转角度
        rotation: [1.42, 0.68, 1.63],
        // 切换的下一个场景
        targetAttr: "two"
      }
    ]
  },
  // 第二个场景的数据
  two: {
    // 纹理加载的公共资源路径
    publicPath: "technology/2/",
    // 纹理加载需要加载的图片资源
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    // 准备标记点的数据, 当前空间中所有标记信息对象
    markList: [
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [0.35, -0.09, 0.03],
        // 物体的旋转角度
        rotation: [4.72, 0.89, 2.36],
        // 切换的下一个场景
        targetAttr: "one"
      },
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [-0.46, -0.11, -0.11],
        // 物体的旋转角度
        rotation: [1.42, 0.68, 1.63],
        // 切换的下一个场景
        targetAttr: "three"
      }
    ]
  },
  // 第三个场景的数据
  three: {
    // 纹理加载的公共资源路径
    publicPath: "technology/3/",
    // 纹理加载需要加载的图片资源
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    // 准备标记点的数据, 当前空间中所有标记信息对象
    markList: [
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [0.4, -0.18, 0.32],
        // 物体的旋转角度
        rotation: [-1.53, -0.04, -1.26],
        // 切换的下一个场景
        targetAttr: "two"
      },
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [0.32, -0.16, -0.33],
        // 物体的旋转角度
        rotation: [1.46, 0.1, -0.17],
        // 切换的下一个场景
        targetAttr: "four"
      }
    ]
  },
  // 第四个场景的数据
  four: {
    // 纹理加载的公共资源路径
    publicPath: "technology/4/",
    // 纹理加载需要加载的图片资源
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    markList: [
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [-0.35, -0.22, 0.4],
        // 物体的旋转角度
        rotation: [-0.85, -0.45, -1.8],
        // 切换的下一个场景
        targetAttr: "three"
      },
      {
        // 标记点名称
        name: 'dom',
        // 物体的位置坐标
        position: [0.49, 0, 0],
        // 物体的旋转角度
        rotation: [0, -0.5 * Math.PI, 0],
        // 切换的下一个场景
        targetAttr: "five",
        // 回调函数
        active() {
          setMaterialCube(sceneInfoObj.five)
        },
      }
    ]
  },
  // 第二个场景的数据
  five: {
    // 纹理加载的公共资源路径
    publicPath: "technology/5/",
    // 纹理加载需要加载的图片资源
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    markList: [
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [-0.05, -0.08, 0.46],
        // 物体的旋转角度
        rotation: [5.41, 2.91, 4.79],
        // 切换的下一个场景
        targetAttr: "four"
      },
      {
        // 标记点名称
        name: 'landMark',
        // 标记点图片的路径
        imgUrl: 'other/landmark.png',
        // 物体的宽度
        wh: [0.05, 0.05],
        // 物体的位置坐标
        position: [0.05, 0.08, 0.46],
        // 物体的旋转角度
        rotation: [5.41, 2.91, 4.79],
        // 切换的下一个场景
        targetAttr: "six"
      },
      {
        // 标记点名称
        name: 'video',
        // 视频路径
        imgUrl: 'video/movie.mp4',
        // 物体的宽高
        wh: [0.2, 0.1],
        // 物体的位置坐标
        position: [0.49, 0.04, 0.045],
        // 物体的旋转角度
        rotation: [0, -0.5 * Math.PI, 0],
      }
    ]
  },
  six: {
    // 纹理加载的公共资源路径
    publicPath: "technology/6/",
    // 纹理加载需要加载的图片资源
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
  }
}

// 创建立方缓冲几何体
function createCube() {
  // 创建图形
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // 创建材质
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
  });

  // 创建物体对象, 并且将图形与材质渲染到物体
  const cube = new THREE.Mesh(geometry, material);

  // 调整立方体沿着 z 轴做 -1 缩小（镜面翻转）
  cube.scale.set(1, 1, -1)

  // 将分组添加到场景
  scene.add(cube);

  // 将物体对象返回给函数
  return cube
}

// 创建纹理加载器,并对立方缓存几何体进行贴图
function setMaterialCube(infoObj) {
  // 清除上一个场景的标记点
  clear()

  // 解构出 纹理加载的公共资源路径 与  纹理加载需要加载的图片资源 数据
  const { publicPath, imgUrlArr, markList } = infoObj

  // 创建纹理加载器
  const texturlLoader = new THREE.TextureLoader()

  // 设置纹理加载的公共资源路径
  texturlLoader.setPath(publicPath)

  // 通过纹理加载器加载图片资源, 并创建对应的材质
  const materialArr = imgUrlArr.map(item => {
    //  通过纹理加载器加载图片资源
    const texturl = texturlLoader.load(item)

    // three.js 颜色通道为 rgb 颜色（为了防止图片太浅）
    texturl.colorSpace = THREE.SRGBColorSpace
    // 创建材质
    return new THREE.MeshBasicMaterial({
      // 设置颜色贴图
      map: texturl,
      // 设置双面渲染
      side: THREE.DoubleSide
    });
  })

  // 将立方缓冲几何体的材质设置为贴图的之后的材质
  cubeObj.material = materialArr


  // 循环遍历标记点
  markList.forEach(markObj => {
    // 如果场景里面存在标记点, 则调用个创建标记点方法
    if (markObj.name === "landMark") createLandMark(markObj)
    else if (markObj.name === "dom") createDomMark(markObj)
    else if (markObj.name === "video") createVideoMark(markObj)
  })

  scene.add(group)
}

// 创建标记点贴图
function createLandMark(infoObj) {

  const { name, imgUrl, wh, position, rotation, targetAttr } = infoObj

  // 创建纹理加载器
  const texturlLoader = new THREE.TextureLoader()

  // 创建图形(平面缓冲几何体)
  const geometry = new THREE.PlaneGeometry(...wh);
  // 创建材质
  const material = new THREE.MeshBasicMaterial({
    // 进行颜色贴图
    map: texturlLoader.load(imgUrl),
    // 进行双面渲染
    side: THREE.DoubleSide,
    // 设置背景透明
    transparent: true
  });
  // 创建物体对象, 并且将图形与材质渲染到物体对象
  const plane = new THREE.Mesh(geometry, material);

  // 设置物体的坐标
  plane.position.set(...position)

  // 设置物体的旋转角度
  plane.rotation.set(...rotation)

  // 设置标记点名称
  plane.name = name

  // 将标记点的数据添加到物体上
  plane.userData.targetAttr = targetAttr

  // 调用gui工具
  // guiMove(plane)

  // 将标记点添加到分组中
  group.add(plane)

}

// 创建文本标记点
function createDomMark(infoObj) {
  let { position, rotation, active } = infoObj
  const tag = document.createElement('span')
  tag.className = "mark-style"
  tag.innerHTML = "前进"
  tag.style.color = "#fff"
  tag.style.pointerEvents = "all"
  tag.addEventListener("click", (e) => {
    active(e)
  })


  const tag3d = new CSS3DObject(tag)
  tag3d.scale.set(1 / 800, 1 / 800, 1 / 800)
  tag3d.position.set(...position)
  tag3d.rotation.set(...rotation)
  group.add(tag3d)
}

// 创建视频纹理
function createVideoMark(infoObj) {
  const { name, imgUrl, position, rotation, wh } = infoObj

  // 创建视频
  video = document.createElement("video")
  video.src = imgUrl
  video.muted = true
  // video.style.pointerEvents = "all"
  video.addEventListener("loadedmetadata", () => {
    video.play()
    videoStatus = true
    video.muted = false
  })


  // video.addEventListener("click", () => {
  //   alert("!23")
  //   video.muted = !video.muted
  // })

  // 创建纹理加载器
  const texture = new THREE.VideoTexture(video)

  // 创建图形
  const geometry = new THREE.PlaneGeometry(...wh);
  // 创建材质
  const material = new THREE.MeshBasicMaterial({
    map: texture
  });
  // 创建物体
  const plane = new THREE.Mesh(geometry, material);

  // 设置位置
  plane.position.set(...position)
  // 设置旋转
  plane.rotation.set(...rotation)

  plane.name = name

  guiMove(plane)
  // 添加到场景
  group.add(plane);
}


// 清除上一个场景的标记点
function clear() {
  const list = [...group.children]
  list.forEach(obj => {
    if (!obj.isCSS3DObject) {
      obj.geometry.dispose()
      obj.material.dispose()
    }
    group.remove(obj)
  })
}

// 给3D场景添加点击事件
function bindClick() {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  window.addEventListener("click", (event) => {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);

    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children);

    console.log("intersects", intersects)
    // 过滤当前所点击的标记点
    const obj = intersects.find(item => item.object.name === "landMark")
    const videoObj = intersects.find(item => item.object.name === "video")
    console.log("video", video)

    if (obj) {
      // 当点击了标记点, 切换场景的数据
      const infoObj = sceneInfoObj[obj.object.userData.targetAttr]
      if (infoObj) setMaterialCube(infoObj)
    }

    if (videoObj) {
      if (videoStatus) {
        video.pause()
        videoStatus = false
      } else {
        video.play()
        videoStatus = true
      }
    }
  })



}


// 调用创建立方缓冲几何体方法
const cubeObj = createCube()
bindClick()
// 调用对立方缓存几何体进行贴图方法
setMaterialCube(sceneInfoObj.one)


/**
 * 前言: 当我们正准备好了threejs基础环境之后
 * 1. 创建立方缓冲几何体, 并且调用创建立方缓冲几何体方法
 * 2. 准备第一个场景数据(纹理加载器的公共资源路径,以及需要加载图片数据, 以及标记点数据)
 * 3. 创建一个贴图方法, 对立方缓冲几何体进行贴图
 * 4. 如果场景存在标记点数据, 那么对立方缓冲几何体贴完图之后,创建标记点贴图方法, 并进行调用
 * 5. 创建分组, 将立方缓存几何体添加到分组, 以及标记点添加到分组, 将分组添加到场景
 * 
 */
