/*
 *      ----------------------------------------
 *      When document loads script
 *      ----------------------------------------
 */

if ($(window).width() >= 720) layout("computer"); // Switch layout if it is computer
// Load default image if no hash
if (location.hash.length == 0) $("#images").html("<img src='/images/other_creatures/question_mark.jpg' class='show'>");
/*
 * (Change) Layout
 * ----------------------------------------
 * Changes layout based on parameter given
 * ----------------------------------------
 * PARAMETERS
 * string type: The name of the layout
 */
function layout(type) {
  if (type == "computer") { // Larger Screen
    $("#images").attr("style", "width:calc(50% - 16px);float:left;margin-bottom:16px");
    $("#info > div:nth-child(2)").attr("style", "width:calc(50% - 16px);float:right;margin-bottom:16px");
  }
}

/*
 *      ----------------------------------------
 *      Get, Extract, Create functions
 *      ----------------------------------------
 */

/*
 * Get Source
 * ----------------------------------------
 * Takes a list file from a data folder and
 * send all the links to an extract function.
 *
 * If you just need one item, then use the
 * getSource function. INCOMPLETE
 * -----------------------------------------
 * PARAMTERS
 * string listLink: The list.txt file of links.
 * function extractFunction: The extract function
 *    which recieves a link and the current
 *    list index.
 * function createFunction: If needed, the function
 *    that will create divs. It will recieve a
 *    link and the current list index.
 */
function getSources(listLink, extractFunction, createFunction) {
  $.get(listLink, function(contents) {
    // Split the list contents into array items by newline character
    var links = contents.split(/\n/g);
    links.pop(); // Remove the last, empty item of the list

    // Remove title and brackets from the lists
    for (var i = 0; i < links.length; i++) {
      links[i] = links[i].match(/\[([^\]]+)\]/)[1]; // The title of the link is irrelevant, so only the url is needed
      createFunction(links[i], i);
      extractFunction(links[i], i);
    }
  }, 'text');
}
/*
 * Extract Information
 * ----------------------------------------
 * Get and format the information from a
 * link, which leads to a .txt file in a
 * data folder, and send it to a create
 * function.
 * ----------------------------------------
 * PARAMETERS
 * string link: The link of the information
 *    that needs to be extracted
 * int listNum: The number of the item in
 *    the list.
 * function formatFunction: A function which
 *    formats any information needed, such as
 *    sub-arrays. Make sure it returns info.
 * function creationFunction: The function
 *    which takes all the information and
 *    creates DOM elements for them.
 */
function extractInformation(link, listNum, formatFunction, creationFunction) {
  $.get(link, function(contents) {
    // Seperate the information and headers
    var info = contents.replace(/\n/g, ""); // Remove newline characters
    info = info.split(/\[([^\]]+)\]/); // Seperate the information
    info.shift(); // Remove the first, empty item

    // Delete the headers
    for (var i = 0; i < info.length; i++) info.splice(i, 1);

    // Format the information
    info = formatFunction(info);
    creationFunction(info, listNum)
  }, 'text');
}
/*
 * Create Animal List
 * ----------------------------------------
 * Create function that creates the animal
 * list
 * -----------------------------------------
 * PARAMETERS
 * info: The information that is passed down
 *    from the other functions
 * int listNum: The nth child of the item
 */
function createAnimalList(info, listNum) {
  $("#list div:nth-child(" + (listNum + 1) + ")").append("<img src=" + info[9][0] + " info=\"\" onclick=\"\">");
  $("#list div:nth-child(" + (listNum + 1) + ") img").attr("info", JSON.stringify(info));
  $("#list div:nth-child(" + (listNum + 1) + ") img").attr("onclick", "switchAnimal(" + (listNum + 1) + ", JSON.parse($(this).attr('info')), this)");
  hash = location.hash.slice(1);
  // Switch animal if hash is present when url is entered
  if (hash == listNum) {
      window.location.hash = 0;
      $("#list div:nth-child(" + (listNum + 1) + ") img").click();
  }
}
/*
 * Create Power
 * -----------------------------------------
 * Create function that creates a power
 * -----------------------------------------
 * PARAMETERS
 * info: The information that is passed down
 *    from the other functions
 * int powerNum: The nth child of the div
 */
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

/*
 *      ----------------------------------------
 *      Interactive functions
 *      ----------------------------------------
 */

/*
 * Switch Animal
 * ----------------------------------------
 * Onclick event for the #list children.
 * Loads the content from the #list children's
 * 'info' attribute onto the #info div.
 */
