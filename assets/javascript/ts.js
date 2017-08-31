// Initialize Firebase
 var config = {
    apiKey: "AIzaSyDCu5Sln8EMZLXsvpvSXbTP4Z51Pdhh3vk",
    authDomain: "time-sheet-083117.firebaseapp.com",
    databaseURL: "https://time-sheet-083117.firebaseio.com",
    projectId: "time-sheet-083117",
    storageBucket: "",
    messagingSenderId: "643259474288"
  };

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding Employees
$("#add.btn.btn-primary").on("click", function (event) {

    alert("It works!!!");

    // Don't refresh the page!
    event.preventDefault();

    // grabs the userInput
    var trainName = $("#focusedInput").val().trim();
    var trainDest = $("#disabledInput").val().trim();
    var firstTrain = $("#inputWarning").val().trim();
    var freqMin = $("#inputError").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        dest: trainDest,
        time: firstTrain,
        min: freqMin
    }

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.time);
    console.log(newTrain.min);

    // Alert
    alert("CHOO CHOO successfully added");

    // Clears all of the text-boxes
    $("#focusedInput").val("");
    $("#disabledInput").val("");
    $("#inputWarning").val("");
    $("#inputError").val("");

});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (snapshot) {

    console.log(snapshot.val());

    // Store the new details of the employee into a variable
    var trainName = snapshot.val().name;
    var trainDest = snapshot.val().dest;
    var firstTrain = snapshot.val().time;
    var freqMin = snapshot.val().min;

    // Log everything that's coming out of snapshot
    console.log(trainName);
    console.log(trainDest);
    console.log(firstTrain);
    console.log(freqMin);

    // Display the first train time in military time
    var military = moment(firstTrain).format("H, HH"); 
    console.log(military);
   
    // Calculate the time difference relative to the current time
    var currentTime = moment().diff(moment.unix(firstTrain, "X"), "minutes");
    console.log(currentTime);

    // Calculate the total billed rated
    var minutesAway = currentTime - minutesAway;
    console.log(minutesAway);

    // append employee's data into the table
    $("#ts-table").append("<tr><td id='ts-name'>" + snapshot.val().name
    + "<td id='ts-dest'>" + snapshot.val().dest

    // to display user input of frequency minutes
    + "<td id='ts-minutes0'>" + snapshot.val().min 

    + "<td id='ts-military'>" + snapshot.val().military
    + "<td id='ts-current'>" + snapshot.val().currentTime
    + "</td></tr>");


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});