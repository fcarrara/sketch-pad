$(document).ready(function() {

	//Add divs to the grid table
	for (var i = 0; i < 1024; i++) {
		$(".container").append('<div class="square border"></div>');
	}
	
	$(function() {
		$(document).tooltip();
	});

	/******************************************************/ 
	/* Functions to get buttons status                    */
	/******************************************************/

	function getSelectedRadioButton(){
		return $("input:radio[name=option]:checked").val();
	}

	function isProgressive() {
		if ($("#progressive").is(":checked")){
			return true;
		} else {
			return false;
		}
	}

	function isContinuous() {
		if ($("#continuous").is(":checked")){
			return true;
		} else {
			return false;
		}
	}

	/******************************************************/ 
	/* Functions to set selected color in squares */
	/******************************************************/

	//Set colorful random background in square
	function setBackgroundRandomColor(obj) {
		$(obj).css("background-color", "#" + Math.floor(Math.random()*16777215).toString(16));		
	}

	//Set a specified background color in square
	function setBackgroundSpecificColor(obj, color) {
		$(obj).css("background-color", color);		
	}

	//Make color 10% darker
	function darkerColor(rgb){
    
	  rgb = rgb.split("rgb(")[1].split(")")[0];
	  rgb = rgb.replace(/ /g,'').split(",");
	  
	  //10% of 255 = 25 rounded
	  rgb[0] = rgb[0] - 25 < 0 ? 0 : rgb[0] - 25;
	  rgb[1] = rgb[1] - 25 < 0 ? 0 : rgb[1] - 25;
	  rgb[2] = rgb[2] - 25 < 0 ? 0 : rgb[2] - 25;

	  //Return new color
	  return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";

	}

	function setBackgroundProgressiveColor(obj,background){
		$(obj).css("background", darkerColor(background));
	}

	//Set a random color in square
	function setRandomColor(event){
		$(document).on(event, ".square", function(){
			setBackgroundRandomColor(this);
		});
	}

	//Set the color specified in color picker
	function setSpecificColor(event, color){
		$(document).on(event, ".square", function(){
			setBackgroundSpecificColor(this, color);
		});
	}

	//Set progressive color in square
	function setProgressiveColor(event) {

		$(document).on(event, ".square", function() {

			var background = $(this).css("background-color");
		
			if (background.indexOf("rgba") > -1) {

				if (getSelectedRadioButton() == "1") {
					setBackgroundRandomColor(this);
				} else {
					setBackgroundSpecificColor(this, "#" + $(".jscolor").val());
				}
			} else {
				setBackgroundProgressiveColor(this, background);
			}			

		});
	}

	//Main function to determine the color to be set based on option selected
	function setColor(){

		//Remove current listener
		$(document).off("mouseenter", ".square");
		$(document).off("click", ".square");
		
		var option = getSelectedRadioButton();
		
		if (isProgressive()) {

			if (isContinuous()) {
				setProgressiveColor("mouseenter");
			} else {
				setProgressiveColor("click");
			}

		} else {

			if (isContinuous()) {

				if (option == "1") {
					setRandomColor("mouseenter");
				} else {
					setSpecificColor("mouseenter","#" + $(".jscolor").val());
				}
			} else {
				if (option == "1") {
					setRandomColor("click");
				} else {
					setSpecificColor("click","#" + $(".jscolor").val());
				}
			}
		}
	}

	//Initial status of grid is random color on hover mode
	setRandomColor("mouseenter");

	/******************************************************/ 
	/* Functions to reset grid                            */
	/******************************************************/

	//Delete the squares from the main grid
	function deleteGrid(){
		$(".square").remove();
	}

	//Update grid with values from input
	function updateGrid(){

		var gridSize = $("#grid-size").val();
		var squareSize = 512 / gridSize;
		var str = "";

		if (gridSize > 256) {

			$(".validateInput").text("The maximum size is 256").addClass("ui-state-highlight");
			setTimeout(function() {
        $(".validateInput").removeClass( "ui-state-highlight", 1500 );
      }, 500 );

		} else {

			//Clean grid
			deleteGrid();

			//For more efficient code append first in string and then append to container
			for (var i = 0; i < gridSize; i++) {
				str +='<div class="square border"></div>';
			}

			for (i = 0; i < gridSize; i++){
				$(".container").append(str);	
			}

			//Update squares height and width
			$(".square").css({"width": squareSize, "height": squareSize});
		
			dialog.dialog("close");
			$("#grid-size").val("");
		}	
	}

	/******************************************************/ 
	/* Listeners for each button and checkbox             */
	/******************************************************/

	//Actions for radio buttons
	$("input:radio[name=option]").click(function(){
		setColor();
	});

	//Listener for progressive checkbox
	$("#progressive").on("click", function() {
		setColor();
	});

	//Listener for continuous line checkbox
	$("#continuous").on("click", function() {
		setColor();
	});

	//Action for color picker
	$(".jscolor").on("change", function() {
		setColor();
	});

	$(".jscolor").on("click", function(){
		$("#color").prop("checked", true);
		setColor();
	});

	//Show or hide the grid
	$(".show-hide-grid").click(function(){
		$(".square").toggleClass("border");
	});

	//Add event to reset button
	$(".reset-btn").click(function(){
		$(".square").css("background-color", "rgba(255,255,255,.7)");
	});

	//Does not allow the user to input anything but numbers
	$('#grid-size').keyup(function () {
    	if (this.value !== this.value.replace(/[^0-9\.]/g, '')) {
       		this.value = this.value.replace(/[^0-9\.]/g, '');
    	}

    	var size = $("#grid-size").val();
    	$("#total-squares").text(size > 1 ? size * size + " squares" : "1 square");
	});
	
	//Customize grid dialog
	var dialog = $("#customize-dialog").dialog({
		autoOpen: false,
		height: 300,
		widht: 350,
		modal: true,
		buttons: {
			"Update grid": updateGrid,
			Cancel: function(){
				dialog.dialog("close");
			}
		},
		close: function(){
			$("#grid-size").val("");
		}
	});

	$(".customize-btn").click(function(){
		$("#total-squares").text("");
		dialog.dialog("open");
	});

	//When press "C" check or uncheck continuous line checkbox
	$(document).keydown(function(event) {
		if (event.which == 67) {
			if ($("#continuous").is(":checked")) {
				$("#continuous").prop("checked", false);
			} else {
				$("#continuous").prop("checked", true);
			}

			setColor();
		}
	});

	//When press "P" check or uncheck progressive checkbox
	$(document).keydown(function(event) {
		if (event.which == 80) {
			if ($("#progressive").is(":checked")) {
				$("#progressive").prop("checked", false);
			} else {
				$("#progressive").prop("checked", true);
			}

			setColor();
		}
	});

});