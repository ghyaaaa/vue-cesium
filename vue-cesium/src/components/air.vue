<template>
   <div id="cesiumContainer">
   </div>
</template>

<script>
import 'cesium/Widgets/widgets.css';
let Cesium = require('cesium/Cesium')
export default {
  mounted () {
    var view = new Cesium.Viewer('cesiumContainer',{
        baseLayerPicker:false,
        timeline:true,
        homeButton:false,
        fullscreenButton:false,
        infoBox:false,
        sceneModePicker:false,
        navigationInstructionsInitiallyVisible:false,
        navigationHelpButton:false,
        shouldAnimate : true
    });
    view.scene.globe.enableLighting = true;
    let data = [];
    data[0] = [{longitude:116.405419, dimension:39.918034, height:0, time:0},{longitude:116.2821, dimension:39.918145, height:0, time:40},{longitude:115.497402, dimension:39.344641, height:70000, time:100},{longitude:107.942392, dimension:29.559967, height:70000, time:280}, {longitude:106.549265, dimension:29.559967, height:0, time:360}];
    data[1] = [{longitude:116.405419, dimension:39.918034, height:0, time:0},{longitude:117.034586, dimension:39.881202, height:0, time:40},{longitude:116.340088, dimension:38.842224, height:70000, time:100},{longitude:113.489176, dimension:23.464017, height:70000, time:280}, {longitude:113.262084, dimension:23.13901, height:0, time:360}];
    data[2] = [{longitude:118.838979, dimension:32.073514, height:0, time:0},{longitude:118.438838, dimension:32.03777, height:0, time:40},{longitude:117.802406, dimension:31.91231, height:70000, time:100},{longitude:104.043645, dimension:35.993845, height:70000, time:280}, {longitude:101.807224, dimension:36.660972, height:0, time:360}];
    // 起始时间
    let start = Cesium.JulianDate.fromDate(new Date(2017,7,11));
    // 结束时间
    let stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
    
    // 设置始时钟始时间
    view.clock.startTime = start.clone();
    // 设置时钟当前时间
    view.clock.currentTime = start.clone();
    // 设置始终停止时间
    view.clock.stopTime  = stop.clone();
    // 时间速率，数字越大时间过的越快
    view.clock.multiplier = 10;
    // 时间轴
    view.timeline.zoomTo(start,stop);
    // 循环执行,即为2，到达终止时间，重新从起点时间开始
    view.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    
    // view.camera.flyTo({
    //     destination:Cesium.Cartesian3.fromDegrees(116.405419,32.073514,20000)
    // })
    for(let j=0; j<data.length; j++){
        let property = computeFlight(data[j]);
        //console.log(property)
        // 添加模型
        let planeModel = view.entities.add({
            // 和时间轴关联
            availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start : start,
                stop : stop
            })]),
            position: property,
            // 根据所提供的速度计算模型的朝向
            orientation: new Cesium.VelocityOrientationProperty(property),
            // 模型数据
            model: {
                uri: './Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
                minimumPixelSize:128
            }
        });
    }
    /**
     * 计算飞行
     * @param source 数据坐标
     * @returns {SampledPositionProperty|*}
     */
    function computeFlight(source) {
        // 取样位置 相当于一个集合
        let property = new Cesium.SampledPositionProperty();
        for(let i=0; i<source.length; i++){
            let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
            let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
            // 添加位置，和时间对应
            property.addSample(time, position);
        }
        return property;
    }
  }
}
</script>