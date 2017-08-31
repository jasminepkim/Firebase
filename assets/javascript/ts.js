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
    var empName = $("#focusedInput").val().trim();
    var empRole = $("#disabledInput").val().trim();
    var empDate = $("#inputWarning").val().trim();
    var empRate = $("#inputError").val().trim();

    // Creates local "temporary" object for holding employee data
    var newEmp = {
        employeeName: empName,
        role: empRole,
        sDate: empDate,
        mRate: empRate
    }

    // Uploads employee data to the database
    database.ref().push(newEmp);

    // Logs everything to console
    console.log(newEmp.employeeName);
    console.log(newEmp.role);
    console.log(newEmp.sDate);
    console.log(newEmp.mRate);

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
    var empName = snapshot.val().employeeName;
    var empRole = snapshot.val().role;
    var empDate = snapshot.val().sDate;
    var empRate = snapshot.val().mRate;

    // Log everything that's coming out of snapshot
    console.log(empName);
    console.log(empRole);
    console.log(empDate);
    console.log(empRate);

    // Prettify the employee start
    var pretty = moment.unix(empDate).format("H, HH");
    console.log(pretty);
   
    // Calculate the months worked using multiplication
    var months = moment().diff(moment.unix(empDate, "X"), "months");
    console.log(months);

    // Calculate the total billed rated
    var billed = months * empRate;
    console.log(billed);

    // append employee's data into the table
    $("#ts-table").append("<tr><td id='ts-name'>" + snapshot.val().employeeName
    + "<td id='ts-role'>" + snapshot.val().role
    + "<td id='ts-pretty'>" + snapshot.val().pretty
    + "<td id='ts-months'>" + snapshot.val().months
    + "<td id='ts-rate'>" + snapshot.val().mRate
    + "</td></tr>");


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});