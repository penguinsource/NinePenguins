var nineApp = angular.module("nineApp");

nineApp.directive('sendMessagebtn', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<button id="sendMessageBtn">Send Message',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				if (scope.messageText != ''){
					scope.$apply(function(){
						scope.postMessageToChat(scope.username, 
													scope.messageText, true);
					});
					
				}
			});
		}
	};
});

nineApp.directive('userMessage', function() {
	return {
		restrict: 'E',
		// replace: true,
		template: "<p class='userMessageWrap'><span class='userMessageAuthor'>{{author}}</span class='userMessage'>{{messageText}}<span></span></p>",
		scope: {
			author: '@authorName',
			messageText: '@message'
		}
	};
});

nineApp.directive('droppable', function() {
    // return {
        // scope: {
        //     drop: '&' // parent
        // },
        // link: function(scope, element) {
    return function(scope, element) {
        	var el = element[0];

			el.addEventListener(
			    'dragover',
			    function(e) {
			    	console.log("Drag Over");
                    // console.log(e);
                    // console.log(scope);

			        e.dataTransfer.dropEffect = 'move';
			        // allows us to drop
			        if (e.preventDefault) e.preventDefault();

			        // this.classList.add('over');
                    // this.classList.remove("pinFreePlace");
                    var pinIndex = e.target.attributes["data-pinIndex"].value;
                    
                    // if it's my turn,show that pin could be placed at pinIndex
                    if (scope.gameCtrl.isMyTurn()){
                        this.classList.add("player1Pin");
                        this.classList.remove("pinFreePlace");
                        // console.log(this.classList);
                    }
                    // console.log("CLASS LIST:");
                    // 
                    
                    // scope.setPinAction("dragover", pinIndex);
			        return false;
			    },
                false
			    
			);

            el.addEventListener("dragleave", function(e){
                console.log("Drag Leave");
                this.classList.remove("player1Pin");
                this.classList.add("pinFreePlace");
            })

            el.addEventListener(
                'drop',
                function(e) {
                	console.log("Drop");
                    // console.log(e);
                    // console.log("----");
                    console.log(e.target.attributes["data-pinIndex"].value);
                    // Stops some browsers from redirecting.
                    // if (e.stopPropagation) e.stopPropagation();
                    
                    // this.classList.remove('over');

                    // var item = document.getElementById(e.dataTransfer.getData('Text'));
                    // this.appendChild(item);

                    // call the drop passed drop function
                    // scope.$apply('drop()');
                    var pinIndex = e.target.attributes["data-pinIndex"].value;
                    scope.setPinAction("dropppp", pinIndex);
                    return false;
                },
                false
            );
        // }
    }
});

nineApp.directive('draggable', function() {
    return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
            	console.log("dragstart");
            	// console.log(e);
                // console.log("value: ");
                // console.log(scope);
                // console.log(this);
                // console.log(scope);
                // console.log(e.target.attributes["data-pinIndex"].value);
                var pinIndex = e.target.attributes["data-pinIndex"].value;
                e.dataTransfer.effectAllowed = 'move';
                // e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                scope.setPinAction("dragstart", pinIndex);
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
            	console.log("dragend");
            	// console.log(e);
                // console.log("value: ");
                // console.log(e.target.attributes["data-pinIndex"].value);
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});