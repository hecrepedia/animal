// Check Window Size
if ($(window).width() >= 720) {
  layout("computer");
}

// Check if there is no hash
if (location.hash.length == 0) {
  $("#images").html("<img src='/images/other_creatures/question_mark.jpg' class='show'>");
}

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
    // Seperate images into their own array
    info[8] = info[8].split("-");
    info[8].shift();
    createAnimalList(info, listNum);
  }, 'text');
}


function createAnimalList(info, listNum) {
  $("#list div:nth-child(" + (listNum + 1) + ")").append("<img src=" + info[8][0] + " onclick=\"\">");
  $("#list div:nth-child(" + (listNum + 1) + ") img").attr("onclick", "switchAnimal(" + (listNum + 1) + "," + JSON.stringify(info) + ", this)")
  hash = location.hash.slice(1);
  if (hash == listNum) {
      window.location.hash = 0;
      $("#list div:nth-child(" + (listNum + 1) + ") img").click();
  }
}

function switchAnimal(number, info, obj) {
  if (location.hash.slice(1) != number - 1) {
    $("#list div img").removeClass("myVisible");
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
    // Add/Change Hash
    window.location.hash = number - 1;
  }
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

function layout(type) {
  if (type == "computer") { // Larger Screen
    $("#images").attr("style", "width:calc(50% - 16px);float:left;margin-bottom:16px");
    $("#info > div:nth-child(2)").attr("style", "width:calc(50% - 16px);float:right;margin-bottom:16px");
  }
}

function toggle(obj) {
  if ($(obj).hasClass("open")) {
    $(obj).addClass("close").removeClass("open")
  } else {
    $(obj).addClass("open").removeClass("close")
  }
}

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
