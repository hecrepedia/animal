/*
 * When document loads function
 */
// Switch layout if it is computer
if ($(window).width() >= 720) {layout("computer");}
// Load default image if no hash
if (location.hash.length == 0) {$("#images").html("<img src='/images/other_creatures/question_mark.jpg' class='show'>");}

/*
 * Load the animals
 */
getSources();

function getSources() {
  $.get("/animaldata/list.txt", function(contents) {
    var sources = contents.split(/\n/g);
    sources.pop();
    for (var i = 0; i < sources.length; i++) {
      sources[i] = sources[i].match(/\[([^\]]+)\]/)[1];
      $("#list").append("<div number='" + (i + 1) + "'></div>")
    }
    for (var i = 0; i < sources.length; i++) {
      extractInformation(sources[i], i + 1);
    }
  }, 'text');
}

function extractInformation(source, listNum) {
  $.get(source, function(contents) {
    // Seperate all the information from headers, and put in array
    var info = contents.replace(/\n/g, "");
    info = info.split(/\[([^\]]+)\]/);
    info.shift();
    for (var i = 0; i < info.length; i++) {
      info.splice(i, 1);
    }
    // Divide animals into subclassifications
    info[2] = info[2].split(", ");
    // Seperate images into their own array
    info[9] = info[9].split("-");
    info[9].shift();
    // Seperate poweres into their own array
    info[4] = info[4].split("-");
    info[4].shift();
    createAnimalList(info, listNum);
  }, 'text');
}


function createAnimalList(info, listNum) {
  $("#list div:nth-child(" + (listNum + 1) + ")").append("<img src=" + info[9][0] + " info=\"\" onclick=\"\">");
  $("#list div:nth-child(" + (listNum + 1) + ") img").attr("info", JSON.stringify(info));
  $("#list div:nth-child(" + (listNum + 1) + ") img").attr("onclick", "switchAnimal(" + (listNum + 1) + ", JSON.parse($(this).attr('info')), this)");
  hash = location.hash.slice(1);
  if (hash == listNum) {
      window.location.hash = 0;
      $("#list div:nth-child(" + (listNum + 1) + ") img").click();
  }
}

/*
 * Interactive animal stuff
 */
function switchAnimal(number, info, obj) {
  if (location.hash.slice(1) != number - 1) {
    $("#list div img").removeClass("myVisible");
    $(obj).addClass("myVisible");
    // Change Image
    $("#images").html("<i class='fas fa-angle-double-right fa-2x' onclick='nextImage()'></i>");
    info[9].shift();
    for (var i = 0; i < info[9].length; i++) {
      if (i == 0)
        $("#images").append("<img src='" + info[9][i] + "' class='show'>");
      else
        $("#images").append("<img src='" + info[9][i] + "' class='hide'>");
    }
    // Change Name
    $("#name").html("<h1>" + info[0] + "</h1><p>" + info[1] +"</p>");
    // Set tab to info
    switchTab($("#tab i:first-child"), 1);
    // Fill in all the html info
    $("#text div:nth-child(1)").html(info[5]);
    $("#text div:nth-child(2)").html(info[6]);
    $("#text div:nth-child(3)").html(info[7]);
    $("#text div:nth-child(4)").html("");
    $("#text div:nth-child(5)").html(info[8]);
    // Fill in powers
    for (var i = 0; i < info[4].length; i++) {
      $("#text div:nth-child(4)").append("<div class='power'></div>");
      extractPower(info[4][i], i + 1);
    }
    // Add/Change Hash
    window.location.hash = number - 1;
  }
}

function extractPower(link, powerNum) {
  // Get the information from the link and put it into an array
  $.get(link, function(contents) {
    // Seperate all the information from headers, and put in array
    var info = contents.replace(/\n/g, "");
    info = info.split(/\[([^\]]+)\]/);
    info.shift();
    for (var i = 0; i < info.length; i++) {
      info.splice(i, 1);
    }
    createPower(info, powerNum);
  }, 'text');
}

