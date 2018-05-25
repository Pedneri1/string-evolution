$(document).ready(function () {

  var worker = new Worker("worker.js");
  var generation_counter = 0;

  worker.onmessage = function (e) {
    generation_counter += 1;
    $("#display")
      .html("<div id='string_entry'> G# " + generation_counter + ": " + e.data.gen.replace(/[^\w\d\!\? ]+/g, '#') + "</div>" + "<div id='plotly'>" + "</div>");

    let plot1 = {
      x: generation_counter,
      y: e.data.fitnessMean,
      type: 'scatter',
      name: "Mean"
    }

    let plot2 = {
      x: generation_counter,
      y: e.data.fitnessHistoric,
      type: 'scatter',
      name: "Fitness"
    }

    var data = [plot1, plot2];

    Plotly.plot('plotly', data);

    var realHeight = $("#display")[0].scrollHeight;
    $("#display").scrollTop(realHeight);
  };



});
