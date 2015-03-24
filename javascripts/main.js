'use strict';
/**
 * @ngdoc function
 * @name joshgameApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the joshgameApp
 */
var mod = angular
  .module('joshgameApp', [

  ]);
  
angular.module('joshgameApp')
        .controller('MainCtrl', function ($scope, $log) {            
            $scope.directionList = ["e", "n", "ne", "nw", "s", "se", "sw", "w"];
            $scope.lumberjackDirection = $scope.directionList[0];
            $scope.width = 800;
            $scope.height = 800;
            $scope.heroWidth = 96;
            $scope.heroHeight = 96;
            $scope.speed = 90; //px/s
            $scope.animations =
                    {
                        knight: [
                            {
                                action: "walk",
                                startRow: 16,
                                numFrames: 8,
                                animSpeed: 800
                            }
                        ],
                        lumberjackAll: [
                            {
                                action: "walk",
                                startRow: 8,
                                numFrames: 8,
                                animSpeed: 800,
                                size: 96
                            },
                            {
                                action: "walk_with_lumber",
                                startRow: 16,
                                numFrames: 8,
                                animSpeed: 800,
                                size: 96
                            },
                            {
                                action: "first",
                                startRow: 0,
                                numFrames: 7,
                                animSpeed: 800,
                                size: 128
                            },
                            {
                                action: "second",
                                startRow: 8,
                                numFrames: 7,
                                animSpeed: 800,
                                size: 128
                            },
                            {
                                action: "third",
                                startRow: 16,
                                numFrames: 13,
                                animSpeed: 1000,
                                size: 128
                            },
                            {
                                action: "fourth",
                                startRow: 24,
                                numFrames: 7,
                                animSpeed: 800,
                                size: 128
                            }
                        ],
                        lumberjack96: [
                            {
                                action: "walk",
                                startRow: 8,
                                numFrames: 8,
                                animSpeed: 800
                            },
                            {
                                action: "walk_with_lumber",
                                startRow: 16,
                                numFrames: 8,
                                animSpeed: 800
                            }]
                        ,
                        lumberjack128: [
                            {
                                action: "first",
                                startRow: 0,
                                numFrames: 7,
                                animSpeed: 800
                            },
                            {
                                action: "second",
                                startRow: 8,
                                numFrames: 7,
                                animSpeed: 800
                            },
                            {
                                action: "third",
                                startRow: 16,
                                numFrames: 13,
                                animSpeed: 1000
                            },
                            {
                                action: "fourth",
                                startRow: 24,
                                numFrames: 7,
                                animSpeed: 800
                            }
                        ]
                    };
            $scope.lumberjackAnimation = $scope.animations.lumberjackAll[0];

            $scope.init = function () {                
                Crafty.init(800, 600);
                Crafty.canvas.init("sample");
                Crafty.c("Hero", {
                    init: function () {
                        this.addComponent("2D, Canvas, Color, MouseFace");
                        this.w = $scope.heroWidth; // width
                        this.h = $scope.heroHeight; // height
//                        this.color("red");
                    }
                });
                Crafty.c('CharAnims', {
                    CharAnims: function (animationInfo) {
                        this.requires("SpriteAnimation, Grid");
                        for (var j = 0; j < animationInfo.length; j++) {
                            var actionInfo = animationInfo[j];
                            var actionName = actionInfo.action;
                            var startRow = actionInfo["startRow"];
                            var numFrames = actionInfo["numFrames"];
                            var animSpeed = actionInfo["animSpeed"];
                            for (var i = 0; i < $scope.directionList.length; i++) {
                                var action = actionName + "_" + $scope.directionList[i];
                                var row = startRow + i;
                                //$log.log("Creating reel: " + action + " row: " + row + " numFrames: " + numFrames + " animSpeed: " + animSpeed);
                                this.reel(action, animSpeed, 0, row, numFrames);
                            }

                        }
                        $log.log("in CharAnims definition");
                        return this;
                    }
                });
                Crafty.sprite(128, "images/lumberjack128.png",
                        {lumberjack128: [0, 0]});
                Crafty.sprite(96, "images/lumberjack96.png",
                        {lumberjack96: [0, 0]});
                Crafty.sprite(128, "images/trees.png",
                        {tree: [1, 1]});
//                var Player = Crafty.e("Hero").attr({x:10, y:10});
                Crafty.sprite(96, "images/greenKnight.PNG",
                        {knight: [0, 25]});
                var startX = ($scope.width / 2) - ($scope.heroWidth / 2);
                var startY = ($scope.height / 2) - ($scope.heroHeight / 2);
                $log.log("Start position: " + startX + "," + startY);
                $scope.tree = Crafty.e("2D, Canvas, tree").attr({x: 600, y: 250})
                $scope.player2 = Crafty.e("Hero, knight, Tween, SpriteAnimation, CharAnims, MouseFace").attr({x: startX, y: startY})
                        .bind("MouseDown", function (data) {
                            //$log.log("mouse click: " + angular.toJson(data));
                            $log.log("Current position: " + this.x + "," + this.y);
                            var deltaY = (data.realY - (this.y + 48));
                            var deltaX = (data.realX - (this.x + 48));
                            var computedAngle = Math.atan2(deltaY, deltaX) / Math.PI * 180.0;
                            if (computedAngle < 0) {
                                computedAngle = (computedAngle + 360);
                            }
                            var angle = computedAngle; //this.getAngle() * 180 / Math.PI;
                            var distance = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
                            var time = Math.round(1000 * distance / $scope.speed);
                            $log.log("Covering " + distance + " pixels in " + time + " ms");
                            $log.log("Movingi n " + time + " ms");
                            var gameX = data.realX - 48;
                            var gameY = data.realY - 48;
                            this.tween({x: gameX, y: gameY}, time)
                                    .bind("TweenEnd", function () {
                                        $log.log("tween complete");
                                    });
                            ;
                            $log.log("computedAngle = " + computedAngle + " angle: " + angle);
                            if (data.mouseButton == Crafty.mouseButtons.LEFT) {
                                //var angle = this.getAngle() * 180 / Math.PI;
                                //$log.log("angle: " + angle);
                                if (angle >= 0 && angle < 22.5) {
                                    this.animate("walk_e", -1);
                                } else if (angle >= 22.5 && angle < 67.5) {
                                    this.animate("walk_se", -1);
                                } else if (angle >= 67.5 && angle < 112.5) {
                                    this.animate("walk_s", -1);
                                } else if (angle >= 112.5 && angle < 157.5) {
                                    this.animate("walk_sw", -1);
                                } else if (angle >= 157.5 && angle < 202.5) {
                                    this.animate("walk_w", -1);
                                } else if (angle >= 202.5 && angle < 247.5) {
                                    this.animate("walk_nw", -1);
                                } else if (angle >= 247.5 && angle < 292.5) {
                                    this.animate("walk_n", -1);
                                } else if (angle >= 292.5 && angle < 337.5) {
                                    this.animate("walk_ne", -1);
                                } else {
                                    this.animate("walk_e", -1);
                                }

                            }

                        }).CharAnims($scope.animations.knight);
                Crafty.viewport.follow($scope.player2, 0, 0);

                $scope.lumberjack128 = Crafty.e("lumberjack96, SpriteAnimation, CharAnims, 2D, Canvas")
                        .attr({w: 128, h: 128, x: 300, y: 400})
                        .CharAnims($scope.animations.lumberjack128)
                        .CharAnims($scope.animations.lumberjack96);
                $scope.lumberjack128.animate($scope.lumberjackAnimation.action + "_" + $scope.lumberjackDirection, -1);
            };

            $scope.changeLumberjackAnimation = function () {
                $log.log("Selected animation is: " + angular.toJson($scope.lumberjackAnimation));
                var action = $scope.lumberjackAnimation.action + "_" + $scope.lumberjackDirection
                $log.log("Setting lumberjack animation to: " + action);
                if($scope.lumberjackAnimation.size === 96){
                    $log.log("Toggling to 96 sprite component");
                    $scope.lumberjack128.toggleComponent("lumberjack128", "lumberjack96");
                } else {
                    $log.log("Toggling to 128 sprite component");
                    $scope.lumberjack128.toggleComponent("lumberjack96", "lumberjack128");
                }
                $scope.lumberjack128.animate(action, -1);
            }

//            $scope.changeLumberjackAnimation128 = function () {
//                $log.log("Selected animation is: " + angular.toJson($scope.lumberjackAnimation));
//                var action = $scope.lumberjackAnimation128.action + "_" + $scope.lumberjackDirection
//                $log.log("Setting lumberjack animation to: " + action);
//                $scope.lumberjack128.toggleComponent("lumberjack96", "lumberjack128").animate(action, -1);
//            }

            $scope.animateKnight = function () {
                $scope.player2.animate("paused_sw", 1);
            };
        });