function createPower(info, powerNum) {
  // Smallest to biggest Pentagons
  points = [
    [[250, 180], [183, 228], [209, 307], [291, 307], [317, 228]],
    [[250, 160], [164, 222], [197, 323], [303, 323], [336, 222]],
    [[250, 140], [145, 216], [185, 339], [315, 339], [355, 216]],
    [[250, 120], [126, 210], [174, 355], [326, 355], [374, 210]],
    [[250, 100], [107, 204], [162, 371], [338, 371], [393, 204]],
    [[250, 80], [88, 197], [150, 388], [350, 388], [412, 197]],
    [[250, 60], [69, 191], [138, 404], [362, 404], [431, 191]],
    [[250, 40], [50, 185], [127, 420], [373, 420], [450, 185]],
    [[250, 20], [31, 179], [115, 436], [385, 436], [469, 179]],
    [[250, 0], [12, 173], [103, 452], [397, 452], [488, 173]]
  ];
  $("#text div:nth-child(4) div:nth-child(" + powerNum + ")").append("<h1>" + info[0] + "</h1><p>" + info[1] + "</p>");
  // Create polygons
  polygons = "";
  for (var shape = 0; shape < points.length; shape++) {
    polygon = "<polygon points='";
    for (var coordinates = 0; coordinates < points[shape].length; coordinates++) {
      polygon += " " + String(points[shape][coordinates][0]) + "," + String(points[shape][coordinates][1]);
    }
    polygon += "' style='fill:none;stroke:#ccc'></polygon>";
    polygons += polygon;
  }
  // Create datapoints polygon
  data = "<polygon points='"
  for (var i = 2; i < 7; i++) {
    shape = parseInt(info[i]) - 1;
    coordinates = points[shape][i - 2];
    data += " " + String(coordinates[0]) + "," + String(coordinates[1]);
  }
  data += "' style='fill:#FF8F32;stroke:#FF8F32;fill-opacity:0.4'></polygon>"
  // Create graph labels
  labels = "" +
    "<text x='218' y='16'>Strength</text>" +
    "<text x='0' y='189'>Stealth</text>" +
    "<text x='78' y='468'>Shield</text>" +
    "<text x='378' y='468'>Style</text>" +
    "<text x='428' y='189'>Situation</text>";
  // Create svg
  $("#text div:nth-child(4) div:nth-child(" + powerNum + ")").append("<svg width='100%' style='width:100%;font:16px sans-serif;fill:#FF8F32' viewbox='0 0 500 500'>" + polygons + data + labels + "</svg>");
  // Add HBA Rating
  $("#text div:nth-child(4) div:nth-child(" + powerNum + ")").append("<p>HBA Rating: " + info[7] + "</p>")
}

function nextImage() {
  var totalImgs = $("#images img").length;
  var currentImg = 0;
  for (var i = 0; i < totalImgs; i++) {
    if ($("#images img:nth-of-type(" + (i + 1) + ")").hasClass("show")) {
      currentImg = i;
      break;
    }
  }
  $("#images img:nth-of-type(" + (currentImg + 1) + ")").attr("class", "hide");
  if (currentImg + 1 < totalImgs) {
    $("#images img:nth-of-type(" + (i + 2) + ")").attr("class", "show");
  } else {
    $("#images img:nth-of-type(1)").attr("class", "show");
  }
}

function switchTab(obj, x) {
  $("#tab i").removeClass("active");
  $(obj).addClass("active");
  $("#text div").removeClass("active");
  $("#text div:nth-child(" + x + ")").addClass("active");
}

function toggle(obj) {
  if ($(obj).hasClass("open")) {
    $(obj).addClass("close").removeClass("open")
  } else {
    $(obj).addClass("open").removeClass("close")
  }
}

function layout(type) {
  if (type == "computer") { // Larger Screen
    $("#images").attr("style", "width:calc(50% - 16px);float:left;margin-bottom:16px");
    $("#info > div:nth-child(2)").attr("style", "width:calc(50% - 16px);float:right;margin-bottom:16px");
  }
}

/*
 * Filter stuff
 */
function openFilter(child) {
  if (child != 0) {
    if ($("#filters div:nth-of-type(" + child + ")").hasClass("open")) {
      $("#filters div").removeClass("open");
    } else {
      $("#filters div").removeClass("open");
      $("#filters div:nth-of-type(" + child + ")").removeClass("close").addClass("open");
    }
  } else {
    $("#filters div").removeClass("open").addClass("close");
  }
}

function sort(num) {
  if (num == 1) {
    for (var i = 1; i < $("#list div").length; i++) {
      $("#list div[number=" + i + "]").appendTo("#list");
    }
  } else {
    for (var i = $("#list div").length; i > 0; i--) {
      $("#list div[number=" + i + "]").appendTo("#list");
    }
  }
}

function filter(args) {
  for (var i = 1; i < $("#list div").length; i++) {
    info = JSON.parse($("#list div:nth-child(" + (i + 1) + ") img").attr("info"));
    animal = JSON.stringify(info[2]);
    if (animal.includes(JSON.stringify(args))) {
      $("#list div:nth-child(" + (i + 1) + ")").removeClass("hidden");
    } else {
      $("#list div:nth-child(" + (i + 1) + ")").addClass("hidden");
    }
  }
}

function reset() {
  $("#list div").removeClass("hidden");
}
