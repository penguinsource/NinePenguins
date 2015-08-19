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

nineApp.directive('sendGameMessagebtn', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<button id="sendGameMessageBtn">Send',
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

nineApp.directive('confirmClick', function() {
    return {
        link: function (scope, element, attrs) {
            // setup a confirmation action on the scope
            scope.confirmClick = function(msg) {
                // msg can be passed directly to confirmClick('are you sure?') in ng-click
                // or through the confirm-click attribute on the <a confirm-click="Are you sure?"></a>
                msg = msg || attrs.confirmClick || 'Are you sure?';
                // return true/false to continue/stop the ng-click
                return confirm(msg);
            }
        }
    }
})

nineApp.directive('userMessage', function() {
	return {
		restrict: 'E',
		// replace: true,
		template: "<p class='userMessageWrap'><span class='userMessageAuthor'>"+
                  "{{author}}</span class='userMessage'>{{messageText}}<span>"+
                  "</span></p>",
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
			    	// console.log("Drag Over");
                    
			        // allows us to drop
			        if (e.preventDefault) e.preventDefault();

			        // this.classList.add('over');
                    // this.classList.remove("pinFreePlace");
                    var pinIndex = e.target.attributes["data-pinIndex"].value;
                    var sourceIndex = scope.gameCtrl.dragStartIndex;

                    // if it's my turn,show that pin could be placed at pinIndex
                    // if ( scope.gameCtrl.canPlacePin(
                    //                     pinIndex, "player1Pin", sourceIndex) ){
                    //     this.classList.add("player1Ghost");
                    //     this.classList.remove("pinFreePlace");
                    // }

                    // scope.setPinAction("dragover", pinIndex);
			        return false;
			    },
                false
			    
			);

            el.addEventListener("dragleave", function(e){
                // console.log("Drag Leave");
                // var pinIndex = e.target.attributes["data-pinIndex"].value;
                // if (scope.gameCtrl.isPinIndexFree(pinIndex)){
                //     this.classList.add("pinFreePlace");
                // }
                // this.classList.remove("player1Ghost");
            })

            el.addEventListener("dragend", function(e){
                // console.log("Drag Stop!!");
                // if ( (this.classList.indexOf("player1Pin") == -1) ){
                    // this.classList.add("pinFreePlace");
                // }
                // this.classList.remove("player1Ghost");
                // this.classList.remove("player1Pin");
                // this.classList.add("pinFreePlace");
            })

            el.addEventListener(
                'drop',
                function(e) {
                	// console.log("Drop");
                    // console.log(e);
                    // console.log("----");
                    // console.log(e.target.attributes["data-pinIndex"].value);
                    // Stops some browsers from redirecting.
                    // if (e.stopPropagation) e.stopPropagation();
                    
                    // this.classList.remove('over');

                    // var item = document.getElementById(e.dataTransfer.getData('Text'));
                    // this.appendChild(item);

                    // call the drop passed drop function
                    // scope.$apply('drop()');
                    var pinIndex = e.target.attributes["data-pinIndex"].value;
                    scope.setPinAction("dropppp", pinIndex);

                    var myPlayerObj = 
                                scope.gameCtrl.NineCache.getMyPlayerObject();
                    var startIndex = scope.gameCtrl.movingPinStartIndex;

                    // always use scope apply if the call is going to make
                    // changes to the view
                    if(!scope.$$phase) {
                        scope.$apply(function(){
                            if (myPlayerObj.pState == "move"){
                                scope.gameCtrl.movePin(startIndex,
                                                       pinIndex,
                                                       scope.gameCtrl.playerLink);
                            } else if (myPlayerObj.pState == "fly"){
                                scope.gameCtrl.flyPin(startIndex,
                                                       pinIndex);
                            }
                        });
                    }


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
            	// console.log("dragstart");
            	var pinIndex = e.target.attributes["data-pinIndex"].value;
                scope.gameCtrl.movingPinStartIndex = pinIndex;
                // e.dataTransfer.effectAllowed = 'move';
                // e.dataTransfer.setData('Text', this.id);
                // this.classList.add('drag');
                scope.setPinAction("dragstart", pinIndex);
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
            	// console.log("dragend");
            	// console.log(e);
                // console.log("value: ");
                // console.log(e.target.attributes["data-pinIndex"].value);
                return false;
            },
            false
        );
    }
});