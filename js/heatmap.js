function createHeatmap() {
    var heatmapContainer = document.getElementById("heatmap");
    heatmapContainer.style.zIndex = 2;
    var heatmapInstance = h337.create({
        container: heatmapContainer,
        radius: 50
    });
    var data = {
        max: gazeData.length / 50,
        value: 1,
        data: gazeData
    };
    heatmapInstance.setData(data);
    document.getElementsByClassName("heatmap-canvas").height = window.innerHeight;
    document.getElementsByClassName("heatmap-canvas").width = window.innerWidth;
}