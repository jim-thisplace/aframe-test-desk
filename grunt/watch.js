// Watches for changes to CSS or email templates then runs grunt tasks
module.exports = {
    options : {
        livereload : false
    },
    html    : {
        files : ['index.html']
    },
    js      : {
        files   : ["*.js"],
        "tasks" : ["browserify"]
    }
};