function switchAnimal(number, info, obj) {
  // Only change if it is a new animal
  if (location.hash.slice(1) != number - 1) {
    // Resets
    window.location.hash = number - 1; // Set hash
    switchActive(obj, "#list div img"); // Set the current animal's icon to active
    $("#images").html("<i class='fas fa-angle-double-right fa-2x' onclick='nextImage()'></i>"); // Clear images
    switchActive($("#tab i:first-child"), "#tab i"); // Set tab to info

    // Loop through and add images
    info[9].shift(); // Delete icon image
    for (var i = 0; i < info[9].length; i++) {
      if (i == 0)
        $("#images").append("<img src='" + info[9][i] + "' class='show'>");
      else
        $("#images").append("<img src='" + info[9][i] + "' class='hide'>");
    }

    // Change Name
    $("#name").html("<h1>" + info[0] + "</h1><p>" + info[1] +"</p>");

    // Fill in all the html info
    $("#text div:nth-child(1)").html(info[5]); // Bio
    $("#text div:nth-child(2)").html(info[6]); // Personality
    $("#text div:nth-child(3)").html(info[7]); // History
    $("#text div:nth-child(4)").html(""); // Powers
    $("#text div:nth-child(5)").html(info[8]); // Fun Facts

    // Fill in powers
    for (var i = 0; i < info[4].length; i++) {
      $("#text div:nth-child(4)").append("<div class='power'></div>");
      extractInformation(info[4][i], i + 1,
        function(info) {
          return info;
        },
        function(info, listNum) {
          createPower(info, listNum);
        });
    }
  }
}
/*
 * Next Image
 * ----------------------------------------
 * Changes the image to the next image
 */
function nextImage() {
  // Initialize variables
  var totalImgs = $("#images img").length; // Amount of images
  var currentImg = 0; // Current image
  for (var i = 0; i < totalImgs; i++) { // Find and set the current image
    if ($("#images img:nth-of-type(" + (i + 1) + ")").hasClass("show")) {
      currentImg = i + 1;
      break;
    }
  }

  // Change the image
  $("#images img:nth-of-type(" + currentImg + ")").attr("class", "hide"); // Hide the current image
  if (currentImg < totalImgs) { // Check if it's the last image
    $("#images img:nth-of-type(" + (currentImg + 1) + ")").attr("class", "show"); // Next image
  } else {
    $("#images img:nth-of-type(1)").attr("class", "show"); // Last image
  }
}
/*
/*
 * Switch Active
 * ----------------------------------------
 * onclick function that is used for a group
 * of elements where only one is active at
 * a time.
 * ----------------------------------------
 * PARAMETERS
 * object obj: The sender should use 'this'
 *    keyword as first parameter, or a query
 *    if triggering a 2nd element
 * string query: Query selection on how to
 *    select the element and all siblings
 */
function switchActive(obj, query) {
   $(query).removeClass("active");
   $(obj).addClass("active");
 }
/*
 * Toggle
 * ----------------------------------------
 * Simply switch an object's class between
 * open and close
 */
function toggle(obj) {
  if ($(obj).hasClass("open")) {
    $(obj).addClass("close").removeClass("open")
  } else {
    $(obj).addClass("open").removeClass("close")
  }
}

/*
 *      ----------------------------------------
 *      Filter stuff
 *      ----------------------------------------
 */

/*
 * Open Filter
 * ----------------------------------------
 * Manages the toggling of filters
 * ----------------------------------------
 * PARAMETERS
 * int child: The nth-child of the filter
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
/*
 * Sort
 * ----------------------------------------
 * Just changes the order of #list divs
 * ----------------------------------------
 * PARAMETERS
 * int num: 1 is forward, anything else is
 *    backwards
 */
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
/*
 * Filter
 * ----------------------------------------
 * Hides #list divs based on the arguments
 * given
 * ----------------------------------------
 * string args: Will be matched up agaisnt
 *    all the divs and hide the ones that
 *    match.
 */
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
/*
 * Reset
 * ----------------------------------------
 * Makes all #list divs visible again.
 */
function reset() {
  $("#list div").removeClass("hidden");
}


// Animal list chain, super complicated
getSources("/animaldata/list.txt",
  function(link, i) {
    extractInformation(link, i + 1,
      function(info) {
        // Divide animals into subclassifications
        info[2] = info[2].split(", ");
        // Seperate images into their own array
        info[9] = info[9].split("-");
        info[9].shift();
        // Seperate poweres into their own array
        info[4] = info[4].split("-");
        info[4].shift();
        return info;
      },
      function(info, listNum) {
        createAnimalList(info, listNum);
      }
    )
  },
  function(link, i) {
    $("#list").append("<div number='" + (i + 1) + "'></div>");
  }
);
