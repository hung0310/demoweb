// Image
var mapImage = document.querySelector(".Map_image");

mapImage.addEventListener("click", function(event) {
  var x = event.offsetX;
  var y = event.offsetY;
  alert("Clicked position: " + x + ", " + y);
});

// ComboBox
var comboBox = document.getElementById("cbb_Items_Start");

for (var i = 1; i <= 10; i++) {
  var option = document.createElement("option");
  option.value = i;
  option.text = "node" + i;
  comboBox.appendChild(option);
}

var comboBox = document.getElementById("cbb_Items_End");

for (var i = 1; i <= 10; i++) {
  var option = document.createElement("option");
  option.value = i;
  option.text = "node" + i;
  comboBox.appendChild(option);
}

// Button
var Node_Start = document.getElementById("cbb_Items_Start");
var Node_End = document.getElementById("cbb_Items_End");
const btnSearch = document.querySelector(".btn_Search");

function drawLine(x1, y1, x2, y2) {
  const svg = document.querySelector('.line');
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", parseInt(x1) + 15);
  line.setAttribute("y1", parseInt(y1) + 15);
  line.setAttribute("x2", parseInt(x2) + 15);
  line.setAttribute("y2", parseInt(y2) + 15);
  line.setAttribute("stroke", "green");
  line.setAttribute("stroke-width", "10");

  svg.appendChild(line);
}

function clearLines() {
  const svg = document.querySelector('.line');
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

btnSearch.addEventListener("click", () => {
  var start = parseInt(Node_Start.value);
  var end = parseInt(Node_End.value);
  clearLines();
  var edges = [
    [1, 2, 5],
    [2, 3, 7],
    [3, 4, 18],
    [3, 6, 15],
    [4, 5, 13],
    [5, 6, 20],
    [5, 10, 10],
    [6, 7, 3],
    [7, 8, 12],
    [7, 9, 7],
    [9, 10, 20]
  ];

  var result = dijkstra(10, 11, start, end, edges);
  alert("Shortest distance: " + result.distance + "\nPath: " + result.path.join("->"));
  var path = result.path;
  for (var i = 1; i < path.length; i++) {
    var node_A = path[i-1];
    var node_B = path[i];    
    var connect_lineA = "node" + node_A;
    var connect_lineB = "node" + node_B;
    // alert(connect_lineA);
    // alert(connect_lineB);

    var nodeA = document.getElementById(connect_lineA);
    var x1 = nodeA.style.left.replace("px", "");    
    var y1 = nodeA.style.top.replace("px", "");
    var nodeB = document.getElementById(connect_lineB);
    var x2 = nodeB.style.left.replace("px", "");    
    var y2 = nodeB.style.top.replace("px", "");

    // alert("X1:" + x1 + ", Y1: " + y1);
    // alert("X2:" + x2 + ", Y2: " + y2);

    drawLine(x1, y1, x2, y2);
  }
  //drawLine("100", "335", "180", "685");
});

function dijkstra(numVertices, numEdges, start, end, edges) {
  // Khởi tạo đồ thị
  var graph = {};
  for (var i = 1; i <= numVertices; i++) {
    graph[i] = {};
  }

  // Xây dựng đồ thị từ danh sách các cạnh
  for (var j = 0; j < numEdges; j++) {
    var edge = edges[j];
    var node1 = edge[0];
    var node2 = edge[1];
    var weight = edge[2];
    graph[node1][node2] = weight;
    graph[node2][node1] = weight;
  }

  // Khởi tạo mảng lưu khoảng cách từ điểm bắt đầu đến các điểm khác
  var distances = {};
  for (var k = 1; k <= numVertices; k++) {
    distances[k] = Infinity;
  }
  distances[start] = 0;

  // Khởi tạo hàng đợi ưu tiên (Priority Queue)
  var queue = new PriorityQueue();
  queue.enqueue(start, 0);

  // Khởi tạo mảng lưu đường đi từ điểm bắt đầu đến các điểm khác
  var previous = {};
  for (var l = 1; l <= numVertices; l++) {
    previous[l] = null;
  }

  // Thực hiện thuật toán Dijkstra
  while (!queue.isEmpty()) {
    var current = queue.dequeue();

    // Nếu đã tìm được đường đi tới điểm kết thúc, dừng thuật toán
    if (current === end) {
      break;
    }

    var neighbors = graph[current];
    for (var neighbor in neighbors) {
      var distance = distances[current] + neighbors[neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
        queue.enqueue(neighbor, distance);
      }
    }
  }

  // Xây dựng đường đi từ kết quả thuật toán
  var path = [];
  var currentVertex = end;
  while (currentVertex !== null) {
    path.unshift(currentVertex);
    currentVertex = previous[currentVertex];
  }

  return {
    distance: distances[end],
    path: path
  };
}

// Hàm tạo đối tượng hàng đợi ưu tiên
function PriorityQueue() {
  this.items = [];

  function QueueElement(element, priority) {
    this.element = element;
    this.priority = priority;
  }

  this.enqueue = function(element, priority) {
    var queueElement = new QueueElement(element, priority);
    var added = false;
    for (var i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(queueElement);
    }
  };

  this.dequeue = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift().element;
  };

  this.isEmpty = function() {
    return this.items.length === 0;
  };
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
  
      // Sử dụng tọa độ latitude và longitude ở đây
      console.log("Vị trí hiện tại của bạn là:", latitude, longitude);
    }, function(error) {
      console.error("Không thể lấy được vị trí hiện tại:", error);
    });
  } else {
    console.error("Trình duyệt không hỗ trợ định vị.");
  }