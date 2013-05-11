(function($) {
    $.fn.tumble = function(options) {

        //Default options
        var settings = $.extend({
            "sequence": "random" //can be either "random" or a function
        }, options);

        //collection
        var _collection = this;
        //initial coordinates of the elements
        var coords = {};
        //new coordinates
        var newCoords = {};
        //temporary "proxy"-clones of the elements
        var clones = {};

        //Save current coordinates
        _collection.each(function(i, element){
            coords[i] = {
                top: $(element).offset().top,
                left: $(element).offset().left
            };
            clones[i] = $(element).clone().css("visibility", "hidden");
        });

        /**
         * Set absolute positioning for current elements
         * @todo Save current CSS properties (to restore them later)
         **/
        _collection.each(function(i, element){
            $(element).css({
                position: "absolute",
                top: coords[i].top,
                left: coords[i].left
            });
        });

        var replaceSequence = new Array(_collection.length);
        for (var k=0;k<replaceSequence.length;k++) {
            replaceSequence[k]=k;
        }

        //proper shuffle
        if (settings.sequence == 'random') {
            replaceSequence = shuffleArray(replaceSequence);
        }

        //proper replace
        _collection.each(function(i, element){
            $(clones[replaceSequence[i]]).insertAfter($(element));
        });

        /**
         *  After clones are inserted and took appropriate positions,
         *  collect their new coordinates
         */
        _collection.each(function(i, element){
            newCoords[i] = {
                top: clones[i].offset().top,
                left: clones[i].offset().left
            };
            $(element).insertAfter(clones[i]);
        });

        //Move elements of the collection to the new coordinates and remove clones
        _collection.each(function(i, element){
            $(element).animate({
                top: newCoords[i].top,
                left: newCoords[i].left
            }, 1000, (function (z) {
                return function() {
                    clones[z].remove();
                }
            })(i));
        }).promise().done(function() {
                //Restore static position
                _collection.each(function(i, element){

                    $(element).css("position", "static");
                });
        });


        /**
         * An implementation of Sattolo's algorithm
         * http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#Sattolo.27s_algorithm
         */
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * i); // no +1 here!
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        return this;
    };
}(jQuery));
