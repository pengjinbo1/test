var fs = require('fs'),
    path = require('path');
var cheerio = require('cheerio');
// secret = require('./secret.json');
var srcPath = './grunts/public';
var clientPath = './grunts/public';
var serverPath = './grunts/script';
var clientFilePath = [];
var serverFilePath = [];
var babelFilePath = [];
module.exports = function (grunt) {
    grunt.initConfig({
        // config: grunt.file.readJSON('secret.json'),
        name: 'IT',
        srcITDir: '../itv_ph',
        destITDir: './grunts',
        srcITClientDir: './grunts/public/',
        destTClientDir: './grunts/public/',
        // secret: secret,

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                node: true,
                es5: true
            },
            files: {
                src: ['../itv_ph/public/lib/t.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-ssh');
    // grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks('grunt-node-optimize');
    // grunt.loadNpmTasks('grunt-node-optimize');
    // grunt.loadNpmTasks('grunt-regenerator');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-debug');

    grunt.config('babel', {
        options: {
            "sourceMap": false,
        },
        dist: {
            files: {}
        }
    })

    grunt.config('copy.itv', {
        files: [{
            expand: true,
            cwd: '<%= srcITDir %>',
            src: ['**', '!node_modules/**', '!release/**'],
            dest: '<%=destITDir%>/'
        },]
    });

    //把test下面的testReceiver.html复制到打包文件
    grunt.config('copy.test', {
        files: [{
            expand: true,
            cwd: '<%= srcITDir %>',
            src: ['public/test/testReceiver.html', 'public/test/testSender1.html', 'public/js/panel/*.js', 'script/orm/Link.js'],
            dest: '<%=destITDir%>/'
        },]
    });

    grunt.config('replace.index', {
        src: ['<%= srcITDir %>/public/index.html'],
        dest: '<%= destITDir %>/public/',
        replacements: [{
            from: '<script type="text/javascript" src="./js/Main.js"></script>',
            to: 'temp/compress/itv-client-min.js'
        }, {
            from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
            to: ''
        },
        {
            from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
            to: '<script type="text/javascript" src="./js/config.js"></script>'
        }, {
            from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
            to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
        }, {
            from: 'temp/compress/itv-client-min.js',
            to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script>',
        }
        ]
    });

    grunt.config('replace.rackEditor', {
        src: ['<%= srcITDir %>/public/rackEditor.html'],
        dest: '<%= destITDir %>/public/',
        replacements: [
            // { //2016-12-28 make不合并到core中
            //     from: /\<script .*\"..\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
            },
        ]
    });

    grunt.config('replace.admin', {
        src: ['<%= srcITDir %>/public/admin/index.html'],
        dest: '<%= destITDir %>/public/admin/',
        replacements: [
            // { //2016-12-28 make不合并到core中
            //     from: /\<script .*\"..\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\"..\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/t.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="../libs/core-twaver.js"></script>'

            }, {
                from: /\<script .*\"..\/libs\/itv-all-min.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/twaver.js"\>\<\/script\>/g,
                to: ''
            },
        ]
    });

    grunt.config('replace.deveditor', {
        src: ['<%= srcITDir %>/public/admin/deviceEditor.html'],
        dest: '<%= destITDir %>/public/admin/',
        replacements: [
            // {//2016-12-28 make不合并到core中
            //     from: /\<script .*\"..\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\"..\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="../libs/core-twaver.js"></script>'
            },
        ]
    });

    grunt.config('replace.pad', {
        src: ['<%= srcITDir %>/public/pad.html'],
        dest: '<%= destITDir %>/public/',
        replacements: [{
            from: '<script type="text/javascript" src="./js/Main.js"></script>',
            to: 'temp/compress/itv-client-min.js'
        }, {
            from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
            to: ''
        },
        {
            from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
            to: '<script type="text/javascript" src="./js/config.js"></script>'
        }, {
            from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
            to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
        }, {
            from: 'temp/compress/itv-client-min.js',
            to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script>',
        }
        ]
    });

    grunt.config('replace.index1', {
        src: ['<%= srcITDir %>/public/index1.html'],
        dest: '<%= destITDir %>/public/',
        replacements: [{
            from: '<script type="text/javascript" src="./js/Main.js"></script>',
            to: 'temp/compress/itv-client-min.js'
        }, {
            from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
            to: ''
        },
        {
            from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
            to: ''
        }, {
            from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
            to: '<script type="text/javascript" src="./js/config.js"></script>'
        }, {
            from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
            to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
        }, {
            from: 'temp/compress/itv-client-min.js',
            to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script>',
        }
        ]
    });


    grunt.config('replace.datatype', {
        src: ['<%= srcITDir %>/public/admin/datatype.html'],
        dest: '<%= destITDir %>/public/admin/',
        replacements: [
            // { //2016-12-28 make不合并到core中
            //     from: /\<script .*\"..\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\"..\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="../libs/core-twaver.js"></script>'
            },
            //                {
            //                    from: 'temp/compress/itv-admin-min.js',
            //                    to: '<script type="text/javascript" src="./js/compress/itv-admin-min.js"></script>',
            //                }
        ]
    });

    grunt.config('replace.tempjsIndex', {
        src: ['<%= srcITDir %>/public/admin//tempjs/index.html'],
        dest: '<%= destITDir %>/public/admin/',
        replacements: [
            // { //2016-12-28 make不合并到core中
            //     from: /\<script .*\"..\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\"..\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/twaver.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/t.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="../libs/core-twaver.js"></script>'
            },
        ]
    });

    grunt.config('replace.scene', {
        src: ['<%= srcITDir %>/public/admin/scene.html'],
        dest: '<%= destITDir %>/public/admin/',
        replacements: [
            // { //2016-12-28 make不合并到core中
            //     from: /\<script .*\"..\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\"..\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\"..\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="../libs/core-twaver.js"></script>'
            },
        ]
    });

    grunt.config('replace.app', {
        src: ['<%= srcITDir %>/app/app.html'],
        dest: '<%= destITDir %>/app/',
        replacements: [
            // { //2016-12-28 make不合并到core中
            //     from: /\<script .*\".\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
            }, {
                from: '<script type="text/javascript" src="./js/app.js"></script>',
                to: 'temp/compress/itv-client-min.js'
            }, {
                from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: 'temp/compress/itv-client-min.js',
                to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script><script type="text/javascript" src="./js/app.js"></script>',
            },
        ]
    });

    grunt.config('replace.floor', {
        src: ['<%= srcITDir %>/app/floor.html'],
        dest: '<%= destITDir %>/app/',
        replacements: [
            // {
            //     from: /\<script .*\".\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
            }, {
                from: '<script type="text/javascript" src="./js/app.js"></script>',
                to: 'temp/compress/itv-client-min.js'
            }, {
                from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: 'temp/compress/itv-client-min.js',
                to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script><script type="text/javascript" src="./js/app.js"></script>',
            },
        ]
    });

    grunt.config('replace.rack', {
        src: ['<%= srcITDir %>/app/rack.html'],
        dest: '<%= destITDir %>/app/',
        replacements: [
            // {
            //     from: /\<script .*\".\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
            }, {
                from: '<script type="text/javascript" src="./js/app.js"></script>',
                to: 'temp/compress/itv-client-min.js'
            }, {
                from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: 'temp/compress/itv-client-min.js',
                to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script><script type="text/javascript" src="./js/app.js"></script>',
            },
        ]
    });

    grunt.config('replace.second', {
        src: ['<%= srcITDir %>/app/second.html'],
        dest: '<%= destITDir %>/app/',
        replacements: [
            // {
            //     from: /\<script .*\".\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
            }, {
                from: '<script type="text/javascript" src="./js/app.js"></script>',
                to: 'temp/compress/itv-client-min.js'
            }, {
                from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: 'temp/compress/itv-client-min.js',
                to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script><script type="text/javascript" src="./js/app.js"></script>',
            },
        ]
    });

    grunt.config('replace.third', {
        src: ['<%= srcITDir %>/app/third.html'],
        dest: '<%= destITDir %>/app/',
        replacements: [
            // {
            //     from: /\<script .*\".\/libs\/twaver-make.js"\>\<\/script\>/g,
            //     to: ''
            // },
            {
                from: /\<script .*\".\/libs\/twaver-doodle.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/mono_toolkits.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/t.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/itv-all-min.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/libs\/twaver.js"\>\<\/script\>/g,
                to: '<script type="text/javascript" src="./libs/core-twaver.js"></script>'
            }, {
                from: '<script type="text/javascript" src="./js/app.js"></script>',
                to: 'temp/compress/itv-client-min.js'
            }, {
                from: /\<script .*\"js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: /\<script .*\".\/js\/.*\.js"\>\<\/script\>/g,
                to: ''
            }, {
                from: 'temp/compress/itv-client-min.js',
                to: '<script type="text/javascript" src="./js/compress/itv-client-min.js"></script><script type="text/javascript" src="./js/app.js"></script>',
            },
        ]
    });


    grunt.config('clean', {
        itvclient: {
            src: ["<%= destITDir %>/public/js/*.js", "!<%= destITDir %>/public/js/config.js", "!<%= destITDir %>/public/js/rackEditor.js", "!<%= destITDir %>/public/js/utils.js", "!<%= destITDir %>/public/js/makeTool.js"]
        },
        itvclient2: {
            src: ["<%= destITDir %>/public/js/**/*.js", "!<%= destITDir %>/public/js/compress/itv-client-min.js", "!<%= destITDir %>/public/js/config.js", "!<%= destITDir %>/public/js/rackEditor.js", "!<%= destITDir %>/public/js/utils.js", "!<%= destITDir %>/public/js/makeTool.js","!<%= destITDir %>/public/js/gaugePage/*.js"]
        },
        orm: {
            src: ['<%= destITDir %>/script/orm']
        },
        twaver: {
            src: ["<%= destITDir %>/public/libs/twaver*.js",
                "<%= destITDir %>/public/libs/t.js",
                "<%= destITDir %>/public/libs/t_*.js",
                "<%= destITDir %>/public/libs/mono_toolkits.js",
                "<%= destITDir %>/public/libs/itv-all-min*.js",
                "!<%= destITDir %>/public/libs/twaver-make.js",
            ]
        },

        testhtml: {
            src: ["<%= destITDir %>/public/test*.html",
                "<%= destITDir %>/public/test",
                // "<%= destITDir %>/*.sql"
            ]
        }

    });



    // VR相关的js
    grunt.config('itvVRFiles', [
        '<%= srcITClientDir %>/js/_start.js',
        '<%= srcITClientDir %>/js/vr/VideoPane.js',
        '<%= srcITClientDir %>/js/vr/VideoEntity.js',
        '<%= srcITClientDir %>/js/vr/AppMenuPane.js',
        '<%= srcITClientDir %>/js/vr/HelpMenu.js',
        '<%= srcITClientDir %>/js/vr/InfoPaneManager.js',
        '<%= srcITClientDir %>/js/vr/VREventHandle.js',
        '<%= srcITClientDir %>/js/vr/VRUtil.js',
        '<%= srcITClientDir %>/js/vr/WebVRApp.js',
        '<%= srcITClientDir %>/js/_end.js',
    ]);

    //IT架构相关的js
    grunt.config('itvITFiles', [
        '<%= srcITClientDir %>/js/_start.js',
        '<%= srcITClientDir %>/js/itmv/ITVCategory.js',
        '<%= srcITClientDir %>/js/itmv/ITVConfigItem.js',
        '<%= srcITClientDir %>/js/itmv/ITVLayer.js',
        '<%= srcITClientDir %>/js/itmv/ITVConfigItemLayer.js',
        '<%= srcITClientDir %>/js/itmv/ITVRelationType.js',
        '<%= srcITClientDir %>/js/itmv/ITVRelation.js',
        '<%= srcITClientDir %>/js/itmv/ITVDataManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVAlarm.js',
        '<%= srcITClientDir %>/js/itmv/ITVAlarmManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVDefaultModelManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVVisibleManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVVirtualManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVGroupManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVHandler.js',
        '<%= srcITClientDir %>/js/itmv/ITVRelationManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVOutLayouter.js',
        '<%= srcITClientDir %>/js/itmv/ITVManager.js',
        '<%= srcITClientDir %>/js/itmv/ITVPanel.js',
        '<%= srcITClientDir %>/js/itmv/ITVPanelMgr.js',
        '<%= srcITClientDir %>/js/_end.js',
    ]);

    grunt.config('concat.itv-client', {
        src: [
            '<%= itvClientFiles %>'
        ],
        dest: '<%= srcITClientDir %>js/compress/itv-client.js'
    });

    grunt.config('concat.itv-vr', {
        src: [
            '<%= itvVRFiles %>'
        ],
        dest: '<%= srcITClientDir %>js/compress/itv-vr.js'
    });

    grunt.config('concat.itv-it', {
        src: [
            '<%= itvITFiles %>'
        ],
        dest: '<%= srcITClientDir %>js/compress/itv-it.js'
    });

    grunt.config('allSDK', [
        '<%= srcITClientDir %>/libs/twaver.js',
        '<%= srcITClientDir %>/libs/t.js',
        //        '<%= srcITClientDir %>/libs/mono_toolkits.js',
        // '<%= srcITClientDir %>/libs/twaver-make.js',
        '<%= srcITClientDir %>/libs/twaver-doodle.js',
        '<%= srcITClientDir %>/libs/itv-all-min.js',
    ]);

    grunt.config('concat.core', {
        src: [
            '<%= allSDK %>'
        ],
        dest: '<%= srcITClientDir %>libs/core-twaver.js'
    });

    grunt.config('uglify', {
        T: {
            src: '<%= srcITClientDir %>libs/t.js',
            dest: '<%= destTClientDir %>libs/t.js'
        },
        tmake: {
            src: '<%= srcITClientDir %>libs/core-twaver.js',
            dest: '<%= destTClientDir %>libs/core-twaver.js'
        },

        itvmake: {
            src: '<%= srcITClientDir %>libs/twaver-make.js',
            dest: '<%= destTClientDir %>libs/twaver-make.js'
        },
        base: {
            src: '<%= srcITDir %>/script/router/base.js',
            dest: '<%= destITDir %>/script/router/base.js'
        },
        uploadFile: {
            src: '<%= srcITDir %>/script/uploadFile.js',
            dest: '<%= destITDir %>/script/uploadFile.js'
        },
        app: {
            src: '<%= srcITDir %>/script/app.js',
            dest: '<%= destITDir %>/script/app.js'
        },
        uploadModels: {
            src: '<%= srcITDir %>/script/uploadModels.js',
            dest: '<%= destITDir %>/script/uploadModels.js'
        },
        itvclient: {
            src: '<%= srcITClientDir %>js/compress/itv-client-babel.js',
            dest: '<%= srcITClientDir %>js/compress/itv-client-min.js'
        },
        itvvr: {
            src: '<%= srcITClientDir %>js/compress/itv-vr.js',
            dest: '<%= srcITClientDir %>js/compress/itv-vr-min.js'
        },
        itvit: {
            src: '<%= srcITClientDir %>js/compress/itv-it.js',
            dest: '<%= srcITClientDir %>js/compress/itv-it-min.js'
        },
    });


    grunt.config('jshint.IT', {
        options: {
            curly: true,
            // eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            unused: true,
            boss: true,
            eqnull: true,
            node: true,
            es5: true
        },
        files: {
            src: [
                '<%= srcITClientDir %>js/compress/it.js'
            ],
        }
    });

    grunt.config('node_optimize', {
        dist: {
            options: {
                ignore: [
                    '<%= destITDir %>/script/config.js',
                    '<%= destITDir %>/node_modules/**'
                ]
            },
            files: {
                '<%= destITDir %>/script/index.optimized.js': '<%= destITDir %>/script/index.js'
            }
        }
    });

    /*
    grunt.config('regenerator', {
        options: {
            includeRuntime: false
        },
        dist: {
            files: {
                '<%= destITDir %>/script/orm/Data.js': '<%= srcITDir %>/script/orm/Data.js',
                // '<%= destITDir %>/script/util.js':'<%= srcITDir %>/script/util.js',
                // '<%= destITDir %>/script/login.js': '<%= srcITDir %>/script/login.js',
                '<%= destITDir %>/script/orm/Link.js': '<%= srcITDir %>/script/orm/Link.js',
                //          '<%= destITDir %>/script/base.js' : '<%= srcITDir %>/script/base.js',
                //          '<%= destITDir %>/script/modules/asset/alarm.js' : '<%= destITDir %>/script/modules/asset/alarm.js',
                //          '<%= destITDir %>/script/modules/asset/alarm_log.js' : '<%= destITDir %>/script/modules/asset/alarm_log.js',
                //          '<%= destITDir %>/script/modules/asset/alarm_type.js' : '<%= destITDir %>/script/modules/asset/alarm_type.js',
                //          '<%= destITDir %>/script/modules/asset/asset.js' : '<%= destITDir %>/script/modules/asset/asset.js',
                //          '<%= destITDir %>/script/modules/asset/asset_info.js' : '<%= destITDir %>/script/modules/asset/asset_info.js',
                //          '<%= destITDir %>/script/modules/asset/asset_ip.js' : '<%= destITDir %>/script/modules/asset/asset_ip.js',
                //          '<%= destITDir %>/script/modules/asset/asset_log.js' : '<%= destITDir %>/script/modules/asset/asset_log.js',
                //          '<%= destITDir %>/script/modules/asset/asset_move_recode.js' : '<%= destITDir %>/script/modules/asset/asset_move_recode.js',
                //          '<%= destITDir %>/script/modules/asset/asset_query.js' : '<%= destITDir %>/script/modules/asset/asset_query.js',
                //          '<%= destITDir %>/script/modules/asset/asset_type.js' : '<%= destITDir %>/script/modules/asset/asset_type.js',
                //          '<%= destITDir %>/script/modules/asset/building.js' : '<%= destITDir %>/script/modules/asset/building.js',
                //          '<%= destITDir %>/script/modules/asset/asset_remove.js' : '<%= destITDir %>/script/modules/asset/asset_remove.js',
                //          '<%= destITDir %>/script/modules/asset/asset_query_equipment.js' : '<%= destITDir %>/script/modules/asset/asset_query_equipment.js',
                //          '<%= destITDir %>/script/modules/asset/ac.js' : '<%= destITDir %>/script/modules/asset/ac.js',
                //          '<%= destITDir %>/script/modules/asset/power_rack_ip.js' : '<%= destITDir %>/script/modules/asset/power_rack_ip.js',
                //          '<%= destITDir %>/script/modules/asset/dev_move_out_ip.js' : '<%= destITDir %>/script/modules/asset/dev_move_out_ip.js',
                //          '<%= destITDir %>/script/modules/asset/air_condition_info.js' : '<%= destITDir %>/script/modules/asset/air_condition_info.js',
                //          '<%= destITDir %>/script/modules/asset/ups_info.js' : '<%= destITDir %>/script/modules/asset/ups_info.js',
                //          '<%= destITDir %>/script/modules/asset/storage_battery_info.js' : '<%= destITDir %>/script/modules/asset/storage_battery_info.js',
                //          '<%= destITDir %>/script/modules/asset/rackheader_info.js' : '<%= destITDir %>/script/modules/asset/rackheader_info.js',
                //          '<%= destITDir %>/script/modules/asset/alternator_info.js' : '<%= destITDir %>/script/modules/asset/alternator_info.js',
                //          '<%= destITDir %>/script/modules/asset/integrate_control.js' : '<%= destITDir %>/script/modules/asset/integrate_control.js',
            }
        },
    });

    grunt.registerTask('genIT', [
        'regenerator'
    ]);

    */

    //通过解析index.html来判断前端到底要合并哪些文件
    grunt.registerTask('compute', '解析index.html整合要打包的文件', function (arg1, arg2) {
        // var buffer = grunt.file.read('/TWaver/git/itv-server-standar/public/index.html');
        // console.log(buffer);
        // var path = '/TWaver/git/itv-server-standar/public';
        var html = fs.readFileSync(srcPath + '/index.html');
        var $ = cheerio.load(html, {
            ignoreWhitespace: false,
            // xmlMode: false,
            lowerCaseTags: false
        });
        var jfs = $('script');
        var excludes = ['./js/config.js'];
        var files = []; //解析html,将要合并的js加到数组中
        files.push('<%= srcITClientDir %>/js/_start.js');
        for (var i = 0; i < jfs.length; i++) {
            var src = jfs[i].attribs.src;
            if (excludes.includes(src)) {
                continue;
            }
            var regExp1 = /.*\/js\/.*\.js/;
            var regExp2 = /.*\/.\/js\/.*\.js/;
            if (regExp1.exec(src) || regExp2.exec(src)) {
                src = src.replace('./', '');
                // console.log(src);
                files.push('<%= srcITClientDir %>/' + src)
            }
        }
        files.push('<%= srcITClientDir %>/js/_end.js');
        grunt.config('itvClientFiles', files);
    });

    //遍历前端的文件夹，one by one的混淆每个文件夹中的每个js文件
    grunt.registerTask('computeCleint', '混淆前端代码', function (arg1, arg2) {
        var filePath = path.resolve(clientPath);
        var filters = ['config.js'];
        var fileDisplay = function (filePath) {
            //根据文件路径读取文件，返回文件列表
            var files = fs.readdirSync(filePath);
            if (!files) {
                return;
            }
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                var stats = fs.statSync(filedir);
                if (!stats) {
                    return;
                }
                var isFile = stats.isFile(); //是文件
                var isDir = stats.isDirectory(); //是文件夹
                if (isFile) {
                    if (filename.endsWith('.js')) {
                        for (var i = 0; i < filters.length; i++) {
                            if (filename == filters[i]) {
                                return;
                            }
                        }
                        // console.log('filename:' + filename);
                        // console.log('++path+filename:' + filedir);
                        // var jsName = filename.replace('.js', ''); //用名字不太好，可能存在重名的，因此用全路径比较好
                        var jsName = filedir.replace('.', '').replace('/', '').replace(':', '');
                        grunt.config('uglify.' + jsName, {
                            src: '' + filedir,
                            dest: '' + filedir
                        });
                        clientFilePath.push('uglify:' + jsName);
                    }
                }
                if (isDir && filename != 'libs' &&
                    filename != 'theme' &&
                    filename != 'modellib' &&
                    filename != 'font') { //不处理libs、theme、modellib等文件家中的文件
                    fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                }
            });
        }
        fileDisplay(filePath);
        console.log('deal with file finished!')
        // grunt.registerTask('uglifyCleint',clientFilePath);
    });

    //遍历后端的文件夹，one by one的混淆每个文件夹中的每个js文件
    grunt.registerTask('computeServer', '混淆后端代码', function (arg1, arg2) {

        var filePath = path.resolve(serverPath);
        var filters = ['config.js', 'ErrorCode.js', 'json.date-extensions.js', 'Data.js',
            'Upgrade.js', 'Config.js','Model.js','login.js','util.js',
            'client_tcp.js', 'index.js'
             // ,'ModbusDataHandle.js', 'ModbusReceiverHandle.js' //router/下
        ];
        var filterPaths = [
            // 'script/modbus/node_modules',
            // 'script/testmssql',
            // 'script/wechat/demo',
            // 'script/wechat/test',
            // 'script/modbus',
            'libs']; //过滤某些文件夹


        var filePath = path.resolve(serverPath);
        var fileDisplay = function (filePath) {
            //根据文件路径读取文件，返回文件列表
            var files = fs.readdirSync(filePath);
            if (!files) {
                return;
            }
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                var stats = fs.statSync(filedir);
                if (!stats) {
                    return;
                }
                var isFile = stats.isFile(); //是文件
                var isDir = stats.isDirectory(); //是文件夹
                if (isFile) {
                    if (filename.endsWith('.js')) {
                        for (var i = 0; i < filters.length; i++) {
                            if (filename == filters[i]) {
                                return;
                            }
                        }
                        // console.log('filename:' + filename);
                        // console.log('++path+filename:' + filedir);
                        // var jsName = filename.replace('.js', ''); //用名字不太好，可能存在重名的，因此用全路径比较好
                        var jsName = filedir.replace(/\./g, '').replace('/', '').replace(':', '');
                        babelFilePath.push({
                            src: '' + filedir,
                            dest: '' + filedir
                        });
                        grunt.config('uglify.' + jsName, {
                            src: '' + filedir,
                            dest: '' + filedir
                        });
                        serverFilePath.push('uglify:' + jsName);
                    }
                }
                if (isDir) {
                    for (var j = 0; j < filterPaths.length; j++) {
                        // if (filename == filterPaths[j]) { //用filename不太好，可能不同的文件夹中有同名的文件夹
                            // console.log('dir:'+filedir)
                        var cloneFileDir = filedir;
                        var clonePathj = filterPaths[j];
                        if (filterPaths[j] && cloneFileDir.replace(/\\/g,'').endsWith(clonePathj.replace(/\//g,''))) { //这样可以没Path加上上一级，可以避免同名的文件夹的问题
                            console.log('after dir:'+filedir);
                            return;
                        }
                         // console.log('after dir:'+filedir)
                    }
                    fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                }
            });
        }
        fileDisplay(filePath);
        console.log('deal with file finished!');
        // console.log(serverRegeneratorFiles);
        // grunt.registerTask('uglifyCleint',clientFilePath);
    });

    grunt.registerTask('uglifyCleint', clientFilePath);
    grunt.registerTask('uglifyServer', serverFilePath);
    grunt.config('babel.toES5', {
        files: babelFilePath
    })
    grunt.config('babel.itvclient', {

        src: '<%= srcITClientDir %>js/compress/itv-client.js',
        dest: '<%= srcITClientDir %>js/compress/itv-client-babel.js'

    })
    // grunt.config('babel.test', {
    //     files: [{
    //         src: ['/Users/mac/Documents/GitPro/new-theme/public/test/a.js', '/Users/mac/Documents/GitPro/new-theme/public/test/b.js'],
    //         dest: '/Users/mac/Documents/GitPro/new-theme/public/test/a123.js'
    //     }]
    // })
    // grunt.registerTask('default', ['babel:test']);

    grunt.registerTask('uglifyScript', ['computeServer', 'babel:toES5', 'uglifyServer']);

    grunt.registerTask('uglifyGen', ['uglify:tmake', 'uglify:itvmake']); //,'uglify:T' tmake include T  // remove'uglify:editor',

    grunt.registerTask('itvclient', ['compute', 'concat:itv-client']);

    //  grunt.registerTask('default',['concat:IT','uglify:IT']);
    grunt.registerTask('default', ['compute', 'concat:itv-client', 'babel:itvclient', 'uglify:itvclient', 'concat:core']); //'concat:itv-admin','uglify:itvadmin','uglify:T'
    grunt.registerTask('cleanAll', ['clean:all']);
    grunt.registerTask('test111',['concat:core'])
    grunt.registerTask('replaceHTML', ['replace:index', 'replace:admin', 'replace:pad','replace:index1', 'replace:datatype', 'replace:deveditor', 'replace:scene',
        'replace:app', 'replace:floor', 'replace:rack', 'replace:second', 'replace:third', 'replace:rackEditor'
    ]);
    // grunt.registerTask('replaceOnline', ['replace:online1', 'replace:online2']);
    // grunt.registerTask('replacePublish', ['replace:publish']);
    grunt.registerTask('copyIT', ['copy:itv']);
    grunt.registerTask('copyTest', ['copy:test']);
    // grunt.registerTask('cleanIT', ['clean:itvclient', 'clean:itvclient2', 'clean:orm', 'clean:twaver', 'clean:customer', 'clean:testhtml']); //,'clean:itvadmin','clean:itvadmin2'
    grunt.registerTask('cleanIT', ['clean:itvclient', 'clean:itvclient2',
        // 'clean:orm',
        'clean:twaver', 'clean:testhtml'
    ]); //,'clean:itvadmin','clean:itvadmin2'

    // grunt.registerTask('sftpIT', ['sftp:it']);
    // grunt.registerTask('execIT', ['sshexec:it'], function(arg) {
    //     grunt.verbose.write("fdasfadsfdsa");
    //     console.log("fdsafs");
    // });

    grunt.registerTask('nodeMerge', ['node_optimize:dist']);

    // grunt.registerTask('jshintIT',['jshint:IT']);

    // grunt.registerTask('publish', ['replacePublish']);
    // grunt.registerTask('upload', ['replaceOnline', 'sftpIT']);

    grunt.registerTask('itv', ['copyIT','default', 'replaceHTML', 'cleanIT',
        // 'genIT',
        'uglifyScript', 'uglifyGen', 'copyTest'
    ]);

};