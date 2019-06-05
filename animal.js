getSources();

function getSources() {
  $.get("/animaldata/list.txt", function(contents) {
    var sources = contents.split(/\n/g);
    sources.pop();
    for (var i = 0; i < sources.length; i++) {
      sources[i] = sources[i].match(/\[([^\]]+)\]/)[1];
      $("#list ul").append("<li></li>")
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
    // Seperate images into their own array
    info[8] = info[8].split("-");
    info[8].shift();
    createAnimalList(info, listNum);
  }, 'text');
}


function createAnimalList(info, listNum) {
  $("#list ul li:nth-child(" + listNum + ")").append("<img src='" + info[8][0] + "' onclick='switchAnimal(" + listNum + "," + JSON.stringify(info) + ", this)'>")
}

function switchAnimal(number, info, obj) {
  $("#list ul li img").removeClass("myVisible");
  $(obj).addClass("myVisible");
  // Change Image
  $("#images").html("<i class='fas fa-angle-double-right fa-2x' onclick='nextImage()'></i>");
  info[8].shift();
  for (var i = 0; i < info[8].length; i++) {
    if (i == 0)
      $("#images").append("<img src='" + info[8][i] + "' class='show'>");
    else
      $("#images").append("<img src='" + info[8][i] + "' class='hide'>");
  }
  // Change Name
  $("#name").html("<h1>" + info[0] + "</h1><p>" + info[1] +"</p>");
  // Set tab to info
  switchTab($("#tab i:first-child"), 1);
  // Fill in all the info
  $("#text div:nth-child(1)").html(info[4]);
  $("#text div:nth-child(2)").html(info[5]);
  $("#text div:nth-child(3)").html(info[6]);
  $("#text div:nth-child(5)").html(info[7]);
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
