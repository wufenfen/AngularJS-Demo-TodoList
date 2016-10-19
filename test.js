angular.module("app",["ui.bootstrap"])
	.controller("TestCtrl",["$scope", function($scope){ 
		$scope.todos = [{
			content:'learn angular',
			done:true
		},{
			content:'build an angular app',
			done:false
		}];

		$scope.author = {
			name: 'Claire',
			gender:"female"
		}

		$scope.author1 = {
			name: 'Pan',
			gender:"male"
		}
 
		$scope.todos.remaining = function(){
			var remain=0;
			$scope.todos.forEach(function(ele,index){
				if(!ele.done){
					remain++;
				}
			})
			return remain;
		};

		$scope.addToList = function(){
			$scope.todos.push({
				content: $scope.nextTodo,
				done:false
			});
			$scope.nextTodo = '';
		}

		$scope.archive = function(){
			var oldLists = $scope.todos;
			$scope.todos = [];
			$scope.todos.remaining = oldLists.remaining;  //保留对象的计数函数 
			oldLists.forEach(function(ele,index){
				if(!ele.done){
					$scope.todos.push(ele); 
				}
			}); 
		}

	}])
	.directive("ableEdit",function(){
		return {
			require: 'ngModel',
			link: function(scope, ele, attrs,ctrl){

				//view -> model
				ele.on('blur',function(){
					ctrl.$setViewValue(ele.html())
				});

				//model -> view
				ctrl.$render = function(){
					ele.html(ctrl. $viewValue);
				}

				//load the init value to the model
				ctrl.$setViewValue(ele.html());
			}
		}
	})
	.directive('author',['$window', function($window){
		return {
			restrict:'AE',
			scope:{
				authorInfo:'='
			},
			transclude:true,
			template: '<div> Name:{{authorInfo.name}}; <span ng-transclude> </span>Gender:{{authorInfo.gender}} </div>',
			link: function(scope, ele,atrrs, ctrl){
				ele.on('click',function(){
					$window.alert('This element is clicked!');
				})

				ele.on('$destroy', function() {
			        $window.alert('oh, My god, I am being destroied!');
			    });
			}
		}
	}])
	.directive('myTabs', function(){
		return {
			restrict: "AE",
			scope:{},// 独立作用域
			transclude:'true',
			template: '<div> <ul> <li ng-repeat="pane in panes" ng-click="select(pane)"> {{pane.title}} </li> </ul> \
			<div ng-transclude></div></div>' ,
			controller: ['$scope', function($scope){
				var panes = $scope.panes = [];
				this.addPane = function(pane){
					if(panes.length === 0){
						$scope.select(pane);
					}
					panes.push(pane);
				}

				$scope.select = function(pane){
					angular.forEach(panes, function(pane){
						pane.selected = false;
					})
					pane.selected = true;
				}
			}]
		}
	})
	.directive('myPane', function(){
		return {
			require:'^^myTabs',
			restrict: "AE",
			scope:{
				title:'@'
			},
			transclude:'true',
			template: '<div ng-show="selected"><h2> {{title}} </h2> <div ng-transclude></div> </div> ',
			link: function(scope, ele, atrrs, ctrl){ 
				ctrl.addPane(scope);
			}
		}
	})




