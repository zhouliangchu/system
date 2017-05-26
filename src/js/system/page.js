/**
 * Created by Administrator on 2017/5/25.
 */
// 封装一个分页的服务
app.service('page', function(){
    return function($scope){
        // 将$scope作为一个参数传入到服务中，此服务将能使用控制其中的所有属性和方法
        // console.log($scope.fileData());
        $scope.lastBoll = true;

        // 重新定义一个变量用来存储原始数据
        var oldData = $scope.fileData();
        // 得到页数 = Math.ceil(数据总长度 / 每页显示的数据长度)
        $scope.allPage = Math.ceil(oldData.length/$scope.dataNum);
        // 定义一个数组用来存放页数，好渲染至页面，存放的页数为第二页至倒数第二页
        $scope.pageArr = [];
        for(var i=2;i<$scope.allPage;i++){
            $scope.pageArr.push(i);
        }

        // 点击每一页通过页码判断所要显示的数据
        $scope.changeIndex = function(i){
            $scope.pageShow(i);
            $('.page input').val(i);
        };

        // 当前显示哪几页
        $scope.pageShow = function(i){
            // 通过下标和点击事件控制显示的当前页 i代表当前页页码 $scope.index 为当前页的下标
            $scope.index = i-1;
            // 控制前后……的显示隐藏
            $scope.topMore = false;
            $scope.lastMore = false;

            // 判断要显示哪几页页码以及前后……
            // 显示的页码中中间页左右各显示几页
            $scope.len = ($scope.midPage-1)/2;
            if($scope.index<$scope.midPage-$scope.len){
                $scope.topMore = false;
                $scope.lastMore = true;

                $scope.showArr = [];// 存放要显示的页数
                // 从第二页开始至中间页
                for(var i=2;i<=$scope.midPage;i++){
                    $scope.showArr.push(i);
                }
            }else if($scope.index>=$scope.midPage-$scope.len && $scope.index<=$scope.allPage-$scope.len-2){
                $scope.topMore = true;
                $scope.lastMore = true;

                if($scope.index == $scope.midPage-$scope.len){
                    $scope.topMore = false;
                }

                if($scope.index == $scope.allPage-$scope.len-2){
                    $scope.lastMore = false;
                }

                // 显示当前页
                $scope.showArr = [$scope.index+1];
                // 显示当前页前面几页
                for(var i=0;i<$scope.len;i++){
                    $scope.showArr.push($scope.index-i);
                }
                // 显示当前页后面几页
                for(var i=2;i<=$scope.len+1;i++){
                    $scope.showArr.push($scope.index+i);
                }
            }else{
                $scope.topMore = true;
                $scope.lastMore = false;

                $scope.showArr = [];
                for(var i=1;i<$scope.midPage;i++){
                    $scope.showArr.push($scope.allPage-i);
                }
            }

            if($scope.allPage <= 6){
                $scope.topMore = false;
                $scope.lastMore = false;
            }
            if($scope.allPage <= 1){
                $scope.lastBoll = false;
            }

            // 每一页要显示的数据
            $scope.cutDataFn();
        };

        // 截取当前页所显示的数据
        $scope.cutDataFn = function(){
            var newData = $scope.fileData();
            // $scope.index*$scope.dataNum: 当前页显示的第一条数据的下标
            // $scope.dataNum: 每页显示的数据个数
            $scope.cutData = newData.splice($scope.index*$scope.dataNum,$scope.dataNum);
        };

        // 当输入框的值改变时跳至相应页数
        $scope.changeValue = function(){
            $scope.value = $('.page input').val();
            $scope.pageShow($scope.value);
        };

        // 点击上一页下一页
        $scope.updownPage = function(i){
            if(i == '+'){
                if($scope.index+1 < $scope.allPage){
                    $scope.pageShow($scope.index+2);
                    $('.page input').val($scope.index+1);
                }
            }else{
                if($scope.index > 0){
                    $('.page input').val($scope.index);
                    $scope.pageShow($scope.index);
                }
            }
        };

        $scope.pageShow(1);
    }
});