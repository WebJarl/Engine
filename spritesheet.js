var spritesheet = (function(){


    return new function() {
        this.createSpritesheet = function(image_path, tile_width, tile_height, first_gid) {
            var sheet = {};
    
            sheet.image = new Image();
            sheet.image.src = image_path;
            sheet.tile_width = tile_width;
            sheet.tile_height = tile_height;
            sheet.width = 0;
            sheet.height = 0;
            sheet.loaded = false;
            sheet.sprite = 0;
            sheet.first_gid = first_gid ? first_gid : 0;
    
            sheet.image.addEventListener('load', function() {
                sheet.width = sheet.image.width;
                sheet.height = sheet.image.height;
                sheet.loaded = true;
            });
    
            return sheet;
        };
    };
}());
