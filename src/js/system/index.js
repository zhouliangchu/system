/**
 * Created by Administrator on 2017/5/22.
 */

// 配置一级路由，即头部点击个人中心、系统设置等时跳转不同的路由渲染不同的数据
// 因为此时页面的格式相同只是数据不同，所以显示的为同一页面不同数据
var num = 100;
app.config(function(alldata,$stateProvider){
    // 遍历数据中第一个数组里面的数据，分别为他们配置不同的路由
    alldata.fstdata.forEach(function(item){
        $stateProvider
            .state({
                name: item.route,
                url: '/'+ item.route,
                templateUrl: 'page/aside.html',
                // 通过遍历得到所有的路由，不同路由的页面分属不同的控制器
                controller: function($scope,alldata,$stateParams){
                    // 从数据中的第二个数组里筛选出parentid与第一个数组的id相同的数据分别进行渲染
                    var newData = alldata.secdata.filter(function(i){
                        return i.parentid == $stateParams.self.id
                    });
                    // console.log(newData);
                    // 存放每次筛选出来的数据
                    $scope.data = newData;
                    // 侧边栏管理项的题目
                    $scope.parentName = $stateParams.self.nickname;

                    // 控制侧边栏管理项的显示隐藏
                    $scope.listShow = true;
                    $scope.addShow = false;
                    // 点击侧边栏题目出现管理项事件
                    $scope.showFn = function(){
                        $scope.listShow = !$scope.listShow;
                        $scope.addShow = !$scope.addShow;
                    }
                },
                // 将第一个数组里的每一个对象作为参数传递，通过判断id与第二个数组里的parentid对应来渲染相应的内容
                params: {
                    self: item
                }
            })
    });

    // 遍历第二个数组里面的数据，配置二级路由，显示每项管理的详细页面
    alldata.secdata.forEach(function(i){
        $stateProvider
            .state({
                name: i.route,
                url: '/'+ i.route,
                templateUrl: 'page/'+ i.enName+'.html',
                controller: function($scope,alldata,page,$filter,$rootScope){

                    // 用户管理
                    var nameFn = function(message){
                       // $scope.data = alldata.thirdata;
                        $scope.fileData = function(){
                            // 过滤后返回一个新的对象
                            return $filter('filter')(message,{role:$scope.sysRole,state:$scope.statues,loginname:$scope.loginName})
                        };

                        // 分页
                        // 定义每一页显示数据的长度
                        $scope.dataNum = 2;
                        // 定义中间页显示的页数，只能为奇数
                        $scope.midPage = 5;

                        // 调用分页的服务，并将$scope作为参数传递过去
                        page($scope);
                        $scope.pageShow(1);
                        // 点击查询进行筛选
                        $scope.searchFn=function () {
                            $scope.pageShow(1);
                        };

                        //  删除
                        // 控制弹出框的显示隐藏，最初先隐藏起来
                        $scope.popupShow = false;
                        // 点击删除时显示弹出框
                        $scope.remove=function (item) {
                            $scope.popupShow = true;
                            // 点击确定，弹出框消失，同时进行删除
                            $scope.sureFn = function(){
                                $scope.popupShow = false;
                                var indexPage;
                                // 点击查询时从筛选出的数据中定位页码，使查询后删除后页面还停留在当前页  $scope.fileData() 进行筛选后的数据
                                $scope.fileData().forEach(function(i,index){
                                    switch (i.ID){
                                        case item.ID:{
                                            indexPage= Math.ceil(index/$scope.dataNum);
                                            // 判断当删除的为第一页第一条数据时仍留在本页
                                            if(indexPage == 0){
                                                indexPage = 1;
                                            }
                                        }
                                    }

                                });

                                // $scope.data原始数据，删除时要将数据从原始数据中删除，然后需重新调用分页服务
                                message.forEach(function (i,index) {
                                    switch (i.ID){
                                        case item.ID:{
                                            message.splice(index,1);
                                        }
                                    }
                                });

                                // console.log(indexPage)
                                $scope.pageShow(indexPage);
                            };

                            // 点击取消弹出框消失，同时保留数据不进行删除
                            $scope.noFn = function(){
                                $scope.popupShow = false;
                            }

                        };

                        // 修改
                        $scope.boll = false; // 控制修改弹出框的显示隐藏
                        $scope.update = function(item){
                            $scope.boll = true;
                            $scope.start = '启用';
                            $scope.stop = '禁用';
                            $scope.changeState = item.state;
                            // 通过ng-value 和 ng-model 来监测单选框的选中项，ng-value 的值等于 ng-model 的值的那一项即为选中项

                            // 将进行修改的数据传送给修改框
                            $scope.tar = {};
                            for(k in item){
                                $scope.tar[k] = item[k];
                            }

                            // 选择的状态发生改变事件
                            $scope.changeFn = function(val){
                                // 将选中那一项的值赋给ng-model
                                $scope.changeState = val;
                            };
                            // 修改后点击确定
                            $scope.sure = function(){
                                $scope.boll = false;

                                message.forEach(function(ele,index){
                                    // 判断ID相等时将修改后的值保存至原始数据中
                                    if(ele.ID == $scope.tar.ID){
                                        for(i in $scope.tar){
                                            message[index][i] = $scope.tar[i]
                                        }

                                        // 将原数据中的状态改为修改后的状态
                                        message[index].state = $scope.changeState;
                                    }
                                });
                            };

                            // 修改后点击取消
                            $scope.no = function(){
                                $scope.boll = false;
                            };
                            page($scope);
                        };
                    };

                    // 添加用户
                    var addNameFn = function(){
                        $scope.data = alldata.thirdata;
                        // 定义一个空对象，用来存放添加用户的信息
                        $rootScope.add = {};

                        // 用户的创建时间
                        var today = new Date();
                        var y = today.getFullYear();
                        var M = today.getMonth()+1;
                        var d = today.getDate();
                        var h = today.getHours();
                        var m = today.getSeconds();
                        var time = y+'-'+change(M)+'-'+change(d)+' '+change(h)+':'+change(m);

                        function change(n){
                            if(n<10){
                                n = '0'+n;
                            }
                            return n
                        }

                        $rootScope.add.ID = num++;
                        $rootScope.add.creattime = time;

                        $scope.addName = function(){
                            $scope.data.push($rootScope.add);
                            alert('用户添加成功');
                        }
                    };

                    switch (i.id){
                        case 23:{
                            $scope.data = alldata.thirdata;
                            // 用户管理
                            nameFn($scope.data);
                        }break;
                        case 22:{
                            // 角色管理
                            $scope.data=alldata.fourdata;
                            nameFn($scope.data);
                        }break;
                        case 21:{
                            addNameFn()
                        }break;
                    }
                }
            })
    })
});




