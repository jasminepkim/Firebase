// Initialize Firebase
var config = {
    "apiKey": "AIzaSyDCu5Sln8EMZLXsvpvSXbTP4Z51Pdhh3vk",
    "authDomain": "time-sheet-083117.firebaseapp.com",
    "databaseURL": "https://time-sheet-083117.firebaseio.com",
    "projectId": "time-sheet-083117",
    "storageBucket": "",
    "messagingSenderId": "643259474288"
};

firebase.initializeApp(config);

var database = firebase.database();

// Variables to call globally
var trainName = "";
var trainDest = "";
var firstTrain = "";
var freqMin = "";
var nextTrain = "";
var minAway = "";

// Button for adding trains
$("#add.btn.btn-primary").on("click", function clicked() {
    // Don't refresh the page!
    event.preventDefault();

    // grabs the user input
    var trainName = $("#focusedInput").val().trim();
    var trainDest = $("#disabledInput").val().trim();
    var firstTrain = $("#inputWarning").val().trim();
    var freqMin = $("#inputError").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        "name": trainName,
        "dest": trainDest,
        "time": firstTrain,
        "min": freqMin
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.time);
    console.log(newTrain.min);
});

// 3. Create Firebase event for adding train to the database and a row in the HTML
//    when a user adds an entry
database.ref().on("child_added", function children(snapshot) {
    // Clears all of the text-boxes
    $("#focusedInput").val("");
    $("#disabledInput").val("");
    $("#inputWarning").val("");
    $("#inputError").val("");

    // Store the new details of the train into a variable
    var trainName = snapshot.val().name;
    var trainDest = snapshot.val().dest;
    var firstTrain = snapshot.val().time;
    var freqMin = snapshot.val().min;

    // Log everything that's coming out of snapshot
    console.log(trainName);
    console.log(trainDest);
    console.log(firstTrain);
    console.log(freqMin);

    // CALCULATE THE MINUTES AWAY UNTIL THE NEXT TRAIN
    console.log("diff", moment().diff(moment(firstTrain, "HH:mm"), "minutes"));
    // if the next train equals the current moment, 

    var minutesAwayFromFirstArrival = moment(firstTrain, "HH:mm").diff(moment(), "minutes");

    if (minutesAwayFromFirstArrival > 0) {
        // then add nextTrain and freqMin
        nextTrain = firstTrain;
        minAway = minutesAwayFromFirstArrival;
    } else {
        // pushed back 1 year to make sure it comes before current time
        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log("firstTimeCoverted", firstTimeConverted);

        // current moment less firstTimeConverted to find the difference
        var diff = moment().diff(moment(firstTimeConverted, "minutes"));
        console.log(diff);

        // to find the differential modulo 
        var remainder = diff % freqMin;
        console.log(remainder);

        // calculate actual minutes away
        var minAway = freqMin - remainder;
        console.log("minAway", minAway);

        // the time the next train will arrive
        var nextTrain = moment().add(minAway, "minutes").format("HH:mm");
    }

    // append train's data into the table
    $("#ts-table").append("<tr><td id='ts-name'>" + trainName +

        "<td id='ts-dest'>" + trainDest +

        // to display user input of frequency minutes
        "<td id='ts-minutes'>" + freqMin +

        "<td id='ts-nextarrival'>" + nextTrain +

        "<td id='ts-current'>" + minAway +

        "</td></tr>");
});