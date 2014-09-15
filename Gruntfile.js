module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: true,
				// sourceMapIncludeSources: true,
        		sourceMapName: 'colorPicker.js.map',
        		report: 'gzip'
			},
		    my_target: {
		      files: {
		        'color.all.min.js': ['colors.js', 'colorPicker.data.js', 'colorPicker.js']
		      }
		    }
		  }
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);

};