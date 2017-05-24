/**
 * Created by Administrator on 2017/5/22.
 */
var app = angular.module('myapp',['ui.router']);
var num = 9;

app.controller('sysCon', function($scope,alldata){
    $scope.data = alldata.thirdata;
    $scope.boll = false;
    $scope.pages = []; // 存放每一页的页数
    $scope.pageSize = 2; // 每页显示的行数
    $scope.num = $scope.data.length;// 总共有几条数据
    $scope.page = 0; // 总页数

    // 总共有多少页
    if($scope.num/$scope.pageSize > parseInt($scope.num/$scope.pageSize)){
        $scope.page = parseInt($scope.num/$scope.pageSize)+1;
    }else{
        $scope.page = parseInt($scope.num/$scope.pageSize);
    }

    for(var i=1;i<$scope.page+1;i++){
        $scope.pages.push(i);
    }

    // 点击添加用户、用户管理时切换当前状态
    $('nav ul li').on('click', function(){
        $(this).addClass('current').siblings().removeClass('current');
    });

    // 接收子控制器派发过来的新添加的数据，并添加到数据中
    $scope.$on('addDate', function(e,d){
        $scope.data.push(d.data)
    });

    // 删除用户
    $scope.remove = function(id){
        $scope.data.forEach(function(ele,i){
            if(ele.ID == id){
                $scope.data.splice(i,1)
            }
        })
    };

    // 修改
    $scope.update = function(id){
        $scope.boll = true;

        $scope.data.forEach(function(ele,i){

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

        $scope.data.forEach(function(ele,index){
            if(ele.ID == $scope.tar.ID){
                $scope.data[index] = $scope.tar
            }
        })
    };

    // 修改后点击取消
    $scope.no = function(){
        $scope.boll = false;
        $scope.data = alldata.thirdata;
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

// 自定义一个分页的指令
app.directive('page', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="total"><p>总共有<span></span>条数据</p><div class="pages"><button>上一页</button><ul class="page"><li ng-repeat="item in pages track by $index">{{item}}</li></ul><button>下一页</button></div><div class="num">第<input type="text">页</div></div>',
        link: function(scope,iElement,iAttrs){
            var currentPage = 1; // 当前页



            // console.log(scope.pages)

            // 点击至哪一页
            function pageTo(pNow){

                // 当前显示的页数
                currentPage = pNow;
                // 当前页显示的第一条数据
                startR = (currentPage-1)*scope.pageSize+1;
                // 当前页显示的最后一条数据
                endR = currentPage*scope.pageSize;
                // 判断当前页显示的最后一条数据的行数是否超过了总数据的行数
                endR = (endR>scope.num) ? scope.num : endR;

                setTimeout(function(){
                    $('thead tr').css('display','block');
                    $('#tbody tr').each(function(i,ele){
                        if(i>=startR-1 && i<=endR-1){
                            $(this).css('display','block');
                        }else{
                            $(this).css('display','none');
                        }
                    })
                })
            }
            pageTo(1);

            setTimeout(function(){

                $(iElement).find('li').each( function(i,ele){

                    $(this).on('click', function(){
                        var ind = i+1;

                        scope.$apply(function(){
                            pageTo(ind);

                        });
                    })
                });
            });

        }
    }
});

app.service('alldata', function(){
    return{
        fstdata:[
            {
                id:1,
                name:'个人中心',
                nickname:'账户管理'
            },
            {
                id:2,
                name:'系统设置',
                nickname:'权限管理'
            }
        ],
        secdata:[
            {
                id:11,
                parentid:1,
                name:'个人信息',
                page:'grxx.html'
            },
            {
                id:12,
                parentid:1,
                name:'修改密码',
                page:'xgmm.html'
            },
            {
                id:21,
                parentid:2,
                name:'功能配置',
                page:'gnpz.html'
            },
            {
                id:22,
                parentid:2,
                name:'角色管理',
                page:'jsgl.html'
            },
            {
                id:23,
                parentid:2,
                name:'用户管理',
                page:'yhgl.html'
            }
        ],
        thirdata:[
            {
                ID:1,
                parentid:23,
                loginname:'zhangsan',
                name:'张三',
                role:'13管理员aaa',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'启用',
                creattime:'2014-07-27 16:56'
            },
            {
                ID:2,
                parentid:23,
                loginname:'lisi',
                name:'李四',
                role:'13管理员aaa',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'禁用',
                creattime:'2014-07-27 16:56'
            },
            {
                ID:3,
                parentid:23,
                loginname:'wangwu',
                name:'王五',
                role:'13管理员aaa',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'启用',
                creattime:'2014-07-27 16:56'
            },
            {
                ID:4,
                parentid:23,
                loginname:'zhangchen',
                name:'张晨',
                role:'13管理员aaa',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'启用',
                creattime:'2014-07-27 16:56'
            },
            {
                ID:5,
                parentid:23,
                loginname:'liucheng',
                name:'刘成',
                role:'管理员',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'禁用',
                creattime:'2014-07-27 16:56'
            },
            {
                ID:6,
                parentid:23,
                loginname:'liji',
                name:'李继',
                role:'13管理员aaa',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'禁用',
                creattime:'2014-07-27 16:56'
            },
            {
                ID:7,
                parentid:23,
                loginname:'yuantao',
                name:'袁涛',
                role:'13管理',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'启用',
                creattime:'2014-07-27 16:56'
            },
            {
                ID:8,
                parentid:23,
                loginname:'wangjian',
                name:'王建',
                role:'管理员',
                telephone:'15098950322',
                email:'837990335@qq.com',
                state:'禁用',
                creattime:'2014-07-27 16:56'
            }
        ],
        fourdata:[
            {
                ID:1,
                role:"管理员",
                state:"启用",
                orders:0,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:2,
                role:"管理员2",
                state:"禁用",
                orders:2,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:3,
                role:"管理员",
                state:"禁用",
                orders:5,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:4,
                role:"管理员2",
                state:"启用",
                orders:0,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:5,
                role:"管理员0",
                state:"启用",
                orders:2,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:6,
                role:"管理员1",
                state:"禁用",
                orders:0,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:7,
                role:"管理员是",
                state:"启用",
                orders:0,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:8,
                role:"管理员0",
                state:"启用",
                orders:1,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:9,
                role:"管理员2",
                state:"启用",
                orders:0,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:10,
                role:"管理2",
                state:"启用",
                orders:0,
                creattime:'2014-07-27 16:35'
            },
            {
                ID:11,
                role:"管理员2",
                state:"禁用",
                orders:0,
                creattime:'2014-07-27 16:35'
            }

        ]
    }
})