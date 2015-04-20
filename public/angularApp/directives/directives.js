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
						scope.postMessageToChat(scope.username, scope.messageText, true);
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
    return {
        scope: {
            drop: '&' // parent
        },
        link: function(scope, element) {
            
        	var el = element[0];

			el.addEventListener(
			    'dragover',
			    function(e) {
			    	console.log("DRAGGAING OVER -----");
			        e.dataTransfer.dropEffect = 'move';
			        // allows us to drop
			        if (e.preventDefault) e.preventDefault();
			        this.classList.add('over');
			        return false;
			    }
			    
			);

            el.addEventListener(
                'drop',
                function(e) {
                	console.log("USER DROPPED STUFF !");
                    // Stops some browsers from redirecting.
                    // if (e.stopPropagation) e.stopPropagation();
                    
                    // this.classList.remove('over');

                    // var item = document.getElementById(e.dataTransfer.getData('Text'));
                    // this.appendChild(item);

                    // call the drop passed drop function
                    // scope.$apply('drop()');

                    return false;
                },
                false
            );
        }
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
            	console.log("dragstart: ");
            	console.log(e);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
            	console.log("dragend: ");
            	console.log(e);
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});