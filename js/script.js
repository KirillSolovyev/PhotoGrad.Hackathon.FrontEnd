$(document).ready(function() {
	let sessionId;
	let question;
	let offers;
	let statistics;

	login();

	$("body").on("click", ".data-sidebar__data-text a", function(e) {
		e.preventDefault();
		$(".before-click").fadeOut(300);
		$(".data-sidebar__data-text a").parent().removeClass("data-sidebar__data-text--active");
		$(this).parent().addClass("data-sidebar__data-text--active");
		let ind = parseInt($(this).attr("id"));
		let qstn = questions[ind];
		$(".data-show").find(".data-show__question-category").text(qstn.category);
		$(".data-show").find(".data-show__question-name").text(qstn.text);
		getQuestionInfo(questions[ind], function() {
			$(".charts").html("");
			$(".charts-info").html("");
			let views = parseInt(statistics.views);
			let users = parseInt(statistics.unique_users);
			let percents = parseInt(statistics.right_answers_percentage) / 100;
			// console.log("views " + views);
			// console.log("unique_users " + users);
			// console.log("perc " + percents);
			drawChart(views, views, "#ffbb03", "Количество просмотров");
			drawChart(views, users, "#ff0000", "Уникальные пользователи");
			drawChart(views, views * percents, "#2d00eb", "Количество правильных ответов");
		});
	});

	function login(){
		$.ajax({
			type: "POST",
	        url: "https://photograd.kz/hackathon/user_login/",
	        data: '{\
	            "email" : "email",\
				"password" : "password"\
	        }',
	        contentType: "application/json; charset=utf-8", 
	        dataType: "json",
	        success: function (id) {
	            sessionId = id.data.sessionid;
	            getQuestions();
	        },
	        error: function (errormessage, err) {
	            alert(err);
	        }
		});
	}

	function getQuestions(){
		$.ajax({
			type: "GET",
			url: " https://photograd.kz/hackathon/questions",
			headers:{
				"X-SESSION-ID": sessionId
			},
			success: function(data){
				// console.log(questions.data.questions[0]);
				questions = data.data.questions;
				//getQuestionInfo(questions[0]);
				displayQuestions();
			}
		});
	}

	function getOffers(){
		$.ajax({
			type: "GET",
			url: " https://photograd.kz/hackathon/offers",
			headers:{
				"X-SESSION-ID": sessionId
			},
			success: function(data){
				// console.log(questions.data.questions[0]);
				questions = data;
				//getQuestionInfo(questions[0]);
				console.log(data);
			}
		});
	}

	function displayQuestions(){
		for(let i = 0; i < questions.length; i++){
			$(".data-sidebar__text").append('\
				<div class="data-sidebar__data-text">\
					<a href="#" id=' + i + '>' + questions[i].text.substr(0, 25) + '...</a>\
				</div>'
			);
		}
	}

	function drawChart(maxValue, curValue, color, text){
		$(".charts").append("<div class='charts__chart' style='height: " + curValue / maxValue * $(".charts").height() + "px; background-color: " + color + "'><div class='charts__value'>" + parseInt(curValue) + "</div></div>");
		$(".charts-info").append("<div class='chart-legend'><span style='background-color: " + color + "''></span>" + text + "</div>");
	}

	function getQuestionInfo(question, functionAfterDone){
		$.ajax({
			type: "POST",
			url: " https://photograd.kz/hackathon/question_statistics",
			headers:{
				"X-SESSION-ID": sessionId
			},
			data:'{\
				"question_id": ' + question.id + ',\
				"date_from": "13/03/2019 16:30",\
				"date_until": "13/04/2019 16:30"\
			}',
			success: function(stat){
				statistics = stat.data;
				functionAfterDone();
			},
			error: function(msg, err){
				console.log(err.status);
			}
		});
	}
});