Number.prototype.toHHMMSS = function() {
    var sec_num = this;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = minutes + ':' + parseInt(seconds).toFixed();
    return time;
}

var my_media = null;
var msecsPerUpdate = 1000 / 60; // 60fps
var p = $('progress');
var duration = 5; //seconds
var interval = 0;
var repeat = false;
var mediaTimer = null;
var currentmp3 = '';
// Play audio
var page = 'home';
//
var istart = null;
var start = 0;
var musicready = true;
var preview = [];
var icek = false;
var itxt = '';
var index = 0;
var app = {
    dominit: function() {
        $('.addto').unbind('click').click(function() {
            //navigator.notification.alert($(this).attr('data-title')+' added');
            app.addSong($(this).attr('data-title'), $(this).attr('data-val'), $(this).attr('data-img'));
            //alert($(this).text() + ' added to current playlist');
            $(this).remove();

        });

    },
    init: function() {
        var page;
        $('#shuffle').click(function() {
            var name = currentpls;
            var o = $.totalStorage('playlist_' + name);
            $.totalStorage('playlist_' + name, shuffle(o));
            app.loadPlaylist(name);
        })
        $('#repeat').click(function() {
            if (repeat) {
                repeat = false;
                $('#repeat').css('color', '#777');
            } else {
                repeat = true;
                $('#repeat').css('color', '#9e9');
            }
        })

        $('#play').click(function() {
            if ($(this).hasClass('glyphicon-play')) {
                if (!musicready) return false;
                app.play();

                $(this).removeClass('glyphicon-play').addClass('glyphicon-pause');
            } else
            if ($(this).hasClass('glyphicon-pause')) {
                if (my_media)
                    my_media.pause();
                clearTimeout(icek);
                $(this).removeClass('glyphicon-pause').addClass('glyphicon-play');

            }
        });
        $('.glyphicon-step-backward').click(function() {
            if (!musicready) return false;
            var o = $.totalStorage('playlist_' + currentpls);
            if (!o) return false;
            if (o[index - 1]) {
                index--;
                currentmp3 = o[index].link;
                window.plugin.notification.local.cancelAll();
                window.plugin.notification.local.add({
                    id: '1', // A unique id of the notifiction
                    message: 'Playing ' + o[index].title, // The message that is displayed
                    title: 'LuxMusic', // The title of the message
                }, function() {
                    console.log('x');
                });
                
                app.stop();
                app.play();
            } else {
                //repeat
            }

        })
        $('.glyphicon-step-forward').click(function() {
            if (!musicready) return false;
            var o = $.totalStorage('playlist_' + currentpls);
            if (!o) return false;
            if (o[index + 1]) {
                index++;
                currentmp3 = o[index].link;
                window.plugin.notification.local.cancelAll();
                window.plugin.notification.local.add({
                    id: '1', // A unique id of the notifiction
                    message: 'Playing ' + o[index].title, // The message that is displayed
                    title: 'LuxMusic', // The title of the message
                }, function() {
                    console.log('x');
                });
                
                app.stop();
                app.play();
            } else {
                //repeat
            }

        })
        $('.glyphicon-fast-backward').click(function() {
            if (!musicready) return false;
            index = 0;
            var o = $.totalStorage('playlist_' + currentpls);
            if (!o) return false;
            if (o[index]) {
                currentmp3 = o[index].link;
                window.plugin.notification.local.cancelAll();
                window.plugin.notification.local.add({
                    id: '1', // A unique id of the notifiction
                    message: 'Playing ' + o[index].title, // The message that is displayed
                    title: 'LuxMusic', // The title of the message
                }, function() {
                    console.log('x');
                });
                
                app.stop();
                app.play();
            } else {
                //repeat
            }

        })
        $('.glyphicon-fast-forward').click(function() {
            if (!musicready) return false;
            var o = $.totalStorage('playlist_' + currentpls);
            if (!o) return false;


            if (o[o.length - 1] && o.length > 1) {
                index = o.length - 1;
                currentmp3 = o[index].link;
                window.plugin.notification.local.cancelAll();
                window.plugin.notification.local.add({
                    id: '1', // A unique id of the notifiction
                    message: 'Playing ' + o[index].title, // The message that is displayed
                    title: 'LuxMusic', // The title of the message
                }, function() {
                    console.log('x');
                });
                
                app.stop();
                app.play();
            } else {
                //repeat
            }

        })
        $('.icon-play').click(function(e) {
            e.preventDefault();
            app.playsong();
        });

        $('.icon-pause').click(function() {
            $('progress[value]').stop();
        });

        // Set progress bar to 0
        $('.icon-previous, .icon-first').click(function() {
            $('progress').attr("value", "0");
        });

        // Highlight controls on click
        $('ul.controls li i').click(function() {
            if ($(this).hasClass('green')) {
                $(this).removeClass('green');
            } else {
                $(this).addClass('green');
            }
        });

        if (!QueryString.page) {
            page = 'home';
        } else {
            page = QueryString.page;
        }
        $('#' + page).show();

        $('#searchbtn').click(function(e) {
            app.search($('#search').val());

        });
        $('#playsearchbtn').click(function(e) {
            app.search($('#playsearch').val());

        });
        $('.searchme').keyup(function(e) {
            var code = e.keyCode || e.which;
            /* Act on the event */
            
            if (code == 13) { //Enter keycode
                app.search($(this).val());
            }
        });
        $('#playsearch').keyup(function(e) {
            var code = e.keyCode || e.which;
            /* Act on the event */
            console.log(code);
            if (code == 13) { //Enter keycode
                app.search($(this).val());
            }
        });
        $('.searchbtn').click(function(e) {
            app.search($('#search').val());

        })
        $('.playsearchbtn').click(function(e) {
            app.search($('#playsearch').val());

        });
        //app.listPlaylist();
        app.onsize();

    },
    onsize: function() {
        setTimeout(function() {
            $('.music-player').css('height', screen.height - 100);
            
        }, 500);


    },
    removePlaylist: function(name) {
        localStorage.removeItem('playlist_' + name);
        var o = $.totalStorage('playlist_all');
        var x = 0;
        for (var i in o) {

            if (o[i] == name) {
                o.splice(x, 1);
            }
            x++;
        }

        $.totalStorage('playlist_all', o);
        if (o.length > 0) {
            currentpls = o[o.length - 1];
            $.totalStorage('playlist', currentpls);
        } else {
            $('#currentplaylist').html('Create New Playlist' + '<span class="caret rightmid"></span>');
            currentpls = null;
            $.totalStorage('playlist', currentpls);
        }
        app.listPlaylist();

    },
    loadPlaylist: function(name) {

        app.show('list');
        $('.title').html(name+' playlist');
        var o = $.totalStorage('playlist_' + name);
        var i = 0;
        $('#playlist').html('');
        currentpls = name;
        if (o) {
            for (i = 0; i < o.length; i++) {
                
                $('<li><div class="thumbnail track" data-id="' + o[i].id + '"  data-img="' + o[i].img + '" data-val="' + o[i].link + '" data-title="' + o[i].title + '" ><img src="'+o[i].img+'" alt=""></div><div class="title">' + o[i].title.substring(0, 37) + '</div>   <button class="btn-added close remove" data-id="' + o[i].id + '" data-dismiss="alert" ><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 2.56c-7.424 0-13.44 6.019-13.44 13.44 0 7.424 6.018 13.44 13.44 13.44s13.44-6.018 13.44-13.44-6.018-13.44-13.44-13.44zm2.766 13.44l4.898 4.898-2.766 2.766-4.898-4.898-4.898 4.898-2.765-2.766 4.896-4.898-4.896-4.896 2.765-2.766 4.898 4.896 4.898-4.896 2.766 2.765-4.898 4.898z"></path></svg></button> </li>').appendTo($('#playlist'));
            }
         }else{
            $('<br/<br/<br/<br/<br/><center><span style="font-size:20px" > empty playlist</span></center>').appendTo($('#playlist'));
         }
        if (o && index == 0) {
            currentmp3 = o[0].link;
            
        } else {
            $('#playlist .item').css('font-size', '1em');
            $('#playlist .item').eq(index).css('font-size', '1.3em');
        }
        //$('#currentplaylist').html(name + '<span class="caret rightmid"></span>');

        $.totalStorage('playlist', name);
        $('.remove').unbind('click').bind('click', function() {
            var o = $.totalStorage('playlist_' + currentpls);
            for (var i in o) {
                if (o[i].id == $(this).attr('data-id'))
                    o.splice(i, 1);
            }

            $.totalStorage('playlist_' + currentpls, o);
            $(this).parent().remove();
            index--;
        })
        $('.track').unbind('touchend').bind('touchend', function() {
            if (!musicready) return false;

            var o = $.totalStorage('playlist_' + currentpls);
            for (var i in o) {
                if (o[i].id == $(this).attr('data-id')) {
                    $('#thumb').attr('src',o[i].img);
                    index = parseInt(i);
                    break;
                }
            }

            window.plugin.notification.local.cancelAll();
            window.plugin.notification.local.add({
                id: '1', // A unique id of the notifiction
                message: 'Playing ' + $(this).attr('data-title'), // The message that is displayed
                title: 'LuxMusic', // The title of the message
            }, function() {
                console.log('x');
            });

            currentmp3 = $(this).attr('data-val');
            app.show('player');
            app.stop();
            
            app.play();
        })
    },
    listPlaylist: function() {
        var o = $.totalStorage('playlist_all');
        var i = 0;
        var ok = '';
        if (o)
            for (i = 0; i < o.length; i++) {                
                img='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path d="M9.776 4.366v18.987c-1.034-.216-2.237-.134-3.43.307-2.683.997-3.63 3.424-2.918 5.418.71 1.995 2.811 2.802 5.494 1.805 2.278-.846 3.771-2.722 3.733-4.491v-15.685l11.362-2.603v12.048c-1.034-.216-2.237-.134-3.43.307-2.685.997-3.632 3.424-2.92 5.418.712 1.995 2.811 2.802 5.496 1.805 2.28-.846 3.77-2.722 3.734-4.491v-22.502l-17.12 3.678z"/></svg>';
                var nw = $.totalStorage('playlist_' + o[i]);
                if(nw && nw.length>0){
                    img='<img src="'+nw[0].img+'" height="64px" />';
                }
                ok +='<li><a href="#" onclick="app.loadPlaylist(' + "'" + o[i] + "'" + ')"><div class="thumbnail"><div class="default">'+img+'</div></div><div class="title">'+o[i]+'</div></a><button class="btn-added close" data-dismiss="alert" onclick="app.removePlaylist(' + "'" + o[i] + "'" + ')" ><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 2.56c-7.424 0-13.44 6.019-13.44 13.44 0 7.424 6.018 13.44 13.44 13.44s13.44-6.018 13.44-13.44-6.018-13.44-13.44-13.44zm2.766 13.44l4.898 4.898-2.766 2.766-4.898-4.898-4.898 4.898-2.765-2.766 4.896-4.898-4.896-4.896 2.765-2.766 4.898 4.896 4.898-4.896 2.766 2.765-4.898 4.898z"/></svg></button></li>';
            }
        $('#listplaylist').html(ok);
        if (o) {
            return o.length;
        } else {
            return 0;
        }
    },
    _createPlaylist: function(name) {
        if(name){
        var o = $.totalStorage('playlist_all');
        var pl = [];
        if (o) {
            pl = o;
        }
        pl.push(name);
        $.totalStorage('playlist_all', pl);
        app.listPlaylist();
        if (!currentpls) {
            //app.loadPlaylist(name);
        }
        }else{
            alert('Cannot empty');
        }
    },
    createPlaylist: function() {
        var name = prompt('Playlist name');
        if (name)
            app._createPlaylist(name);
    },
    addSong: function(title, link, img) {
        var o = $.totalStorage('playlist_' + $.totalStorage('playlist'));
        var x = {};
        x.title = title;
        x.link = link;
        x.id = Date.now();
        x.img = img;
        var pl = [];
        if (o) {
            pl = o;
        }
        pl.push(x);
        $.totalStorage('playlist_' + $.totalStorage('playlist'), pl);

    },
    preview: function(a) {

        var o = $.totalStorage('playlist_' + $.totalStorage('playlist'));
        var img = o[a].img;
        if (img.indexOf('http:') < 0) {
            img = 'http:' + img;
        }
        $('#thumb').attr('src', img);

    },
    removeSong: function(th) {
        var o = $.totalStorage('playlist_' + $.totalStorage('playlist'));
        var i = 0;
        if (o)
            for (i = 0; i < o.length; i++) {
                if (o[i].title == $(th).siblings('.jp-playlist-item').text())
                    o.splice(i, 1);
            }

        $.totalStorage('playlist_' + $.totalStorage('playlist'), o);

    },
    search: function(txt) {

        $('.page').hide();
        $('#result').html('');
        $('#addnew').show();
        $('#loading').show();
        itxt = txt;
        $('#addnew #search').val(txt);
        $.getJSON('http://192.241.237.10:4000/output.json', {
            site: 'youtube',
            key: txt,
            start: start
        }).done(function(data) {
            //var data=$.parseJSON(data);
            var o=data;
            for (var i in o) {
                var img = o[i].img;
                if (img.indexOf('http:') < 0) {
                    img = 'http:' + img;
                }
                
                 $('<li data-id="' + o[i].id + '"  data-img="' + img + '" data-val="' + o[i].link + '" data-title="' + o[i].title + '" class="addto"><div class="thumbnail track"  ><img src="'+img+'" alt=""></div><div class="title">' + o[i].title.substring(0, 37) + '</div> </li>').appendTo($('#result'));
            }
            $('#result').append('<button class="btn btn-success fullwidth btn-large" id="next" onclick="app.next();">Next</button>');
            app.dominit();
            $('#loading').hide();
            $("#next").show();
        }).fail(function() {
            alert('Connection error');
        });

    },
    next: function() {
        start++;
        $('.page').hide();
        $('#result').html('');
        $('#addnew').show();
        $('#loading').show();
        $('#addnew #search').val(itxt);
        $.getJSON('http://jsplay.net:4000/output.json', {
            site: 'youtube',
            key: itxt,
            start: start
        }).done(function(data) {
            //var data=$.parseJSON(data);

            var o=data;
            for (var i in o) {
                var img = o[i].img;
                if (img.indexOf('http:') < 0) {
                    img = 'http:' + img;
                }
                
                 $('<li data-id="' + o[i].id + '" class="addto"><div class="thumbnail track" data-id="' + o[i].id + '"  data-img="' + img + '" data-val="' + o[i].link + '" data-title="' + o[i].title + '" ><img src="'+img+'" alt=""></div><div class="title">' + o[i].title.substring(0, 37) + '</div> </li>').appendTo($('#result'));

            }
            $('#result').append('<button class="btn btn-success btn-large fullwidth" id="next" onclick="app.next();">Next</button>');
            app.dominit();
            $('#loading').hide();
            $("#next").show();
        }).fail(function() {
            alert('Connection error');
        });

    },
    show: function(id) {
        page = id;
        $('.page').hide();
        $('#' + id).show();
        if(id=='home'){
            $('.title').html('Playlists');
        }
    },
    setMp3: function(src) {
        currentmp3 = src;
        app.play();
    },
    play: function() {
        // Create Media object from src
        if (musicready) {

            $('#playlist .item').css('font-size', '1em');
            $('#playlist .item').eq(index).css('font-size', '1.3em');
            if (!my_media) {
                $('progress').val(0);
                if (!currentmp3) {
                    var o = $.totalStorage('playlist_' + currentpls);
                    if (o) {
                        currentmp3 = o[0].link;
                        $('#thumb').attr('src',o[0].img );
                    } else {
                        return false;
                    }
                }
                my_media = new Media(currentmp3, function() {
                    console.log('loaded');
                }, function() {
                    console.log('error');
                });

                // Play audio
                my_media.play();
                musicready = false;
                app.onstart();
            } else {
                app.cek();
                my_media.play();
            }
        }

    },
    onstart: function() {
        if (my_media.getDuration() < 0) {
            istart = setTimeout(app.onstart, 1000);
        } else {
            console.log('start playing');
            $('#duration').html(my_media.getDuration().toHHMMSS());
            console.log(my_media.getDuration());
            interval = $('progress').attr('max') / my_media.getDuration();
            app.cek();
            musicready = true;

        }
    },
    cek: function() {
        $('progress').val($('progress').val() + interval);
        $('#pro').width($('progress').val());
        if (my_media)
            my_media.getCurrentPosition(function(position) {
                $('#now').html(position.toHHMMSS());
            }, function() {
                app.stop(true);
            });

        if ($('progress').val() + interval < $('progress').attr('max')) {
            icek = setTimeout(app.cek, 1000);
            $('i.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
        } else {
            $('progress').val($('progress').attr('max'));
            $('i.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
            app.stop(true);
        }
    },
    pause: function() {

        my_media.pause();

    },

    stop: function(auto) {
        window.clearTimeout(icek);
        window.clearTimeout(istart);
        if (my_media) {
            my_media.stop();
            my_media = null;
            $('progress').val(0);
            $('#now').html('0:0');
            $('#duration').html('0:0');
        }
        if (auto) {

            var o = $.totalStorage('playlist_' + currentpls);
            if (o[index + 1]) {
                index++;
                currentmp3 = o[index].link;
                window.plugin.notification.local.cancelAll();
                window.plugin.notification.local.add({
                    id: '1', // A unique id of the notifiction
                    message: 'Playing ' + o[index].title, // The message that is displayed
                    title: 'LuxMusic', // The title of the message
                }, function() {
                    console.log('x');
                });
                
                app.play();
            } else {
                if (repeat) {
                    index = 0;
                    if (o[index]) {
                        index++;
                        currentmp3 = o[index].link;
                        window.plugin.notification.local.cancelAll();
                        window.plugin.notification.local.add({
                            id: '1', // A unique id of the notifiction
                            message: 'Playing ' + o[index].title, // The message that is displayed
                            title: 'LuxMusic', // The title of the message
                        }, function() {
                            console.log('x');
                        });
                        
                        app.play();
                    }
                }
            }
        }
    },

    setAudioPosition: function(position) {
        console.log(position);
    }

}
window.addEventListener("resize", function() {
    // Get screen size (inner/outerWidth, inner/outerHeight)
    app.onsize();
}, false);

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
