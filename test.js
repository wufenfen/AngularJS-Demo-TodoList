angular.module("app",[])
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
	.directive('navTree', function(){
		return { 
			restrict: "AE", 
			scope:{},
			replace:true,
			transclude:'true',
			template: '<div class=""><div ng-transclude></div></div>',
			controller: ['$scope', function($scope){
				var navTree = $scope.navTree = [];
				this.addNav = function(navGroup){
					navTree.push(navGroup);
					if(navTree.length === 1 ){
						navTree[0].isShow = true;
					}
				}
			}]
		}
	})
	.directive('navGroup', function(){
		return { 
			require:'^^navTree',
			restrict: "AE", 
			replace:true,
			scope:{
				title:'@'
			},
			transclude:'true',
			template: '<div> <div ng-click="toggle()" class="navLevel1"> {{title}} </div> <ul ng-show="isShow"><div ng-transclude></div></ul></div>',
			controller: ['$scope', function($scope){
				var navList = $scope.navList = []; 
				this.addNavItem = function(navItem){
					navList.push(navItem);
				}
				$scope.toggle = function(){
					if( $scope.isShow ){
						$scope.isShow = false;
					}
					else{
						$scope.isShow = true;
					}
				}
			}],
			link: function(scope, ele, atrrs, navTreeCtrl){ 
				navTreeCtrl.addNav(scope);
			} 
		}
	})
	.directive('navItem', function(){
		return { 
			require:'^^navGroup',
			replace:true,
			scope:{
				navRoute: '@'
			},
			restrict: "AE",  
			transclude:'true',
			template: '<li class="navLevel2"><div ng-transclude></div></li>',
			link: function(scope, ele, atrrs, navGroupCtrl){ 
				navGroupCtrl.addNavItem(scope);
				ele.on('click', function(){
					window.location.hash = atrrs.navRoute;
				})
			}  
		}
	})
	.directive('myPager', function(){
		return { 
			restrict:'E',
			replace:true,
			scope:{
				totalPage: "=",
				currentPage:"=",
				pageSize:"=",
				pageChanged:"&"
			}, 
			transclude:'true',
			template: '<ul class="pagination"> \
		        <li ng-class="{disabled: noPrevious()}" ng-click="selectPrevious()" ng-disabled="noPrevious()"><a href="#{{currentPage-1}}">&laquo;</a></li> \
		        <li ng-repeat="page in pages" ng-click="selectPage(page)"><a href="#{{page}}"> {{page}} </a></li> \
		        <li ng-class="{disabled: noNext()}" ng-click="selectNext()" ng-disabled="noNext()"><a href="#{{currentPage+1}}">&raquo;</a></li>\
		   </ul>',
			link: function(scope, ele, atrrs, ctrl){  
				scope.pages = [];
				for(var i=1; i<=scope.totalPage; i++){
					scope.pages.push(i);
				}

				scope.isActive = function(page){
					return scope.tempPage === page;
				}

				scope.$watch('currentPage', function(value){ 
					scope.selectPage(value); 
				})

				scope.selectPage = function(page){
					if(!scope.isActive(page)){
						scope.tempPage = page;
						//scope.pageChanged(page);
						console.log(page);
					}
				}

				scope.selectPrevious = function(){
					if(!scope.noPrevious()){
						scope.selectPage(scope.tempPage-1);
					}
				}

				scope.noPrevious = function(){
					return scope.tempPage -1 < 1 ;
				}

				scope.selectNext = function(){
					if(!scope.noNext()){
						scope.selectPage(scope.tempPage+1);
					}
				}

				scope.noNext = function(){
					return scope.tempPage +1 > scope.totalPage;
				}
			}  
		}
	})





