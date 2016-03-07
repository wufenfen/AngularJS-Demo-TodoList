angular.module("app",[])
	.controller("TestCtrl",['$scope', function($scope){ 
		$scope.todos = [{
			content:'learn angular',
			done:true
		},{
			content:'build an angular app',
			done:false
		}];

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

	}]);





