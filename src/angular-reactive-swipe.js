(function () {
    'use strict';

    angular.module('angular-reactive-swipe', [])
        .directive('reactiveSwipe', [function reactiveSwipeFactory() {
            return {
                restrict: "E",
                scope: {
                    // locallName: '@myAttr'
                    // locallName: '=twoWayBinding'
                    // locallName: '=?optionalTwoWayBinding'
                    // locallName: '<oneWayBinding'
                    // locallName: '&functionExpression'
                },
                controller: function reactiveSwipeController($scope, $element, $attrs, $transclude) {
                    var $container = angular.element($element[0]);

                    var content = $container.find('reactive-swipe-content');
                    var $content;
                    if (content.length === 0) {
                        throw "<reactive-swipe-content> not found."
                    } else {
                        content = content[0];
                        $content = angular.element(content)[0];
                    }

                    var left = $container.find('reactive-swipe-left-actions');
                    var $left = angular.element(left)[0];
                    var right = $container.find('reactive-swipe-right-actions');
                    var $right = angular.element(right)[0];

                    var limit = { left: 60, right: 120 };
                    var swipe = { left: false, right: false };
                    var initialPosition;
                    var offset;

                    content.addEventListener('touchstart', onStart, { capture: false, passive: true });
                    content.addEventListener('mousedown', onStart, { capture: false, passive: true });
                    content.addEventListener('touchmove', onMove, { capture: false, passive: true });
                    content.addEventListener('mousemove', onMove, { capture: false, passive: true });
                    content.addEventListener('touchcancel', onEnd, { capture: false, passive: true });
                    content.addEventListener('touchend', onEnd, { capture: false, passive: true });
                    content.addEventListener('mouseup', onEnd, { capture: false, passive: true });

                    this.$onDestroy = function $onDestroy() {
                        content.removeEventListener('touchstart', onStart);
                        content.removeEventListener('mousestart', onStart);
                        content.removeEventListener('touchmove', onMove);
                        content.removeEventListener('mousemove', onMove);
                        content.removeEventListener('touchcancel', onEnd);
                        content.removeEventListener('touchend', onEnd);
                        content.removeEventListener('mouseend', onEnd);
                    }

                    function onStart(event) {
                        console.log(event);
                        initialPosition = event.touches[0].clientX;
                    }

                    function onMove(event) {
                        offset = event.touches[0].clientX - initialPosition;

                        // Swipe left
                        if (offset > 0) {
                            swipe.left = true;
                            swipe.right = false;

                            $left.classList.add('active');

                            if (offset > limit.left) {
                                offset = limit.left;
                            }
                        }

                        // Swipe right
                        else if (offset < 0) {
                            swipe.left = false;
                            swipe.right = true;

                            $right.classList.add('active');

                            if (offset < -1 * limit.right) {
                                offset = -1 * limit.right;
                            }
                        }

                        $content.style.left = offset + "px";
                    }

                    function onEnd(event) {
                        $left.classList.remove('active');
                        $right.classList.remove('active');
                        $content.classList.remove('out');
                        offset = 0;

                        $content.classList.add('out');
                        $content.style.left = "0px";
                    }
                }
            };
        }]);
})();
