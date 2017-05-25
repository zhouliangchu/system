/**
 * Created by Administrator on 2017/5/22.
 */
var app = angular.module('myapp',['ui.router']);
var num = 100;

app.controller('sysCon', function($scope,alldata,page){
    // 拿到原始数据并保存到一个函数中，调用此函数即可得到原始数据
    $scope.fileData = function(){
        // map方法返回一个新的对象
        return alldata.thirdata.map(function(i){
            return i;
        })
    };

    $scope.data = alldata.thirdata;

    // 分页
    // 定义每一页显示数据的长度
    $scope.dataNum = 2;
    // 定义中间页显示的页数，只能为奇数
    $scope.midPage = 5;

    // 调用分页的服务，并将$scope作为参数传递过去
    page($scope);

    // 点击添加用户、用户管理时切换当前状态
    $('nav ul li').on('click', function(){
        $(this).addClass('current').siblings().removeClass('current');
    });

    // 接收子控制器派发过来的新添加的数据，并添加到数据中
    $scope.$on('addDate', function(e,d){
        $scope.cutData.push(d.data);
    });

    // 删除用户
    $scope.remove = function(id){
        $scope.cutData.forEach(function(ele,i){
            if(ele.ID == id){
                $scope.cutData.splice(i,1);
                // console.log(i);
            }
        })
    };

    // 修改
    $scope.update = function(id){
        $scope.boll = true;

        $scope.cutData.forEach(function(ele,i){

            if(ele.ID == id){
                $scope.tar = {};
                for(k in ele){
                    $scope.tar[k] = ele[k];
                }
            }
        })
    };

    // 修改后点击确定
    $scope.sure = function(){
        $scope.boll = false;

        $scope.cutData.forEach(function(ele,index){
            if(ele.ID == $scope.tar.ID){
                $scope.cutData[index] = $scope.tar
            }
        })
    };

    // 修改后点击取消
    $scope.no = function(){
        $scope.boll = false;
        // $scope.cutData = alldata.thirdata;
    };

});

app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/user');
    $stateProvider
        .state({
            name: 'add',
            url: '/add',
            templateUrl: 'page/add.html',
            controller: function($scope){
                $scope.add = {};
                // 添加用户
                $scope.addFn = function(){
                    // 用户的创建时间
                    var today = new Date();
                    var y = today.getFullYear();
                    var M = today.getMonth();
                    var d = today.getDate();
                    var h = today.getHours();
                    var m = today.getSeconds();
                    var time = y+'-'+change(M)+'-'+change(d)+' '+change(h)+':'+change(m);
                    function change(num){
                        if(num<10){
                            num = '0'+num;
                        }
                        return num
                    }

                    $scope.add.ID = num++;
                    $scope.add.creattime = time;

                    // 将新添加的数据派发给父控制器
                    $scope.$emit('addDate', {
                        data: $scope.add
                    })
                }
            }
        })
        .state({
            name: 'user',
            url: '/user',
            templateUrl: 'page/user.html'
        })
});


