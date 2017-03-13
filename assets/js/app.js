$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDnVGzaRxHk9fREE-PQsCj9nzzTQ5HV-x0",
        authDomain: "train-scheduler-6c797.firebaseapp.com",
        databaseURL: "https://train-scheduler-6c797.firebaseio.com",
        storageBucket: "train-scheduler-6c797.appspot.com",
        messagingSenderId: "932229064158"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var train, dest, firstTrain, freq;

    $("#train-submit").on("click", function(event) {

        event.preventDefault();

        // grab input values
        train = $("#train-name").val().trim();
        dest = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        freq = parseInt($("#frequency").val().trim());

        // push values into database as a child
        database.ref().push({
            train: train,
            dest: dest,
            firstTrain: firstTrain,
            freq: freq
        });

        // clear input value
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");

    });

    // using database.ref().push() and database.ref().on("child_added") has a looping effect

    var snapshot = database.ref().on("child_added", function(snapshot) {

        // console.log(snapshot.val());

        train = snapshot.val().train;
        dest = snapshot.val().dest;
        firstTrain = snapshot.val().firstTrain;
        freq = snapshot.val().freq;
        cycle = snapshot.val().cycle;

        // convert firstTrain into milary time
        var mfirstTrain = moment(firstTrain, "HH:mm");
        var difference = moment().diff((mfirstTrain), "minutes");
        var remainder = difference % freq;
        var minAway = freq - remainder;
        var next = moment().add(minAway, "minutes").format("LT");


        var myData = [train, dest, freq, next, minAway];

        var tr = $("<tr>");

        for (var data of myData) {
            var td = $("<td>");
            td.text(data);
            tr.append(td);
        }

        $("tbody").append(tr);


    }, function(error) {
        console.log("Error: " + error.code);

    });

});
