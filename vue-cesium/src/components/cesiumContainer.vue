<template>
   <div id="cesiumContainer">
   </div>
</template>

<script>
import 'cesium/Source/Widgets/widget.css'
let Cesium = require('cesium/Cesium')

export default {
  //name: 'cesiumContainer',
  mounted(){
    // var geeMetadata = new Cesium.GoogleEarthEnterpriseMetadata('http://www.earthenterprise.org/3d');
    // var gee = new Cesium.GoogleEarthEnterpriseImageryProvider({
    //     metadata : geeMetadata
    // });
    var guge=new Cesium.UrlTemplateImageryProvider({            	
      url:'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',  
      tilingScheme:new Cesium.WebMercatorTilingScheme(),            	
      minimumLevel:1,            
      maximumLevel:20        
    });
    var viewer = new Cesium.Viewer("cesiumContainer",{            
      baseLayerPicker : false,           
      imageryProvider : guge,
      // terrainProvider : new Cesium.CesiumTerrainProvider({
      //   url : Cesium.IonResource.fromAssetId(3956),
      //   requestVertexNormals : true
      // })
      // terrainProvider : Cesium.createWorldTerrain()
      terrainProvider : Cesium.createWorldTerrain({
        requestWaterMask : true,
        requestVertexNormals : true
      }),
    });
    viewer.camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(40.70, -74.01, 6.83),
        orientation: {
          heading : Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
          pitch : Cesium.Math.toRadians(0),    // default value (looking down)
          roll : 0.0                        // default value
      }
    });
    var city = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({ url: Cesium.IonResource.fromAssetId(3839) }))
    city.style = new Cesium.Cesium3DTileStyle({
      color : {
          conditions : [
              ['${height} > 100', 'color("purple", 0.5)'],
              ['${height} > 50', 'color("red")'],
              ['true', 'color("blue")']
          ]
      },
      show : '${height} > 0',
      meta : {
          description : '"Building id ${id} has height ${height}."'
      }
    });

    var entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0),
      ellipse : {
        semiMinorAxis : 250000.0,
        semiMajorAxis : 400000.0,
        material : Cesium.Color.BLUE.withAlpha(0.5)//可设置不同的MaterialProperty
      }
    });
    var wyoming = viewer.entities.add({
      name : 'Wyoming',
      polygon : {
        hierarchy : Cesium.Cartesian3.fromDegreesArray([
                                  -109.080842,45.002073,
                                  -105.91517,45.002073,
                                  -104.058488,44.996596,
                                  -104.053011,43.002989,
                                  -104.053011,41.003906,
                                  -105.728954,40.998429,
                                  -107.919731,41.003906,
                                  -109.04798,40.998429,
                                  -111.047063,40.998429,
                                  -111.047063,42.000709,
                                  -111.047063,44.476286,
                                  -111.05254,45.002073]),
        height : 0,
        material : Cesium.Color.RED.withAlpha(0.5),
        outline : true,
        outlineColor : Cesium.Color.BLACK
      },
      //description:'divID'//方法一
    });
    wyoming.description = '\
      <img\
        width="50%"\
        style="float:left; margin: 0 1em 1em 0;"\
        src="//cesiumjs.org/images/2015/02-02/Flag_of_Wyoming.svg"/>\
      <p>\
        Wyoming is a state in the mountain region of the Western \
        United States.\
      </p>\
      <p>\
        Wyoming is the 10th most extensive, but the least populous \
        and the second least densely populated of the 50 United \
        States. The western two thirds of the state is covered mostly \
        with the mountain ranges and rangelands in the foothills of \
        the eastern Rocky Mountains, while the eastern third of the \
        state is high elevation prairie known as the High Plains. \
        Cheyenne is the capital and the most populous city in Wyoming, \
        with a population estimate of 62,448 in 2013.\
      </p>\
      <p>\
        Source: \
        <a style="color: WHITE"\
          target="_blank"\
          href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>\
      </p>';
    viewer.zoomTo(wyoming);

    // 设置鼠标位置经纬度\视角高度实时显示
    var canvas = viewer.scene.canvas;
    //具体事件的实现
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(function (movement) {
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点  
        var cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
        if (cartesian) {
            //将笛卡尔三维坐标转为地图坐标（弧度）  
            var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            //将地图坐标（弧度）转为十进制的度数  
            var lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
            var log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
            // 获取相机的海拔高度作为视角高度/km
           var alti_String = (viewer.camera.positionCartographic.height / 1000).toFixed(2);
            console.log(lat_String);
            console.log(log_String); 
            console.log(alti_String);
        } 
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);

      function computeCirclularFlight(lon, lat, radius) {
            let  Ea = 6378137;      //   赤道半径
            let  Eb = 6356725;      // 极半径 
            let positionArr=[];
            positionArr.push(lon);
            positionArr.push(lat);
            //需求正北是0° cesium正东是0°
            for (let i = 0; i <=90; i++) {
                let dx = radius * Math.sin(i * Math.PI / 180.0);
                let dy = radius * Math.cos(i * Math.PI / 180.0);

                let ec = Eb + (Ea-Eb) * (90.0 - lat) / 90.0;
                let ed = ec * Math.cos(lat * Math.PI / 180);

                let BJD = lon + (dx / ed ) * 180.0 / Math.PI;
                let BWD = lat + (dy / ec ) * 180.0 / Math.PI;

                positionArr.push(BJD);
                positionArr.push(BWD);
            }
            console.log(positionArr);

            return positionArr;
        }
        let positionArr = computeCirclularFlight(-112.210693, 36.0994841, 30000);

        viewer.entities.add({
            polygon : {
                hierarchy : new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(
                    positionArr
                )),
                height : 0.0,
                extrudedHeight : 1000.0,
                outline : true,
                outlineColor : Cesium.Color.WHITE.withAlpha(0.0),
                outlineWidth : 1,
                material : Cesium.Color.WHITE.withAlpha(0.5)
            }
        });

        for(let i=0;i<positionArr.length;i=i+2)
        {
            viewer.entities.add({
                position : Cesium.Cartesian3.fromDegrees(positionArr[i], positionArr[i+1]),
                point : {
                    show : true, // default
                    color : Cesium.Color.SKYBLUE, // default: WHITE
                    pixelSize : 10, // default: 1
                    outlineColor : Cesium.Color.YELLOW, // default: BLACK
                    outlineWidth : 3 // default: 0
                }
            });
        }
      viewer.zoomTo(viewer.entities);
      //添加物体
    var redWall = viewer.entities.add({
        name: 'Red wall at height',
        wall: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                121.444409, 31.247417, 200.0,
                121.533521, 31.235685, 200.0,
                121.563273, 31.190347, 200.0,
                121.546744, 31.194054, 200.0,
                121.516705, 31.191459, 200.0,
                121.502188, 31.203074, 200.0
            ]),
            minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
            material: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],true)
        }
    });
      viewer.zoomTo(redWall);
    //纹理图绘制
    function getColorRamp(elevationRamp) {
        var ramp = document.createElement('canvas');
        ramp.width = 1;
        ramp.height = 100;
        var ctx = ramp.getContext('2d');

        var values = elevationRamp;
        var grd = ctx.createLinearGradient(0, 0, 0, 100);
        grd.addColorStop(values[0], '#000000'); //black
        grd.addColorStop(values[1], '#2747E0'); //blue
        grd.addColorStop(values[2], '#D33B7D'); //pink
        grd.addColorStop(values[3], '#D33038'); //red
        grd.addColorStop(values[4], '#FF9742'); //orange
        grd.addColorStop(values[5], '#ffd700'); //yellow
        grd.addColorStop(values[6], '#ffffff'); //white

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1, 100);
        return ramp;
    }

    
    
    // var reanspareentstyle = new Cesium.Cesium3DTileStyle({
    //   color: "color('white', 0.3)",
    //   show: true
    // });
    // city.style = reanspareentstyle;
    
    // var redBox = viewer.entities.add({
    //   name: 'red box with block outline',
    //   position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
    //   box: {  
    //     dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
    //     material: Cesium.Color.RED.withAlpha(0.5),
    //     outline: true,
    //     outlineColor: Cesium.Color.BLACK
    //   }
    // });
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>