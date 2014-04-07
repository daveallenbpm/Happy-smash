define(['underscore'], function(_){
    var Config = Object.create(null);

    _.extend(Config, {
        width : 1200,
        height : 600
    });

    return Config;
});