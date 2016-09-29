// Watches for changes to CSS or email templates then runs grunt tasks
module.exports = {
    options : {
        livereload : false
    },
    html    : {
        files : ['*.html']
    },

    js : {
        files   : ["index.js"],
        "tasks" : ["browserify", "uglify"]
    }
};
