<template>
   <div id="cesiumContainer">
   </div>
</template>

<script>
import 'cesium/Widgets/widgets.css';
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
   
    //添加物体
    // var redWall = viewer.entities.add({
    //     name: 'Red wall at height',
    //     wall: {
    //         positions: Cesium.Cartesian3.fromDegreesArrayHeights([
    //             121.444409, 31.247417, 200.0,
    //             121.533521, 31.235685, 200.0,
    //             121.563273, 31.190347, 200.0,
    //             121.546744, 31.194054, 200.0,
    //             121.516705, 31.191459, 200.0,
    //             121.502188, 31.203074, 200.0
    //         ]),
    //         minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
    //         material: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],true)
    //     }
    // });

    var redWall = viewer.entities.add({
      name: 'Red wall at height1',
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([121.444409, 31.247417, 200.0,
                    121.533521, 31.235685, 200.0,
                    121.563273, 31.190347, 200.0,
                    121.546744, 31.194054, 200.0,
                    121.516705, 31.191459, 200.0,
                    121.502188, 31.203074, 200.0]),
        minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
        material:new Cesium.ImageMaterialProperty({
          // image:"2.png",
          image:getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true),
          transparent:true
        })
      }
    }); 

    

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
        //改几个色阶   
        //grd.addColorStop(values[5], 'transparent');

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1, 100);
        return ramp;
    } 
    viewer.zoomTo(viewer.entities);  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>