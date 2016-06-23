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
                controller: function controller($scope, $element, $attrs, $transclude) {
                    var container = $element[0];
                    var $container = angular.element(container);

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
                    var transitionTimeout;



                    function onTouchstart(event) {
                        if (transitionTimeout !== undefined) { return; }
                        initialPosition = event.touches[0].clientX;
                    }

                    function onTouchmove(event) {
                        if (transitionTimeout !== undefined) { return; }

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

                    function onTouchend(event) {
                        if (transitionTimeout !== undefined) { return; }

                        transitionTimeout = window.setTimeout(function () {
                            transitionTimeout = undefined;
                            $left.classList.remove('active');
                            $right.classList.remove('active');
                            $content.classList.remove('out');
                        }, 1000);

                        $content.classList.add('out');
                        $content.style.left = "0px";
                    }



                    content.addEventListener('touchstart', onTouchstart, { capture: false, passive: true });
                    content.addEventListener('touchmove', onTouchmove, { capture: false, passive: true });
                    content.addEventListener('touchcancel', onTouchend, { capture: false, passive: true });
                    content.addEventListener('touchend', onTouchend, { capture: false, passive: true });

                    this.$onDestroy = function $onDestroy() {
                        content.removeEventListener('touchstart', onTouchstart);
                        content.removeEventListener('touchmove', onTouchmove);
                        content.removeEventListener('touchcancel', onTouchend);
                        content.removeEventListener('touchend', onTouchend);
                    }
                }
            };
        }]);
})();
